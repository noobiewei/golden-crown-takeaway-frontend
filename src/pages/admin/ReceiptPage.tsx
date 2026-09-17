import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import type { FreeDrinkChoice, Order, OrderType, PaymentMethod } from '../../types';

const FREE_DRINK_LABELS_ZH: Record<FreeDrinkChoice, string> = {
  COKE: '可乐',
  DIET_COKE: '健怡可乐',
  TANGO_ORANGE: '橙味汽水',
};

const ORDER_TYPE_ZH: Record<OrderType, string> = {
  PICKUP: '自取',
  DELIVERY: '外送',
};

const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  CARD: 'Card',
  CASH: 'Cash',
};

export default function ReceiptPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const autoprint = searchParams.get('autoprint') === '1';
  const hasAutoprinted = useRef(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/admin/orders/${id}/receipt`, { credentials: 'include' })
      .then((response) => {
        if (!response.ok) throw new Error(`Request failed: ${response.status}`);
        return response.json();
      })
      .then((data: Order) => {
        setOrder(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  // Lets the print agent (or any automated caller) load this page with
  // ?autoprint=1 and have it print itself with no button click needed. Only
  // fires once the order has actually finished loading and translating.
  useEffect(() => {
    if (autoprint && order && !hasAutoprinted.current) {
      hasAutoprinted.current = true;
      window.print();
    }
  }, [autoprint, order]);

  if (loading) return <p className="text-center text-brand-ink/60 py-20">Loading receipt...</p>;
  if (error || !order) {
    return <p className="text-center text-red-600 py-20">Couldn't load this order: {error}</p>;
  }

  const subtotal = order.totalPrice - order.deliveryFee;
  const createdAt = new Date(order.createdAt).toLocaleString('en-GB');

  return (
    <div className="max-w-xs mx-auto">
      <button
        type="button"
        onClick={() => window.print()}
        className="no-print w-full mb-6 bg-brand-green text-white font-medium py-2.5 rounded-full hover:bg-brand-green-dark transition-colors"
      >
        Print Receipt
      </button>

      <div className="receipt bg-white text-black">
        {/* Customer copy — English + Chinese */}
        <div className="receipt-copy">
          <p className="text-center font-bold text-xl">GOLDEN CROWN 金冠外卖</p>
          <p className="text-center">Chinese Takeaway</p>
          <p className="text-center">199 St. Albans Road, North Watford, WD24 5BH</p>
          <p className="text-center">Tel: (01923) 237483 / (01923) 803478</p>
          <hr />
          <p>Order #{order.id} &middot; {createdAt}</p>
          <p>CUSTOMER COPY 客户收据</p>
          <hr />
          <p>Name: {order.customerName}</p>
          <p>Phone: {order.customerPhone}</p>
          {order.orderType === 'DELIVERY' ? (
            <>
              <p>Delivery to: {order.deliveryAddress}</p>
              <p>Postcode: {order.deliveryPostcode}</p>
            </>
          ) : (
            <p>Pickup 自取</p>
          )}
          <hr />
          {order.items.map((line) => (
            <div key={line.id} className="mb-1">
              <div className="flex justify-between gap-2">
                <span>{line.quantity}x {line.menuItem.name}</span>
                <span>£{(line.priceAtOrder * line.quantity).toFixed(2)}</span>
              </div>
              <div>{line.menuItem.nameZh}</div>
              {line.extras.map((extra) => (
                <div key={extra.id} className="pl-3">
                  <div className="flex justify-between gap-2">
                    <span>+ {extra.name}</span>
                    <span>£{extra.priceAtOrder.toFixed(2)}</span>
                  </div>
                  <div>{extra.nameZh}</div>
                </div>
              ))}
              {line.note && (
                <p className="pl-3 font-bold">
                  Note: {line.note}
                  {line.noteZh ? ` / ${line.noteZh}` : ''}
                </p>
              )}
            </div>
          ))}
          <hr />
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>£{subtotal.toFixed(2)}</span>
          </div>
          {order.deliveryFee > 0 && (
            <div className="flex justify-between">
              <span>Delivery fee</span>
              <span>£{order.deliveryFee.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>£{order.totalPrice.toFixed(2)}</span>
          </div>
          <hr />
          <p>
            Payment: {PAYMENT_METHOD_LABEL[order.paymentMethod]}
            {order.paymentMethod === 'CASH'
              ? ` on ${order.orderType === 'DELIVERY' ? 'delivery' : 'collection'}`
              : order.paymentStatus === 'PAID'
                ? ' (Paid)'
                : ' (Unpaid)'}
          </p>
          {order.freeDrinkChoice && (
            <p>Free drink 赠饮: {FREE_DRINK_LABELS_ZH[order.freeDrinkChoice]}</p>
          )}
          {order.specialInstructions && (
            <p className="font-bold">
              Special instructions: {order.specialInstructions}
              {order.specialInstructionsZh ? ` / ${order.specialInstructionsZh}` : ''}
            </p>
          )}
          <hr />
          <p className="text-center">Thank you! 多谢惠顾</p>
          <p className="text-center font-bold text-2xl mt-2">
            {order.paymentStatus === 'PAID' ? 'PAID' : 'UNPAID'}
          </p>
        </div>

        <div className="page-break" />

        {/* Kitchen copy — Chinese only */}
        <div className="receipt-copy kitchen-copy">
          <p className="text-center font-bold text-xl">金冠外卖 厨房单</p>
          <hr />
          <p>单号 #{order.id} &middot; {createdAt}</p>
          <hr />
          <p>客户: {order.customerName}</p>
          <p>电话: {order.customerPhone}</p>
          {order.orderType === 'DELIVERY' ? (
            <>
              <p>外送地址: {order.deliveryAddress}</p>
              <p>邮编: {order.deliveryPostcode}</p>
            </>
          ) : (
            <p>{ORDER_TYPE_ZH.PICKUP}</p>
          )}
          <hr />
          {order.items.map((line) => (
            <div key={line.id} className="mb-1">
              <p className="text-lg">{line.quantity}x {line.menuItem.nameZh}</p>
              {line.extras.map((extra) => (
                <p key={extra.id} className="pl-3">+ {extra.nameZh}</p>
              ))}
              {(line.noteZh || line.note) && <p className="pl-3 font-bold">备注: {line.noteZh ?? line.note}</p>}
            </div>
          ))}
          {order.freeDrinkChoice && (
            <>
              <hr />
              <p>赠饮: {FREE_DRINK_LABELS_ZH[order.freeDrinkChoice]}</p>
            </>
          )}
          {(order.specialInstructionsZh || order.specialInstructions) && (
            <>
              <hr />
              <p className="font-bold">备注: {order.specialInstructionsZh ?? order.specialInstructions}</p>
            </>
          )}
        </div>
      </div>

      <style>{`
        .receipt {
          font-family: 'Courier New', monospace;
          font-size: 15px;
          line-height: 1.6;
        }
        .receipt hr {
          border: none;
          border-top: 1px dashed #000;
          margin: 6px 0;
        }
        .receipt-copy p {
          margin: 2px 0;
        }
        @media print {
          @page {
            size: 80mm auto;
            margin: 0;
          }
          body * {
            visibility: hidden;
          }
          .receipt, .receipt * {
            visibility: visible;
          }
          .receipt {
            position: absolute;
            top: 0;
            left: 0;
            width: 80mm;
            /* Extra side padding keeps content off the physical edges — the
               paper is 79.5mm ± 0.5mm, not a clean 80mm, and the print head's
               usable area is narrower still than the paper width. */
            padding: 4mm;
            font-size: 20px;
            font-weight: 700;
            color: #000;
          }
          .no-print {
            display: none;
          }
          .page-break {
            page-break-after: always;
          }
          /* Kitchen copy needs to be readable at a glance from across a hot,
             busy kitchen — much bigger and bolder than the customer copy.
             Targeting descendants directly (not just .kitchen-copy itself)
             is what actually overrides the Tailwind text-lg/text-xl classes
             already on those elements, since inheriting a font-size from an
             ancestor never wins over an explicit rule on the element itself. */
          .kitchen-copy p,
          .kitchen-copy div {
            font-size: 40px;
            font-weight: 700;
            line-height: 1.3;
          }
          .kitchen-copy > p:first-child {
            font-size: 48px;
          }
        }
      `}</style>
    </div>
  );
}
