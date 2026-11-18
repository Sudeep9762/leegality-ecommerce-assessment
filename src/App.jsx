import { Route, Routes } from 'react-router-dom'
import StoreLayout from './components/StoreLayout.jsx'
import ProductDetailPage from './pages/ProductDetailPage.jsx'
import ProductListingPage from './pages/ProductListingPage.jsx'

function App() {
  return (
    <Routes>
      <Route element={<StoreLayout />}>
        <Route index element={<ProductListingPage />} />
        <Route path="product/:id" element={<ProductDetailPage />} />
      </Route>
    </Routes>
  )
}

export default App
