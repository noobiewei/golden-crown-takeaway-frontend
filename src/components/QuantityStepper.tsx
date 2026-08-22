export default function QuantityStepper({
  quantity,
  onChange,
}: {
  quantity: number;
  onChange: (quantity: number) => void;
}) {
  return (
    <div className="inline-flex items-center border border-black/10 rounded-full overflow-hidden bg-white">
      <button
        type="button"
        onClick={() => onChange(quantity - 1)}
        aria-label="Decrease quantity"
        className="w-8 h-8 flex items-center justify-center text-brand-ink/70 hover:bg-black/5 transition-colors"
      >
        −
      </button>
      <span className="w-8 text-center text-sm font-medium tabular-nums">{quantity}</span>
      <button
        type="button"
        onClick={() => onChange(quantity + 1)}
        aria-label="Increase quantity"
        className="w-8 h-8 flex items-center justify-center text-brand-ink/70 hover:bg-black/5 transition-colors"
      >
        +
      </button>
    </div>
  );
}
