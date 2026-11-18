import { Link } from 'react-router-dom'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

function ProductCard({ product, currentLocation }) {
  const brand = product.brand?.trim() || 'Brand unavailable'
  const rating = Number(product.rating)
  const ratingLabel = Number.isFinite(rating)
    ? `Rated ${rating.toFixed(1)} out of 5 stars`
    : 'No rating available'

  return (
    <article className="product-card">
      <Link
        className="product-card__link"
        to={`/product/${product.id}`}
        state={{ from: currentLocation }}
        aria-label={`View ${product.title} details`}
      >
        <div className="product-card__image-wrap">
          <img
            className="product-card__image"
            src={product.images?.[0] || product.thumbnail}
            alt={product.title}
            loading="lazy"
          />
        </div>
        <div className="product-card__content">
          <p className="product-card__brand">{brand}</p>
          <h2 className="product-card__title">{product.title}</h2>
          <p className="product-card__price">
            {currencyFormatter.format(product.price)}
          </p>
          <div
            className="product-card__rating"
            role="img"
            aria-label={ratingLabel}
          >
            <span aria-hidden="true">★</span>{' '}
            {Number.isFinite(rating) ? rating.toFixed(1) : 'No rating'}
            <span className="product-card__rating-max"> / 5</span>
          </div>
        </div>
      </Link>
    </article>
  )
}

export default ProductCard
