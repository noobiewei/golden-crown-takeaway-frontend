import { useState, type FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function AdminLoginPage() {
  const { username, loading, login } = useAdminAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (loading) return null;
  if (username) return <Navigate to="/admin/orders" replace />;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const success = await login(form.username, form.password);
    if (success) {
      navigate('/admin/orders');
    } else {
      setError('Incorrect username or password.');
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto py-16">
      <h1 className="font-display text-2xl font-bold text-brand-green mb-6 text-center">Admin Login</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-black/5 p-5 space-y-4">
        <label className="block">
          <span className="block text-sm font-medium text-brand-ink/70 mb-1">Username</span>
          <input
            type="text"
            required
            autoComplete="username"
            value={form.username}
            onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))}
            className="w-full rounded-md border border-black/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
          />
        </label>

        <label className="block">
          <span className="block text-sm font-medium text-brand-ink/70 mb-1">Password</span>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={form.password}
            onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
            className="w-full rounded-md border border-black/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
          />
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-brand-green text-white font-medium py-2.5 rounded-full hover:bg-brand-green-dark transition-colors disabled:opacity-50"
        >
          {submitting ? 'Logging in...' : 'Log In'}
        </button>
      </form>
    </div>
  );
}
