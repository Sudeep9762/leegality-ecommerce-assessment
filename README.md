# Leegality Store

Leegality Store is a responsive React e-commerce assignment for browsing products, narrowing the catalog with filters, and viewing individual product details. Product data comes from the [DummyJSON Products API](https://dummyjson.com/docs/products).

## Features

- Loads the complete product catalog and dynamically loads product categories.
- Displays product cards with an image, title, brand, USD price, and rating.
- Filters by category, brand, minimum price, and maximum price. Filters can be combined.
- Includes an **Unbranded** brand option when products have no brand value.
- Validates price bounds and shows a message for invalid ranges.
- Paginates filtered results in groups of 12, with previous and next controls.
- Opens product details at `/product/:id`, including product information and a selectable image gallery when multiple images are available.
- Shows loading, empty, invalid-ID, and friendly API error states. Listing and detail API errors can be retried.
- Uses responsive CSS layouts for the listing, filters, cards, and product detail page.
- Labels ratings for assistive technology and provides descriptive product image text.

## Technology

- React 19 with functional components and hooks
- JavaScript and JSX
- Vite 8
- React Router DOM 7
- Axios
- CSS

## Project structure

```text
leegality-store/
├── public/                         # Static public assets
├── src/
│   ├── api/
│   │   └── products.js             # Axios service and request caching
│   ├── assets/                     # Existing starter assets
│   ├── components/
│   │   ├── Pagination.jsx
│   │   ├── ProductCard.jsx
│   │   ├── ProductFilters.jsx
│   │   └── StoreLayout.jsx
│   ├── pages/
│   │   ├── ProductDetailPage.jsx
│   │   └── ProductListingPage.jsx
│   ├── App.jsx                     # Application routes
│   ├── App.css                     # Unused Vite starter stylesheet
│   ├── index.css                   # Shared and responsive styles
│   └── main.jsx                    # React and BrowserRouter entry point
├── AGENTS.md                      # Project requirements and guidelines
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js
```

`App.css` and the starter images in `src/assets/` remain in the repository, but the current application does not import or use them.

## API integration

The Axios instance is defined in `src/api/products.js` with `https://dummyjson.com` as its base URL. The service uses these endpoints:

| Purpose | Endpoint |
| --- | --- |
| Fetch all products | `GET /products?limit=0` |
| Fetch categories | `GET /products/categories` |
| Fetch one product | `GET /products/:id` |

For example, the listing service requests the full catalog and returns the `products` array:

```js
productsApi.get('/products', { params: { limit: 0 } })
```

The category endpoint supplies the category options. The detail page requests only the selected product by ID; it does not fetch the full catalog again.

Successful product-list and category requests are reused from a module-level cache. Detail requests are cached by product ID. Failed requests are removed from the cache so that Retry can make a new request.

## Filtering and pagination

The listing derives unique brand options from the loaded catalog. Blank or missing brand values are represented by **Unbranded**. Category, brand, and price filters are applied together to the full product array; pagination is applied to the filtered results afterward.

The page size is 12 products. The listing shows the current page, total pages, and result count. Changing a filter resets the page to 1. Invalid price values and a minimum price greater than the maximum price produce a validation message.

## Routes and URL state

| Route | Page |
| --- | --- |
| `/` | Product listing |
| `/product/:id` | Product detail |

Listing filters and pagination are stored in the query string using `category`, `brand`, `minPrice`, `maxPrice`, and `page`. Empty filter values are omitted. For example:

```text
/?category=beauty&brand=Essence&minPrice=5&maxPrice=50&page=2
```

The Unbranded brand filter uses `brand=__unbranded__` in the URL. Product cards pass the current listing location to the detail route. The detail page's **Back to products** link returns to that location, and browser Back restores the listing URL and its filter/page values.

## Installation

Use Node.js and npm, then install the locked dependencies from the project root:

```bash
npm.cmd ci
```

## Run locally

Start the Vite development server:

```bash
npm.cmd run dev
```

Open the local URL printed by Vite. To preview a production build locally, build first and then run:

```bash
npm.cmd run build
npm.cmd run preview
```

## Build and lint

Create the production bundle:

```bash
npm.cmd run build
```

Run ESLint:

```bash
npm.cmd run lint
```

There is no separate test script configured in `package.json`.
