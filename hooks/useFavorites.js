/* hooks/useFavorites.js */
"use client";

import { useState, useEffect } from 'react';

export function useFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 初回ロード時にlocalStorageから読み込み
  useEffect(() => {
    const stored = localStorage.getItem('gem_favorites');
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse favorites", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // 保存処理
  const saveFavorites = (updatedFavorites) => {
    setFavorites(updatedFavorites);
    localStorage.setItem('gem_favorites', JSON.stringify(updatedFavorites));
  };

  // 追加・削除のトグル
  const toggleFavorite = (item) => {
    const exists = favorites.some((fav) => fav.id === item.id);
    let updated;
    
    if (exists) {
      // 削除
      updated = favorites.filter((fav) => fav.id !== item.id);
    } else {
      // 追加 (保存するデータ量は必要最小限にするのがコツです)
      // ここではMasonryGridで表示に必要なデータのみを保存します
      const itemToSave = {
        id: item.id,
        type: item.type,
        name: item.name,
        price: item.price,
        desc: item.desc,
        image: item.image,
        link: item.link,
        category: item.category,
        categoryIcon: item.categoryIcon
      };
      updated = [...favorites, itemToSave];
    }
    
    saveFavorites(updated);
  };

  // 特定のIDがお気に入り済みかチェック
  const checkIsFavorite = (id) => {
    return favorites.some((fav) => fav.id === id);
  };

  return { favorites, toggleFavorite, checkIsFavorite, isLoaded };
}