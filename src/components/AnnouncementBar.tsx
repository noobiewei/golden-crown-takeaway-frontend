import { useState, useEffect } from 'react';

const MESSAGES = [
  '🎁 Free bottle of soft drink & a bag of prawn crackers on orders over £55',
  '🥡 Freshly made to order — Peking, Szechuan & Cantonese',
];

const ROTATE_INTERVAL_MS = 4000;

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((current) => (current + 1) % MESSAGES.length);
    }, ROTATE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-brand-gold text-brand-ink text-center text-sm font-medium py-2 px-4">
      {MESSAGES[index]}
    </div>
  );
}
