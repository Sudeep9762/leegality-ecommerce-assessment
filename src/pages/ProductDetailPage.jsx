import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { fetchProductById } from '../api/products.js'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

function getProductErrorMessage(error) {
  if (!error.response) {
    return 'We could not connect to the store. Check your connection and try again.'
  }
  if (error.response.status === 404) {
    return 'We could not find a product with that ID.'
  }
  if (error.response.status >= 500) {
    return 'The product service is temporarily unavailable. Please try again shortly.'
  }
  return 'We could not load this product. Please try again.'
}

function ProductDetailPage() {
  const { id } = useParams()
  const location = useLocation()
  const returnTo = location.state?.from ?? '/'
  const isValidProductId = /^[1-9]\d*$/.test(id || '')
  const [product, setProduct] = useState(null)
  const [selectedImage, setSelectedImage] = useState('')
  const [retryCount, setRetryCount] = useState(0)
  const [requestState, setRequestState] = useState({
    id: null,
    status: 'loading',
    error: '',
  })

  useEffect(() => {
    if (!isValidProductId) return undefined

    let isCurrent = true

    fetchProductById(id)
      .then((productData) => {
        if (!isCurrent) return
        setProduct(productData)
        setRequestState({ id, status: 'success', error: '' })
      })
      .catch((requestError) => {
        if (!isCurrent) return
        setRequestState({
          id,
          status: 'error',
          error: getProductErrorMessage(requestError),
        })
      })

    return () => {
      isCurrent = false
    }
  }, [id, isValidProductId, retryCount])

  const images = useMemo(() => {
    if (!product) return []
    return [...new Set([...(product.images || []), product.thumbnail].filter(Boolean))]
  }, [product])

  if (!isValidProductId) {
    return (
      <section className="detail-state detail-state--error" role="alert">
        <h1>Invalid product ID</h1>
        <p>Product IDs must be positive whole numbers.</p>
        <Link className="detail-back-link" to={returnTo}>
          &larr; Back to products
        </Link>
      </section>
    )
  }

  const isCurrentRequest = requestState.id === id

  if (!isCurrentRequest || requestState.status === 'loading') {
    return (
      <section className="detail-state" aria-live="polite">
        <p className="detail-loading">Loading product details…</p>
      </section>
    )
  }

  if (requestState.status === 'error') {
    return (
      <section className="detail-state detail-state--error" role="alert">
        <h1>Product unavailable</h1>
        <p>{requestState.error}</p>
        <div className="detail-state__actions">
          <button
            className="detail-retry-button"
            type="button"
            onClick={() => {
              setRequestState({ id, status: 'loading', error: '' })
              setRetryCount((count) => count + 1)
            }}
          >
            Try again
          </button>
          <Link className="detail-back-link" to={returnTo}>
            Back to products
          </Link>
        </div>
      </section>
    )
  }

  if (!product || product.id !== Number(id)) return null

  const activeImage = images.includes(selectedImage) ? selectedImage : images[0]
  const brand = product.brand?.trim() || 'Brand unavailable'
  const rating = Number(product.rating)
  const ratingLabel = Number.isFinite(rating)
    ? `Rated ${rating.toFixed(1)} out of 5 stars`
    : 'No rating available'
  const category = product.category?.replaceAll('-', ' ') || 'Uncategorized'

  return (
    <section className="product-detail" aria-labelledby="detail-title">
      <Link className="detail-back-link" to={returnTo}>
        &larr; Back to products
      </Link>

      <div className="product-detail__layout">
        <div className="product-detail__gallery">
          <div className="product-detail__image-frame">
            {activeImage ? (
              <img
                className="product-detail__image"
                src={activeImage}
                alt={product.title}
              />
            ) : (
              <div className="product-detail__image-placeholder">
                Image unavailable
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="product-detail__thumbnails" aria-label="Product images">
              {images.map((image, index) => (
                <button
                  key={image}
                  className={`product-detail__thumbnail${
                    image === activeImage ? ' is-selected' : ''
                  }`}
                  type="button"
                  onClick={() => setSelectedImage(image)}
                  aria-label={`Show product image ${index + 1}`}
                  aria-pressed={image === activeImage}
                >
                  <img src={image} alt="" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="product-detail__information">
          <p className="eyebrow">{category}</p>
          <h1 id="detail-title">{product.title}</h1>

          <div
            className="product-detail__rating"
            role="img"
            aria-label={ratingLabel}
          >
            <span aria-hidden="true" className="product-detail__stars">
              {Array.from({ length: 5 }, (_, index) => (
                <span
                  className={index < Math.round(rating) ? 'is-filled' : ''}
                  key={index}
                >
                  ★
                </span>
              ))}
            </span>
            <span aria-hidden="true">
              {Number.isFinite(rating) ? rating.toFixed(1) : 'No rating'}
            </span>
          </div>

          <p className="product-detail__price">
            {currencyFormatter.format(product.price)}
          </p>

          <div className="product-detail__description">
            <h2>About this product</h2>
            <p>{product.description || 'No description is available.'}</p>
          </div>

          <dl className="product-detail__attributes">
            <div>
              <dt>Brand</dt>
              <dd>{brand}</dd>
            </div>
            <div>
              <dt>Category</dt>
              <dd className="product-detail__category">{category}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  )
}

export default ProductDetailPage
