function getCategoryValue(category) {
  return typeof category === 'string' ? category : category.slug
}

function getCategoryLabel(category) {
  return typeof category === 'string' ? category : category.name
}

function ProductFilters({
  categories,
  brands,
  category,
  brand,
  minPrice,
  maxPrice,
  priceError,
  onCategoryChange,
  onBrandChange,
  onMinPriceChange,
  onMaxPriceChange,
  onClear,
}) {
  return (
    <aside className="filter-sidebar" aria-labelledby="filter-title">
      <div className="filter-sidebar__heading">
        <h2 id="filter-title">Filter results</h2>
        <button className="text-button" type="button" onClick={onClear}>
          Clear all
        </button>
      </div>

      <div className="filter-group">
        <label htmlFor="category-filter">Category</label>
        <select
          id="category-filter"
          value={category}
          onChange={(event) => onCategoryChange(event.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((item) => (
            <option key={getCategoryValue(item)} value={getCategoryValue(item)}>
              {getCategoryLabel(item)}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="brand-filter">Brand</label>
        <select
          id="brand-filter"
          value={brand}
          onChange={(event) => onBrandChange(event.target.value)}
        >
          <option value="">All brands</option>
          {brands.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <fieldset className="filter-group price-filter">
        <legend>Price (USD)</legend>
        <div className="price-filter__inputs">
          <label>
            <span>Minimum</span>
            <input
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              value={minPrice}
              onChange={(event) => onMinPriceChange(event.target.value)}
              aria-label="Minimum price in dollars"
            />
          </label>
          <label>
            <span>Maximum</span>
            <input
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              value={maxPrice}
              onChange={(event) => onMaxPriceChange(event.target.value)}
              aria-label="Maximum price in dollars"
            />
          </label>
        </div>
        {priceError && (
          <p className="filter-error" role="alert">
            {priceError}
          </p>
        )}
      </fieldset>
    </aside>
  )
}

export default ProductFilters
