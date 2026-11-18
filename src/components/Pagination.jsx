function Pagination({ page, totalPages, totalResults, onPageChange }) {
  if (totalResults === 0) return null

  return (
    <nav className="pagination" aria-label="Product pages">
      <p className="pagination__summary">
        Page {page} of {totalPages} <span>({totalResults} products)</span>
      </p>
      <div className="pagination__buttons">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          Next
        </button>
      </div>
    </nav>
  )
}

export default Pagination
