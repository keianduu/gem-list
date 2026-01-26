
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(process.cwd(), 'libs/diagnosisData.js');
const backupFile = DATA_FILE + '.bak';

console.log(`Reading from ${DATA_FILE}`);
let content = fs.readFileSync(DATA_FILE, 'utf8');

// Backup
fs.writeFileSync(backupFile, content);

// 1. Build Name -> Slug Map
const nameToSlug = {};
const gemRegex = /name:\s*"(.+?)",\s*slug:\s*"(.+?)"/g;
let match;
while ((match = gemRegex.exec(content)) !== null) {
    nameToSlug[match[1]] = match[2];
    const name = match[1];
    if (name.includes('（')) {
        const shortName = name.split('（')[0];
        nameToSlug[shortName] = match[2];
        const inParens = name.split('（')[1].replace('）', '');
        nameToSlug[inParens] = match[2];
    }
}

// Manual aliases / overrides
const aliases = {
    "ガーネット": "garnet",
    "デマントイド": "demantoidgarnet",
    "ヒスイ": "jade",
    "翡翠": "jade",
    "翡翠（ヒスイ）": "jade",
    "水晶": "quartz",
    "アズライト": "azurite",
    "タイガーアイ": "tigereye",
    "スモーキークォーツ": "smokyquartz",
    "トルマリン": "tourmaline",
    "サンストーン": "heliolite",
};
Object.assign(nameToSlug, aliases);

console.log("Name to Slug Map loaded.");

// 2. Replace Logic
// We look for the pattern: 
// compatibleGems: [ ... ], (which we identified by indentation and structure)
// followed by compatibility: "..."

const replaceRegex = /(\s+compatibleGems: \[[\s\S]*?\],)(\s+compatibility: "([\s\S]*?)")/g;

let count = 0;
const newContent = content.replace(replaceRegex, (match, existingBlock, compatLineWithPrefix, compatText) => {
    count++;
    // Split by literal \n
    let rawLines = compatText.split('\\n');

    const newGems = rawLines.map(line => {
        line = line.trim();
        if (!line) return null;

        // Regex: Label：Name（Description）
        // Try precise match first
        const lineRegex = /^(.+?)：(.+?)（(.+?)）$/;
        let m = line.match(lineRegex);

        if (!m) {
            console.warn(`[WARN] Line format mismatch: "${line}". Trying loose match.`);
            // Fallback: split by ： and （
            // "Label：Name（Description）"
            const parts1 = line.split('：');
            if (parts1.length < 2) return null;
            const label = parts1[0];
            const rest = parts1.slice(1).join('：');

            const parts2 = rest.split('（');
            if (parts2.length < 2) return null;
            const gemName = parts2[0];
            const description = parts2.slice(1).join('（').replace(/）$/, '');
            m = [line, label, gemName, description];
            console.log(`[INFO] Loose matched: Label="${label}", Name="${gemName}", Desc="${description}"`);
        }

        const label = m[1];
        const gemName = m[2];
        const description = m[3];

        let slug = nameToSlug[gemName];
        if (!slug) {
            // Try lenient matching
            for (const [key, val] of Object.entries(nameToSlug)) {
                if (gemName.includes(key) || key.includes(gemName)) {
                    slug = val;
                    break;
                }
            }
        }

        if (!slug) {
            console.warn(`[ERROR] Missing slug for gem: "${gemName}"`);
            slug = "unknown";
        }

        return {
            slug: slug,
            label: label,
            description: description
        };
    }).filter(x => x);

    if (newGems.length === 0) {
        console.warn(`[SKIP] No gems parsed for block.`);
        return match;
    }

    const outerIndent = "        ";
    // Construct valid JS object string
    // compatibleGems: [
    //     { 
    //         slug: "garnet", 
    //         label: "最高の相棒", 
    //         description: "..." 
    //     },
    //     ...
    // ],

    const jsonStringLines = newGems.map(g => {
        return `${outerIndent}    { \n${outerIndent}        slug: "${g.slug}", \n${outerIndent}        label: "${g.label}", \n${outerIndent}        description: "${g.description}" \n${outerIndent}    }`;
    });

    // Ensure we preserve the comma if it was there implicitly (the regex consumed commas in existingBlock?)
    // existingBlock = "        compatibleGems: [\n ... \n        ],"
    // We replace it entirely.

    const newBlock = `${outerIndent}compatibleGems: [\n${jsonStringLines.join(',\n')}\n${outerIndent}],`;

    return '\n' + newBlock + compatLineWithPrefix;
});

console.log(`Processed ${count} entries.`);
fs.writeFileSync(DATA_FILE, newContent);
console.log("File updated.");
