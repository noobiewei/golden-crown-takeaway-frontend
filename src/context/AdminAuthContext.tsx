import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface AdminAuthContextValue {
  username: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8080/api/auth/me', { credentials: 'include' })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => setUsername(data?.username ?? null))
      .finally(() => setLoading(false));
  }, []);

  async function login(usernameInput: string, password: string): Promise<boolean> {
    const response = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      credentials: 'include',
      body: new URLSearchParams({ username: usernameInput, password }),
    });

    if (!response.ok) return false;

    const data = await response.json();
    setUsername(data.username);
    return true;
  }

  async function logout() {
    await fetch('http://localhost:8080/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    setUsername(null);
  }

  return (
    <AdminAuthContext.Provider value={{ username, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
