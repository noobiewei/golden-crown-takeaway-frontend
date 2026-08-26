export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-display text-3xl font-bold text-brand-green mb-1">Privacy Policy</h1>
      <p className="text-brand-ink/60 mb-8">Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>

      <div className="bg-white rounded-xl shadow-sm border border-black/5 p-6 space-y-6 text-sm text-brand-ink/80 leading-relaxed">
        <section>
          <h2 className="font-display text-lg font-bold text-brand-ink mb-2">Who we are</h2>
          <p>
            Golden Crown Takeaway, 199 St. Albans Road, North Watford, WD24 5BH ("we", "us") operates this
            website to take food orders for pickup and delivery. This policy explains what personal
            information we collect when you use it, and how we use it.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold text-brand-ink mb-2">What we collect</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Your name and phone number, so we can contact you about your order</li>
            <li>Your delivery address, if you order for delivery</li>
            <li>Details of what you order, and any notes or special instructions you add</li>
            <li>
              If you use the "Not sure what to order?" assistant, the message you type is sent to our AI
              provider (Anthropic) to generate a suggestion — see "Third parties" below
            </li>
          </ul>
          <p className="mt-2">
            We do not see or store your card details. Card payments are handled entirely by Stripe — see
            below.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold text-brand-ink mb-2">Why we collect it</h2>
          <p>We use your information only to:</p>
          <ul className="list-disc pl-5 space-y-1 mt-1">
            <li>Prepare, confirm, and deliver your order</li>
            <li>Contact you if there's a problem with your order</li>
            <li>Process payment</li>
            <li>Keep records for accounting and legal purposes</li>
          </ul>
          <p className="mt-2">We do not sell your information, and we do not use it for marketing.</p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold text-brand-ink mb-2">Third parties we use</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <span className="font-medium">Stripe</span> — processes card payments. Your card details go
              directly to Stripe; we never receive or store them.
            </li>
            <li>
              <span className="font-medium">Anthropic</span> — powers the "Not sure what to order?"
              assistant. Only the message you type into that box is sent, to generate a dish suggestion; it
              is not linked to your name, order, or any other information about you.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold text-brand-ink mb-2">Cart data in your browser</h2>
          <p>
            While you're browsing, your cart contents are stored locally in your browser (using{' '}
            <code className="text-xs bg-brand-cream px-1 py-0.5 rounded">localStorage</code>), not on our
            servers. This is only used to remember what's in your cart between page loads, and is not
            shared with us until you place an order.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold text-brand-ink mb-2">How long we keep it</h2>
          <p>
            We keep order records for as long as reasonably needed for accounting, tax, and dispute-handling
            purposes.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold text-brand-ink mb-2">Your rights</h2>
          <p>
            Under UK data protection law, you can ask us what personal information we hold about you, ask us
            to correct it, or ask us to delete it. To do so, contact us using the details below. You can also
            complain to the Information Commissioner's Office (ico.org.uk) if you think we've handled your
            information incorrectly.
          </p>
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
