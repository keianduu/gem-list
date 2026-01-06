/* components/SearchFilter.js */
"use client";

export default function SearchFilter({ 
  categories, 
  onFilterChange 
}) {
  const handleChange = (key, value) => {
    onFilterChange(key, value);
  };

  return (
    <div className="filter-glass-bar fade-in">
      
      {/* --- Category Selector --- */}
      <div className="custom-select-wrapper">
        {/* 宝石アイコン */}
        <svg className="select-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          {/* シンプルな宝石/タグっぽいアイコン */}
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>

        <select 
          className="custom-select"
          onChange={(e) => handleChange('category', e.target.value)}
        >
          <option value="">All Gemstones</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>{cat.name}</option>
          ))}
        </select>

        {/* 下矢印 */}
        <svg className="select-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </div>

      {/* --- Divider (PCのみ) --- */}
      <div className="filter-divider"></div>

      {/* --- Price Selector --- */}
      <div className="custom-select-wrapper">
        {/* 通貨アイコン */}
        <svg className="select-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>

        <select 
          className="custom-select"
          onChange={(e) => handleChange('priceRange', e.target.value)}
        >
          <option value="">Any Price</option>
          <option value="under-10000">Under ¥10,000</option>
          <option value="10000-30000">¥10,000 - ¥30,000</option>
          <option value="30000-50000">¥30,000 - ¥50,000</option>
          <option value="over-50000">Over ¥50,000</option>
        </select>

        {/* 下矢印 */}
        <svg className="select-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </div>

      {/* --- Divider (PCのみ) --- */}
      <div className="filter-divider"></div>

      {/* --- Toggle Switch --- */}
      <div className="toggle-wrapper disabled" title="Currently fixed to TOP items only">
        <label className="toggle-label" htmlFor="top-search-toggle">
          Search in TOP
        </label>
        <div style={{ position: 'relative' }}>
          <input 
            type="checkbox" 
            id="top-search-toggle"
            className="toggle-checkbox"
            checked={true}
            disabled
            style={{ display: 'none' }} // デフォルトのチェックボックスは隠す
          />
          <div className="toggle-switch"></div>
        </div>
      </div>

    </div>
  );
}