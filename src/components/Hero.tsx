import OpenStatus from "./OpenStatus";

export default function Hero({ menuAnchorId }: { menuAnchorId?: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-green to-brand-green-dark text-brand-cream px-6 sm:px-10 py-10 sm:py-14 mb-10">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
        <div>
          <p className="text-brand-gold text-sm font-medium tracking-widest uppercase mb-3">
            金冠 &middot; North Watford
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold max-w-lg leading-tight">
            Peking, Szechuan &amp; Cantonese — Cooked Fresh, Ready to Collect or
            Delivered Fast
          </h1>
          <p className="text-brand-cream/80 mt-4 max-w-md">
            Family-run and serving Watford and surrounding areas, with everything
            made to order.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-6">
            <a
              href={menuAnchorId ? `#${menuAnchorId}` : "#"}
              className="bg-brand-gold text-brand-ink font-medium px-6 py-2.5 rounded-full hover:brightness-95 transition"
            >
              View Menu
            </a>
            <OpenStatus />
          </div>
        </div>

        <div className="lg:w-64 shrink-0 bg-white/10 rounded-xl p-5 space-y-4 text-sm">
          <div>
            <p className="text-brand-gold font-semibold text-xs uppercase tracking-wide mb-1">Address</p>
            <p className="text-brand-cream/90">199 St. Albans Road, North Watford, WD24 5BH</p>
          </div>
          <div>
            <p className="text-brand-gold font-semibold text-xs uppercase tracking-wide mb-1">Phone</p>
            <p className="text-brand-cream/90">(01923) 237483</p>
            <p className="text-brand-cream/90">(01923) 803478</p>
          </div>
          <div>
            <p className="text-brand-gold font-semibold text-xs uppercase tracking-wide mb-1">Delivery</p>
            <p className="text-brand-cream/90">£15 minimum order</p>
            <p className="text-brand-cream/90">£1.30–£3.00 delivery fee</p>
          </div>
        </div>
      </div>
    </div>
  );
}
