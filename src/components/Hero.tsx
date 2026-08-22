import OpenStatus from './OpenStatus';

export default function Hero({ menuAnchorId }: { menuAnchorId?: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-green to-brand-green-dark text-brand-cream px-6 sm:px-10 py-10 sm:py-14 mb-10">
      <p className="text-brand-gold text-sm font-medium tracking-widest uppercase mb-3">
        金冠 &middot; North Watford
      </p>
      <h1 className="font-display text-3xl sm:text-4xl font-bold max-w-lg leading-tight">
        Peking, Szechuan &amp; Cantonese — Cooked Fresh, Ready to Collect or Delivered Fast
      </h1>
      <p className="text-brand-cream/80 mt-4 max-w-md">
        Family-run and serving North Watford, with everything made to order.
      </p>

      <div className="flex flex-wrap items-center gap-4 mt-6">
        <a
          href={menuAnchorId ? `#${menuAnchorId}` : '#'}
          className="bg-brand-gold text-brand-ink font-medium px-6 py-2.5 rounded-full hover:brightness-95 transition"
        >
          View Menu
        </a>
        <OpenStatus />
      </div>
    </div>
  );
}
