import { useState, useEffect } from 'react';
import { getOpenStatus } from '../lib/openingHours';

export default function OpenStatus() {
  const [status, setStatus] = useState(() => getOpenStatus());

  useEffect(() => {
    const interval = setInterval(() => setStatus(getOpenStatus()), 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-sm rounded-full px-3 py-1.5 ${
        status.isOpen ? 'bg-green-500/20 text-green-100' : 'bg-white/10 text-brand-cream/90'
      }`}
    >
      <span className={`w-2 h-2 rounded-full ${status.isOpen ? 'bg-green-400' : 'bg-brand-cream/50'}`} />
      {status.label}
    </span>
  );
}
