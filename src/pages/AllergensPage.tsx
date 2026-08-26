const ALLERGENS = [
  'Celery', 'Cereals containing gluten', 'Crustaceans', 'Eggs', 'Fish', 'Lupin', 'Milk',
  'Molluscs', 'Mustard', 'Tree nuts', 'Peanuts', 'Sesame', 'Soybeans', 'Sulphur dioxide & sulphites',
];

export default function AllergensPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-display text-3xl font-bold text-brand-green mb-1">Allergen Information</h1>
      <p className="text-brand-ink/60 mb-8">Please read this before ordering if you have a food allergy or intolerance.</p>

      <div className="bg-white rounded-xl shadow-sm border border-black/5 p-6 space-y-6 text-sm text-brand-ink/80 leading-relaxed">
        <section className="bg-amber-50 border border-amber-200 rounded-md p-4">
          <p className="text-amber-800">
            <span className="font-semibold">If you have a food allergy or intolerance, please call us on
            (01923) 237483 before ordering.</span> Our kitchen prepares dishes containing all of the 14
            major allergens, and — like most restaurant kitchens — we can't guarantee any dish is
            completely free from a particular allergen, due to shared equipment, surfaces, and cooking
            oil. Speaking to us directly is the only reliable way to check whether a dish is suitable for
            you.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold text-brand-ink mb-2">About the icons on our menu</h2>
          <p>
            The 🌱 Veg, 🌶️ Spicy, and 🥜 Nuts labels on our menu are a general guide to help you browse —
            they are <span className="font-medium">not</span> a complete allergen breakdown, and shouldn't
            be relied on if you have a diagnosed allergy or intolerance.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold text-brand-ink mb-2">The 14 major allergens</h2>
          <p className="mb-2">UK law requires food businesses to be able to tell you if a dish contains any of these:</p>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-1 list-disc pl-5">
            {ALLERGENS.map((allergen) => (
              <li key={allergen}>{allergen}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold text-brand-ink mb-2">Contact us</h2>
          <p>
            Golden Crown Takeaway, 199 St. Albans Road, North Watford, WD24 5BH
            <br />
            (01923) 237483 / (01923) 803478
          </p>
        </section>
      </div>
    </div>
  );
}
