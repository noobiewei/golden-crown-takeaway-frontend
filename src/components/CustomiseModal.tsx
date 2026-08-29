import { useState } from 'react';
import type { DishExtra, MenuItem } from '../types';
import QuantityStepper from './QuantityStepper';

export default function CustomiseModal({
  item,
  extras,
  onClose,
  onConfirm,
}: {
  item: MenuItem;
  extras: DishExtra[];
  onClose: () => void;
  onConfirm: (quantity: number, note: string, selectedExtras: DishExtra[]) => void;
}) {
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');
  const [selectedExtras, setSelectedExtras] = useState<DishExtra[]>([]);

  const extrasPrice = selectedExtras.reduce((sum, extra) => sum + extra.price, 0);
  const total = (item.price + extrasPrice) * quantity;

  function toggleExtra(extra: DishExtra) {
    setSelectedExtras((current) =>
      current.some((e) => e.name === extra.name)
        ? current.filter((e) => e.name !== extra.name)
        : [...current, extra]
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 mb-1">
          <h2 className="font-display text-xl font-bold text-brand-green">{item.name}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-brand-ink/40 hover:text-brand-ink text-lg leading-none"
          >
            ✕
          </button>
        </div>
        <p className="text-sm text-brand-ink/60 mb-4">£{item.price.toFixed(2)} each</p>

        {extras.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-brand-ink/70 mb-2">Add extras</p>
            <div className="space-y-2">
              {extras.map((extra) => {
                const isSelected = selectedExtras.some((e) => e.name === extra.name);
                return (
                  <label
                    key={extra.name}
                    className={`flex items-center justify-between gap-3 rounded-lg border px-3 py-2 cursor-pointer transition-colors ${
                      isSelected ? 'border-brand-green bg-brand-green/5' : 'border-black/10 hover:bg-black/5'
                    }`}
                  >
                    <span className="flex items-center gap-2 text-sm text-brand-ink">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleExtra(extra)}
                        className="accent-brand-green"
                      />
                      {extra.name}
                    </span>
                    <span className="text-sm text-brand-ink/60">+£{extra.price.toFixed(2)}</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        <label className="block mb-4">
          <span className="block text-sm font-medium text-brand-ink/70 mb-1">Note (optional)</span>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. no spring onion, no spicy…"
            className="w-full text-sm rounded-md border border-black/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold placeholder:text-brand-ink/40"
          />
        </label>

        <div className="flex items-center justify-between gap-3">
          <QuantityStepper quantity={quantity} onChange={(q) => setQuantity(Math.max(1, q))} />
          <button
            type="button"
            onClick={() => onConfirm(quantity, note, selectedExtras)}
            className="flex-1 bg-brand-green text-white font-medium py-2.5 rounded-full hover:bg-brand-green-dark transition-colors"
          >
            Add to Cart · £{total.toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
}
