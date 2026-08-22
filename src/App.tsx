import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { CartProvider, useCart } from './context/CartContext';
import CrownIcon from './components/CrownIcon';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ConfirmationPage from './pages/ConfirmationPage';
import ContactPage from './pages/ContactPage';
import './App.css';

function Header() {
  const { totalItems } = useCart();

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded-full text-sm font-medium transition-colors ${
      isActive
        ? 'bg-brand-gold text-brand-ink'
        : 'text-brand-cream hover:bg-white/10'
    }`;

  return (
    <header className="sticky top-0 z-10 bg-brand-red shadow-md">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-4">
        <NavLink to="/" className="flex items-center gap-2 font-display text-2xl font-bold text-brand-cream tracking-wide">
          <CrownIcon className="w-7 h-7 text-brand-gold" />
          Golden Crown <span className="text-brand-gold">Takeaway</span>
          <span className="text-brand-gold/80 text-xl font-normal ml-1">金冠</span>
        </NavLink>
        <nav className="flex items-center gap-2">
          <NavLink to="/" end className={navLinkClasses}>
            Menu
          </NavLink>
          <NavLink to="/cart" className={navLinkClasses}>
            Cart{totalItems > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center h-5 min-w-5 rounded-full bg-brand-ink text-white text-xs px-1">
                {totalItems}
              </span>
            )}
          </NavLink>
          <NavLink to="/contact" className={navLinkClasses}>
            Contact
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-10">
            <Routes>
              <Route path="/" element={<MenuPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/confirmation" element={<ConfirmationPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Routes>
          </main>
        </div>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
