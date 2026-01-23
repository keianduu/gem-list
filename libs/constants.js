/* libs/constants.js */

// 国名・地域名（英語）と国旗の対応表
// microCMSで入力される可能性のある名称をキーにします
export const COUNTRY_FLAGS = {
  // --- Asia / Oceania ---
  "Myanmar": "🇲🇲",
  "India": "🇮🇳",
  "Sri Lanka": "🇱🇰",
  "Thailand": "🇹🇭",
  "Pakistan": "🇵🇰",
  "Kashmir": "🇮🇳", // カシミール（便宜上インド国旗）
  "Japan": "🇯🇵",   // 追加: 日本
  "Australia": "🇦🇺",
  "Tahiti": "🇵🇫",  // 追加: タヒチ（フランス領ポリネシア）
  "French Polynesia": "🇵🇫", // 追加: フランス領ポリネシア

  // --- Africa ---
  "Botswana": "🇧🇼",
  "Madagascar": "🇲🇬",
  "Tanzania": "🇹🇿",
  "Merelani": "🇹🇿", // メレラニ鉱山（タンザニア）
  "Mozambique": "🇲🇿",
  "Zambia": "🇿🇲",
  "Nigeria": "🇳🇬",
  "Egypt": "🇪🇬",
  "Ethiopia": "🇪🇹",

  // --- North / South America ---
  "USA": "🇺🇸",
  "America": "🇺🇸",
  "Arizona": "🇺🇸", // アリゾナ（米国）
  "Oregon": "🇺🇸",  // オレゴン（米国）
  "Canada": "🇨🇦",
  "Brazil": "🇧🇷",
  "Minas Gerais": "🇧🇷", // ミナスジェライス（ブラジル）
  "Colombia": "🇨🇴",
  "Uruguay": "🇺🇾",
  "Mexico": "🇲🇽",
  "Guatemala": "🇬🇹", // 追加: グアテマラ
  "Bolivia": "🇧🇴",   // 追加: ボリビア
  "Chile": "🇨🇱",     // 追加: チリ

  // --- Europe / Eurasia ---
  "Russia": "🇷🇺",
  "Norway": "🇳🇴",
  "Germany": "🇩🇪",
  "Afghanistan": "🇦🇫",

  // その他（デフォルト用）
  "Unknown": "🌍"
};

/* libs/constants.js */

// ... (既存の COUNTRY_FLAGS はそのまま) ...

// 誕生月データ定義
export const MONTHS_DATA = {
  1: { id: 1, ja: '1月', en: 'January', enShort: 'Jan.' },
  2: { id: 2, ja: '2月', en: 'February', enShort: 'Feb.' },
  3: { id: 3, ja: '3月', en: 'March', enShort: 'Mar.' },
  4: { id: 4, ja: '4月', en: 'April', enShort: 'Apr.' },
  5: { id: 5, ja: '5月', en: 'May', enShort: 'May' },
  6: { id: 6, ja: '6月', en: 'June', enShort: 'Jun.' },
  7: { id: 7, ja: '7月', en: 'July', enShort: 'Jul.' },
  8: { id: 8, ja: '8月', en: 'August', enShort: 'Aug.' },
  9: { id: 9, ja: '9月', en: 'September', enShort: 'Sep.' },
  10: { id: 10, ja: '10月', en: 'October', enShort: 'Oct.' },
  11: { id: 11, ja: '11月', en: 'November', enShort: 'Nov.' },
  12: { id: 12, ja: '12月', en: 'December', enShort: 'Dec.' },
};

/**
 * microCMSから来た値を安全に変換するヘルパー
 * @param {number|string} month - microCMSの値 (例: 1, "1")
 * @returns {object|null} 月データオブジェクト
 */
export const getMonthData = (month) => {
  const monthNum = Number(month);
  return MONTHS_DATA[monthNum] || null;
};