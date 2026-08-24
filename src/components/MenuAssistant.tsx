import { useState, type FormEvent } from 'react';
import type { MenuItem } from '../types';
import MenuItemCard from './MenuItemCard';

export default function MenuAssistant({ onAdd }: { onAdd: (item: MenuItem) => void }) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reply, setReply] = useState<string | null>(null);
  const [recommendedItems, setRecommendedItems] = useState<MenuItem[]>([]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8080/api/assistant/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message.trim() }),
      });

      if (!response.ok) throw new Error(`Request failed: ${response.status}`);

      const data: { reply: string; recommendedItems: MenuItem[] } = await response.json();
      setReply(data.reply);
      setRecommendedItems(data.recommendedItems);
    } catch {
      setError("Sorry, the assistant isn't available right now — try browsing the menu below instead.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-brand-green/5 border border-brand-green/20 rounded-xl p-5 mb-6">
      <h2 className="font-display text-lg font-bold text-brand-green mb-1">🤖 Not sure what to order?</h2>
      <p className="text-sm text-brand-ink/60 mb-3">Tell us what you're craving and we'll suggest a few dishes.</p>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="e.g. something spicy but not too heavy"
          autoComplete="off"
          className="flex-1 rounded-full border border-black/10 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
        />
        <button
          type="submit"
          disabled={loading || !message.trim()}
          className="shrink-0 bg-brand-green text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-brand-green-dark transition-colors disabled:opacity-50"
        >
          {loading ? 'Thinking…' : 'Suggest dishes'}
        </button>
      </form>

      {error && <p className="text-sm text-red-600 mt-3">{error}</p>}

      {reply && !error && (
        <div className="mt-4">
          <p className="text-sm text-brand-ink/80 mb-3">{reply}</p>
          {recommendedItems.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recommendedItems.map((item) => (
                <MenuItemCard key={item.id} item={item} onAdd={onAdd} />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
