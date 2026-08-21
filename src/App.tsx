import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { CartProvider, useCart } from './context/CartContext';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import './App.css';

function Header() {
  const { totalItems } = useCart();
  return (
    <nav>
      <Link to="/">Menu</Link> | <Link to="/cart">Cart ({totalItems})</Link>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Header />
        <Routes>
          <Route path="/" element={<MenuPage />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
