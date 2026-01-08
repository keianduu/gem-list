/* components/FilterPopup.js */
"use client";

export default function FilterPopup({ 
  isOpen, 
  onClose, 
  availableOptions,
  filters,
  onFilterChange,
  onReset
}) {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const categories = availableOptions?.categories || [];
  const accessories = availableOptions?.accessories || []; // ★追加
  const priceRanges = availableOptions?.priceRanges || [];
  
  const isPriceDisabled = priceRanges.length === 0;
  const isAccessoryDisabled = accessories.length === 0; // ★追加: アイテムがない場合は無効化

  return (
    <div 
      className={`filter-modal-overlay ${isOpen ? 'open' : ''}`} 
      onClick={handleOverlayClick}
    >
      <div className="filter-modal-content">
        
        <div className="filter-modal-header">
          <h2 className="filter-modal-title">Refine Search</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="filter-body">
          {/* Category */}
          <div className="filter-section">
            <label>Category</label>
            <div className="custom-select-wrapper" style={{ width: '100%', background: '#f9f9f9', borderRadius: '12px' }}>
              <svg className="select-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <select 
                className="custom-select" 
                style={{ width: '100%' }}
                value={filters.category}
                onChange={(e) => onFilterChange('category', e.target.value)}
              >
                <option value="">All Gemstones</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
              <svg className="select-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
          </div>

          {/* ★追加: Accessory Type */}
          <div className="filter-section" style={{ opacity: isAccessoryDisabled ? 0.5 : 1, transition: 'opacity 0.3s' }}>
            <label>Accessory Type</label>
            <div className="custom-select-wrapper" style={{ width: '100%', background: '#f9f9f9', borderRadius: '12px' }}>
              {/* リング風のアイコン */}
              <svg className="select-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a5 5 0 0 0-5 5v2a7 7 0 0 0 14 0V7a5 5 0 0 0-5-5zm0 2a3 3 0 0 1 3 3v2h-6V7a3 3 0 0 1 3-3z" />
              </svg>
              <select 
                className="custom-select" 
                style={{ width: '100%', cursor: isAccessoryDisabled ? 'not-allowed' : 'pointer' }}
                value={filters.accessory}
                onChange={(e) => onFilterChange('accessory', e.target.value)}
                disabled={isAccessoryDisabled}
              >
                <option value="">{isAccessoryDisabled ? "No Accessories Available" : "All Accessories"}</option>
                {accessories.map((acc) => (
                  <option key={acc.id} value={acc.name}>{acc.name}</option>
                ))}
              </select>
              <svg className="select-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
          </div>

          {/* Price */}
          <div className="filter-section" style={{ opacity: isPriceDisabled ? 0.5 : 1, transition: 'opacity 0.3s' }}>
            <label>Price Range</label>
            <div className="custom-select-wrapper" style={{ width: '100%', background: '#f9f9f9', borderRadius: '12px' }}>
              <svg className="select-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <select 
                className="custom-select" 
                style={{ width: '100%', cursor: isPriceDisabled ? 'not-allowed' : 'pointer' }}
                value={filters.priceRange}
                onChange={(e) => onFilterChange('priceRange', e.target.value)}
                disabled={isPriceDisabled}
              >
                <option value="">{isPriceDisabled ? "No Products Available" : "Any Price"}</option>
                {priceRanges.map((range) => (
                  <option key={range.value} value={range.value}>{range.label}</option>
                ))}
              </select>
              <svg className="select-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
          </div>

          {/* Toggle */}
          <div className="filter-section">
            <label>Option</label>
            <div className="toggle-wrapper disabled" style={{ background: '#f9f9f9', borderRadius: '12px', justifyContent: 'space-between' }}>
              <span className="toggle-label" style={{ fontSize: '0.9rem' }}>Search in TOP items only</span>
              <div style={{ position: 'relative' }}>
                <input type="checkbox" checked disabled className="toggle-checkbox" style={{ display: 'none' }} />
                <div className="toggle-switch"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-actions" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <button 
            onClick={onReset}
            style={{ 
              background: 'none', border: 'none', 
              color: '#888', fontFamily: 'var(--font-en)', fontSize: '0.9rem', 
              cursor: 'pointer', textDecoration: 'underline' 
            }}
          >
            Clear All
          </button>

          <button className="apply-btn" onClick={onClose}>
            Show Results
          </button>
        </div>

      </div>
    </div>
  );
}