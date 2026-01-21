"use server";

import { client } from "@/libs/microcms";

/**
 * Items retrieval Server Action with filtering and pagination
 */
export async function getItems({ offset = 0, limit = 24, filters = {} }) {
    try {
        const {
            category,
            accessory,
            priceRange,
            color,
            contentType = 'all'
        } = filters;

        const filterConditions = [];

        // 1. Content Type Filter
        if (contentType === 'product') {
            filterConditions.push('type[contains]product');
        } else if (contentType === 'journal') {
            filterConditions.push('type[contains]journal');
        }

        // 2. Category (Reference ID)
        if (category) {
            filterConditions.push(`relatedJewelries[contains]${category}`);
        }

        // 3. Accessory (Reference ID)
        if (accessory) {
            filterConditions.push(`relatedAccessories[contains]${accessory}`);
        }

        // 4. Color (String match)
        if (color) {
            filterConditions.push(`color.color[contains]${color}`);
        }

        // 5. Price Range
        if (priceRange && contentType !== 'journal') {
            if (priceRange === 'under-10000') {
                filterConditions.push('price[less_than]10000');
            } else if (priceRange === '10000-30000') {
                filterConditions.push('price[greater_than]10000[and]price[less_than]30000');
            } else if (priceRange === '30000-50000') {
                filterConditions.push('price[greater_than]30000[and]price[less_than]50000');
            } else if (priceRange === 'over-50000') {
                filterConditions.push('price[greater_than]50000');
            }
        }

        const queries = {
            limit,
            offset,
            orders: "-priority,-publishedAt",
            fields: "id,title,slug,publishedAt,thumbnail,thumbnailUrl,type,relatedJewelries,relatedAccessories,price,description,affiliateUrl,color,priority"
        };

        if (filterConditions.length > 0) {
            queries.filters = filterConditions.join('[and]');
        }

        const data = await client.get({
            endpoint: "archive",
            queries,
            customRequestInit: { next: { revalidate: 60 } }
        });

        const items = data.contents.map((content) => {
            const isProduct = content.type.includes('product');
            const relatedCategory = content.relatedJewelries?.[0];
            const categoryName = relatedCategory?.name || (isProduct ? "Item" : "Journal");
            const categoryIcon = relatedCategory?.image?.url || null;

            const relatedAccessory = Array.isArray(content.relatedAccessories) && content.relatedAccessories.length > 0
                ? content.relatedAccessories[0]
                : null;

            const accessoryName = relatedAccessory?.name || null;

            let itemLink = `/journals/${content.slug}`;
            if (isProduct) {
                itemLink = content.affiliateUrl || `/products/${content.slug}`;
            }

            let colorName = null;
            if (isProduct && content.color && Array.isArray(content.color.color)) {
                colorName = content.color.color[0] || null;
            }

            return {
                id: content.slug,
                type: isProduct ? 'product' : 'journal',
                name: content.title,
                price: isProduct && content.price ? `¥${Number(content.price).toLocaleString()}` : null,
                rawPrice: isProduct && content.price ? Number(content.price) : 0,
                desc: content.description,
                image: isProduct ? content.thumbnailUrl : content.thumbnail,
                link: itemLink,
                category: categoryName,
                categoryIcon: categoryIcon,
                accessory: accessoryName,
                color: colorName,
            };
        });

        return {
            contents: items,
            totalCount: data.totalCount,
        };

    } catch (error) {
        console.error("fetch items error", error);
        return { contents: [], totalCount: 0 };
    }
}

/**
 * Management List Server Action (No cache, product only, date sort)
 */
export async function getManagementItems({ offset = 0, limit = 24 }) {
    try {
        const queries = {
            filters: 'type[contains]product',
            limit,
            offset,
            orders: "-publishedAt",
            fields: "id,slug,title,price,thumbnailUrl,description,type,publishedAt"
        };

        const data = await client.get({
            endpoint: "archive",
            queries,
            customRequestInit: { next: { revalidate: 0 } }
        });

        // Formatting
        const items = data.contents.map((content) => ({
            id: content.slug,
            type: "product",
            name: content.title,
            price: content.price ? `¥${Number(content.price).toLocaleString()}` : "",
            image: content.thumbnailUrl,
            desc: content.description,
            link: `/products/${content.slug}` // Direct link for management check
        }));

        return {
            contents: items,
            totalCount: data.totalCount,
        };

    } catch (error) {
        console.error("fetch management items error", error);
        return { contents: [], totalCount: 0 };
    }
}
