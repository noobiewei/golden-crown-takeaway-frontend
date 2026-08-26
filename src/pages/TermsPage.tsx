export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-display text-3xl font-bold text-brand-green mb-1">Terms &amp; Conditions</h1>
      <p className="text-brand-ink/60 mb-8">Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>

      <div className="bg-white rounded-xl shadow-sm border border-black/5 p-6 space-y-6 text-sm text-brand-ink/80 leading-relaxed">
        <section>
          <p>
            These terms apply whenever you order food from Golden Crown Takeaway, 199 St. Albans Road, North
            Watford, WD24 5BH, through this website. By placing an order, you agree to them.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold text-brand-ink mb-2">Orders</h2>
          <p>
            Placing an order is an offer to buy, which we're free to accept or decline — for example, if
            we're closed, an item has sold out, your address falls outside our delivery area, or we
            suspect an order isn't genuine. We'll try to contact you using the phone number you provide if
            there's a problem.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold text-brand-ink mb-2">Prices &amp; the menu</h2>
          <p>
            Prices are shown in pounds sterling and include any applicable VAT. We try to keep the menu
            accurate, but prices, availability, and dish descriptions can change without notice.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold text-brand-ink mb-2">Payment</h2>
          <p>
            You can pay by card (processed securely by Stripe at checkout) or by cash on collection or
            delivery. For card payments, your order is confirmed once payment succeeds.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold text-brand-ink mb-2">Delivery</h2>
          <p>
            Delivery is available to a limited area, subject to a minimum order value and delivery charge
            shown at checkout. Estimated timings aren't guaranteed — they can vary with weather, traffic,
            and how busy we are. Please make sure your delivery address and phone number are correct;
            we're not responsible for delays caused by incorrect details.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold text-brand-ink mb-2">Cancellations &amp; problems with your order</h2>
          <p>
            Because food is made fresh to order, we may not be able to cancel an order once we've started
            preparing it. If something's wrong with your order — missing items, an error on our part, or a
            quality issue — please contact us as soon as possible so we can put it right.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold text-brand-ink mb-2">Allergies &amp; dietary requirements</h2>
          <p>
            If you have a food allergy or intolerance, please contact us directly before ordering — see our{' '}
            <a href="/allergens" className="text-brand-green underline">
              allergen information
            </a>{' '}
            page for details.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold text-brand-ink mb-2">Liability</h2>
          <p>
            Nothing in these terms limits our liability where it would be unlawful to do so. Otherwise, our
            liability to you is limited to the value of your order.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold text-brand-ink mb-2">Governing law</h2>
          <p>These terms are governed by the law of England and Wales.</p>
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
