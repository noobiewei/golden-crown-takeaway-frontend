export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-display text-3xl font-bold text-brand-green mb-1">Contact & About</h1>
      <p className="text-brand-ink/60 mb-8">金冠 — Peking, Szechuan, Cantonese &amp; English meals to take away</p>

      <div className="bg-white rounded-xl shadow-sm border border-black/5 p-6 space-y-6">
        <div>
          <h2 className="font-display text-lg font-bold text-brand-ink mb-1">Address</h2>
          <p className="text-brand-ink/70">199 St. Albans Road, North Watford, WD24 5BH</p>
        </div>

        <div>
          <h2 className="font-display text-lg font-bold text-brand-ink mb-1">Phone</h2>
          <p className="text-brand-ink/70">(01923) 237483</p>
          <p className="text-brand-ink/70">(01923) 803478</p>
        </div>

        <div>
          <h2 className="font-display text-lg font-bold text-brand-ink mb-1">Opening Hours</h2>
          <p className="text-brand-ink/50 italic">Monday: Closed</p>
          <p className="text-brand-ink/50 italic">Tuesday - Saturday: 5pm - 11pm</p>
          <p className="text-brand-ink/50 italic">Sunday/ Bank Holodays: 5pm - 10:30pm</p>
        </div>

        <div>
          <h2 className="font-display text-lg font-bold text-brand-ink mb-1">Delivery</h2>
          <ul className="text-brand-ink/70 space-y-0.5 text-sm">
            <li>£1.30 delivery charge for orders over £15, within 3 miles</li>
            <li>£2.00 delivery charge for orders under £15, within 3 miles</li>
            <li>£3.00 delivery charge for orders over 3 miles</li>
            <li>Free prawn crackers or a bottle of soft drink for orders over £55</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
