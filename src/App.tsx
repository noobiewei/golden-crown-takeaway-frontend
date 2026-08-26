import { BrowserRouter, Routes, Route, NavLink, Link, Outlet } from 'react-router-dom';
import { CartProvider, useCart } from './context/CartContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import RequireAdmin from './components/RequireAdmin';
import CrownIcon from './components/CrownIcon';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ConfirmationPage from './pages/ConfirmationPage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import AllergensPage from './pages/AllergensPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import './App.css';

function Header() {
  const { totalItems } = useCart();

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
      isActive
        ? 'bg-brand-gold text-brand-ink'
        : 'text-brand-cream hover:bg-white/10'
    }`;

  return (
    <header className="sticky top-0 z-10 bg-brand-green shadow-md">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-2 px-4 sm:px-6 py-3 sm:py-4">
        <NavLink
          to="/"
          className="flex items-center gap-1.5 sm:gap-2 font-display text-base sm:text-2xl font-bold text-brand-cream tracking-wide shrink-0 min-w-0"
        >
          <CrownIcon className="w-5 h-5 sm:w-7 sm:h-7 text-brand-gold shrink-0" />
          <span className="truncate">Golden Crown</span>
          <span className="text-brand-gold hidden sm:inline">Takeaway</span>
          <span className="text-brand-gold/80 text-xl font-normal ml-1 hidden sm:inline">金冠</span>
        </NavLink>
        <nav className="flex items-center gap-1.5 sm:gap-2 shrink-0">
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
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-brand-ink text-brand-cream/70 mt-auto">
      <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="font-display text-brand-cream text-lg">
          Golden Crown <span className="text-brand-gold">Takeaway</span> 金冠
        </p>
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-sm">
          <Link to="/" className="hover:text-brand-cream transition-colors">Menu</Link>
          <Link to="/contact" className="hover:text-brand-cream transition-colors">Contact &amp; About</Link>
          <Link to="/allergens" className="hover:text-brand-cream transition-colors">Allergens</Link>
          <Link to="/terms" className="hover:text-brand-cream transition-colors">Terms &amp; Conditions</Link>
          <Link to="/privacy" className="hover:text-brand-cream transition-colors">Privacy Policy</Link>
        </nav>
        <p className="text-xs">&copy; {new Date().getFullYear()} Golden Crown Takeaway</p>
      </div>
    </footer>
  );
}

function SiteLayout() {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-10">
          <Outlet />
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}

function AdminLayout() {
  return (
    <AdminAuthProvider>
      <div className="min-h-screen bg-brand-cream px-6 py-10">
        <Outlet />
      </div>
    </AdminAuthProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<MenuPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/confirmation" element={<ConfirmationPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/allergens" element={<AllergensPage />} />
        </Route>

        <Route element={<AdminLayout />}>
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin/orders"
            element={
              <RequireAdmin>
                <AdminOrdersPage />
              </RequireAdmin>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
