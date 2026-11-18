import { useEffect, useMemo, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { fetchAllProducts, fetchProductCategories } from '../api/products.js'
import Pagination from '../components/Pagination.jsx'
import ProductCard from '../components/ProductCard.jsx'
import ProductFilters from '../components/ProductFilters.jsx'

const PRODUCTS_PER_PAGE = 12
const UNBRANDED_VALUE = '__unbranded__'

function getListingErrorMessage(error) {
  if (!error.response) {
    return 'We could not connect to the store. Check your connection and try again.'
  }
  if (error.response.status >= 500) {
    return 'The product catalog is temporarily unavailable. Please try again shortly.'
  }
  return 'We could not load the product catalog. Please try again.'
}

function getCategoryValue(category) {
  return typeof category === 'string' ? category : category?.slug
}

function getProductBrand(product) {
  return typeof product.brand === 'string' ? product.brand.trim() : ''
}

function ProductListingPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    let isCurrent = true

    Promise.all([fetchAllProducts(), fetchProductCategories()])
      .then(([allProducts, availableCategories]) => {
        if (!isCurrent) return
        setProducts(allProducts)
        setCategories(availableCategories)
      })
      .catch((requestError) => {
        if (!isCurrent) return
        setError(getListingErrorMessage(requestError))
      })
      .finally(() => {
        if (isCurrent) setLoading(false)
      })

    return () => {
      isCurrent = false
    }
  }, [retryCount])

  const category = searchParams.get('category') || ''
  const brand = searchParams.get('brand') || ''
  const minPrice = searchParams.get('minPrice') || ''
  const maxPrice = searchParams.get('maxPrice') || ''
  const requestedPage = Number.parseInt(searchParams.get('page') || '1', 10)
  const page = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1
  const minValue = minPrice === '' ? null : Number(minPrice)
  const maxValue = maxPrice === '' ? null : Number(maxPrice)

  let priceError = ''
  if (
    (minPrice !== '' && (!Number.isFinite(minValue) || minValue < 0)) ||
    (maxPrice !== '' && (!Number.isFinite(maxValue) || maxValue < 0))
  ) {
    priceError = 'Enter valid prices that are zero or greater.'
  } else if (minValue !== null && maxValue !== null && minValue > maxValue) {
    priceError = 'Minimum price must be less than or equal to maximum price.'
  }

  const brands = useMemo(() => {
    const uniqueBrands = new Set()
    let hasUnbrandedProducts = false

    products.forEach((product) => {
      const productBrand = getProductBrand(product)
      if (productBrand) uniqueBrands.add(productBrand)
      else hasUnbrandedProducts = true
    })

    const options = [...uniqueBrands]
      .sort((first, second) => first.localeCompare(second))
      .map((value) => ({ value, label: value }))

    if (hasUnbrandedProducts) {
      options.unshift({ value: UNBRANDED_VALUE, label: 'Unbranded' })
    }

    return options
  }, [products])

  const filteredProducts = useMemo(() => {
    if (priceError) return []

    return products.filter((product) => {
      const matchesCategory =
        !category || getCategoryValue(product.category) === category
      const productBrand = getProductBrand(product)
      const matchesBrand =
        !brand ||
        (brand === UNBRANDED_VALUE ? !productBrand : productBrand === brand)
      const matchesMinPrice = minValue === null || product.price >= minValue
      const matchesMaxPrice = maxValue === null || product.price <= maxValue

      return (
        matchesCategory && matchesBrand && matchesMinPrice && matchesMaxPrice
      )
    })
  }, [products, category, brand, minValue, maxValue, priceError])

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE))
  const currentPage = Math.min(page, totalPages)

  useEffect(() => {
    if (loading || error) return

    const expectedPage = String(currentPage)
    if (searchParams.get('page') === expectedPage) return

    const nextParams = new URLSearchParams(searchParams)
    nextParams.set('page', expectedPage)
    setSearchParams(nextParams, { replace: true })
  }, [currentPage, error, loading, searchParams, setSearchParams])

  const pageProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE
    return filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE)
  }, [filteredProducts, currentPage])

  function updateFilter(name, value) {
    const nextParams = new URLSearchParams(searchParams)
    if (value) nextParams.set(name, value)
    else nextParams.delete(name)
    nextParams.set('page', '1')
    setSearchParams(nextParams, { replace: true })
  }

  function updatePage(nextPage) {
    const nextParams = new URLSearchParams(searchParams)
    nextParams.set('page', String(nextPage))
    setSearchParams(nextParams)
  }

  function clearFilters() {
    setSearchParams({ page: '1' }, { replace: true })
  }

  function retryLoadingProducts() {
    setError('')
    setLoading(true)
    setRetryCount((count) => count + 1)
  }

  if (loading) {
    return (
      <section className="listing-state" aria-live="polite">
        <p>Loading products…</p>
      </section>
    )
  }

  if (error) {
    return (
      <section className="listing-state listing-state--error" role="alert">
        <h1>Products could not be loaded</h1>
        <p>{error}</p>
        <button type="button" onClick={retryLoadingProducts}>
          Try again
        </button>
      </section>
    )
  }

  return (
    <section className="listing-page" aria-labelledby="listing-title">
      <div className="listing-heading">
        <div>
          <p className="eyebrow">Leegality Store</p>
          <h1 id="listing-title">Discover products</h1>
        </div>
        <p className="listing-heading__count">
          {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
        </p>
      </div>

      <div className="listing-layout">
        <ProductFilters
          categories={categories}
          brands={brands}
          category={category}
          brand={brand}
          minPrice={minPrice}
          maxPrice={maxPrice}
          priceError={priceError}
          onCategoryChange={(value) => updateFilter('category', value)}
          onBrandChange={(value) => updateFilter('brand', value)}
          onMinPriceChange={(value) => updateFilter('minPrice', value)}
          onMaxPriceChange={(value) => updateFilter('maxPrice', value)}
          onClear={clearFilters}
        />

        <div className="listing-results">
          {priceError ? (
            <div className="empty-state" role="status">
              Correct the price range to see matching products.
            </div>
          ) : pageProducts.length > 0 ? (
            <>
              <div className="product-grid">
                {pageProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    currentLocation={location}
                  />
                ))}
              </div>
              <Pagination
                page={currentPage}
                totalPages={totalPages}
                totalResults={filteredProducts.length}
                onPageChange={updatePage}
              />
            </>
          ) : (
            <div className="empty-state" role="status">
              <h2>No products found</h2>
              <p>Try changing or clearing your filters.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default ProductListingPage
