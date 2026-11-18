# Project Requirements and Coding Guidelines

## Project goal

Build an Amazon-style e-commerce product listing and product detail application using React functional components, JavaScript, React Router DOM, Axios, and CSS.

Use the DummyJSON Products API documented at <https://dummyjson.com/docs/products> as the product data source.

## Required application features

- A product listing page that loads and displays products.
- A product detail page reachable at `/product/:id`.
- A category filter whose options are loaded dynamically from the API.
- Minimum and maximum price filters.
- A brand filter.
- Combined filters that work together.
- Pagination for the listing.
- Clear loading and error states for API requests.
- Preserve listing filters and pagination when navigating to a product and then returning to the listing.

## Coding guidelines

- Use JavaScript and JSX (`.js`/`.jsx`), not TypeScript.
- Use React function components and hooks.
- Use React Router DOM for page routing and Axios for HTTP requests.
- Keep styling in CSS; do not introduce a CSS framework unless the project owner asks.
- Organize reusable UI into focused components and keep API/data-access logic separate from page presentation where practical.
- Use descriptive names and small components with clear responsibilities.
- Handle loading, empty results, invalid or unavailable product IDs, and request failures in the UI.
- Keep filter and pagination state consistent with navigation so returning from a detail page restores the previous listing view.
- Follow the existing Vite project conventions and lint rules. Avoid unrelated changes to working files or dependencies.
- Do not begin implementation until the project owner explicitly approves the proposed plan.
