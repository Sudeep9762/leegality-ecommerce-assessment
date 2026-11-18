import axios from 'axios'

const productsApi = axios.create({
  baseURL: 'https://dummyjson.com',
})

let allProductsRequest
let categoriesRequest
const productRequests = new Map()

export function fetchAllProducts() {
  if (!allProductsRequest) {
    allProductsRequest = productsApi
      .get('/products', { params: { limit: 0 } })
      .then((response) => response.data.products)
      .catch((error) => {
        allProductsRequest = undefined
        throw error
      })
  }

  return allProductsRequest
}

export function fetchProductCategories() {
  if (!categoriesRequest) {
    categoriesRequest = productsApi
      .get('/products/categories')
      .then((response) => response.data)
      .catch((error) => {
        categoriesRequest = undefined
        throw error
      })
  }

  return categoriesRequest
}

export function fetchProductById(id) {
  const productId = String(id)
  if (!productRequests.has(productId)) {
    const request = productsApi
      .get(`/products/${productId}`)
      .then((response) => response.data)

    productRequests.set(productId, request)
    request.catch(() => {
      if (productRequests.get(productId) === request) {
        productRequests.delete(productId)
      }
    })
  }

  return productRequests.get(productId)
}
