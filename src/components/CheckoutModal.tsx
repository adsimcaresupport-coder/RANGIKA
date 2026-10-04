import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CreditCard,
  QrCode,
  Building,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Order } from '../types';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    appliedDiscount,
    cartTotal,
    createOrder,
    setIsAccountOpen,
  } = useStore();

  const [step, setStep] = useState<'details' | 'payment' | 'confirmed'>('details');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Customer information
  const [customerName, setCustomerName] = useState('Ananya Singhal');
  const [email, setEmail] = useState('ananya.singhal@example.com');
  const [phone, setPhone] = useState('+91 98201 55678');
  const [street, setStreet] = useState('Flat 502, Orchid Heritage, 12th Main Road');
  const [city, setCity] = useState('Bengaluru');
  const [state, setState] = useState('Karnataka');
  const [postalCode, setPostalCode] = useState('560038');
  const [country, setCountry] = useState('India');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'NetBanking' | 'Cash on Delivery'>('UPI');
  const [upiId, setUpiId] = useState('ananya@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('321');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isCheckoutOpen) return null;

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const order = createOrder({
        customerName,
        email,
        phone,
        shippingAddress: {
          street,
          city,
          state,
          postalCode,
          country,
        },
        items: cart,
        subtotal: cartSubtotal,
        discount: appliedDiscount?.amount || 0,
        shipping: 0,
        total: cartTotal,
        paymentMethod,
        paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Pending Verification' : 'Paid',
      });

      setConfirmedOrder(order);
      setIsProcessing(false);
      setStep('confirmed');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#FAF7F2] rounded-3xl overflow-hidden shadow-2xl border border-[#E5DAC8] my-8 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#EAE3D5] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <span className="font-serif text-xl sm:text-2xl font-semibold tracking-wider text-[#1E2D22]">
              RANGIKA
            </span>
            <span className="text-[#8E7B6C]">|</span>
            <span className="text-xs uppercase tracking-widest font-semibold text-[#6B5B4E]">
              Secure Checkout
            </span>
          </div>

          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          {step === 'details' && (
            <form onSubmit={handleDetailsSubmit} className="space-y-6">
              <div>
                <h3 className="font-serif text-xl font-medium text-[#1E2D22] mb-1">
                  Shipping & Contact Details
                </h3>
                <p className="text-xs text-[#6B5B4E]">
                  Where should our master artisans safely dispatch your handcrafted artwork?
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5B4E] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full text-sm px-3.5 py-2.5 bg-white border border-[#E2D7C5] rounded-xl outline-none focus:border-[#C85A32]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5B4E] mb-1">
                    Phone (for courier delivery alerts) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-sm px-3.5 py-2.5 bg-white border border-[#E2D7C5] rounded-xl outline-none focus:border-[#C85A32]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5B4E] mb-1">
                  Email Address (for order receipt & tracking) *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 bg-white border border-[#E2D7C5] rounded-xl outline-none focus:border-[#C85A32]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5B4E] mb-1">
                  Street Address & Apartment *
                </label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 bg-white border border-[#E2D7C5] rounded-xl outline-none focus:border-[#C85A32]"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5B4E] mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full text-sm px-3 py-2 bg-white border border-[#E2D7C5] rounded-xl outline-none focus:border-[#C85A32]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5B4E] mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full text-sm px-3 py-2 bg-white border border-[#E2D7C5] rounded-xl outline-none focus:border-[#C85A32]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5B4E] mb-1">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full text-sm px-3 py-2 bg-white border border-[#E2D7C5] rounded-xl outline-none focus:border-[#C85A32]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5B4E] mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    disabled
                    value={country}
                    className="w-full text-sm px-3 py-2 bg-gray-100 border border-[#E2D7C5] rounded-xl text-gray-600 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Order Items Summary snippet */}
              <div className="bg-white p-4 rounded-2xl border border-[#E5DAC8] text-xs space-y-2">
                <span className="font-semibold uppercase tracking-wider text-[#6B5B4E] block">
                  Order Summary ({cart.length} Artworks)
                </span>
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-[#2E251E]">
                    <span className="line-clamp-1">{item.title} × {item.quantity}</span>
                    <span className="font-mono font-medium">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-[#EAE3D5] flex justify-between font-bold text-sm text-[#1E2D22]">
                  <span>Total Payable:</span>
                  <span className="font-serif text-base">₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="bg-[#1E2D22] hover:bg-[#C85A32] text-white px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {step === 'payment' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-xl font-medium text-[#1E2D22] mb-1">
                  Select Payment Method
                </h3>
                <p className="text-xs text-[#6B5B4E]">
                  All transactions are 256-bit encrypted with instant receipt issuance.
                </p>
              </div>

              {/* Payment Method Selector Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-3.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                    paymentMethod === 'UPI'
                      ? 'border-[#C85A32] bg-white ring-2 ring-[#C85A32]/20 font-bold text-[#1E2D22]'
                      : 'border-[#E2D7C5] bg-white/70 text-[#5A4D41]'
                  }`}
                >
                  <QrCode className="w-5 h-5 text-[#C85A32]" />
                  <span className="text-xs">UPI (Instant)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('Card')}
                  className={`p-3.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                    paymentMethod === 'Card'
                      ? 'border-[#C85A32] bg-white ring-2 ring-[#C85A32]/20 font-bold text-[#1E2D22]'
                      : 'border-[#E2D7C5] bg-white/70 text-[#5A4D41]'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-[#C85A32]" />
                  <span className="text-xs">Cards / RuPay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('NetBanking')}
                  className={`p-3.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                    paymentMethod === 'NetBanking'
                      ? 'border-[#C85A32] bg-white ring-2 ring-[#C85A32]/20 font-bold text-[#1E2D22]'
                      : 'border-[#E2D7C5] bg-white/70 text-[#5A4D41]'
                  }`}
                >
                  <Building className="w-5 h-5 text-[#C85A32]" />
                  <span className="text-xs">Net Banking</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('Cash on Delivery')}
                  className={`p-3.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                    paymentMethod === 'Cash on Delivery'
                      ? 'border-[#C85A32] bg-white ring-2 ring-[#C85A32]/20 font-bold text-[#1E2D22]'
                      : 'border-[#E2D7C5] bg-white/70 text-[#5A4D41]'
                  }`}
                >
                  <Truck className="w-5 h-5 text-[#C85A32]" />
                  <span className="text-xs">Pay on Delivery</span>
                </button>
              </div>

              {/* Dynamic Payment Method UI */}
              <div className="bg-white p-6 rounded-2xl border border-[#E5DAC8] shadow-xs">
                {paymentMethod === 'UPI' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[#EAE3D5]">
                      <span className="text-xs font-semibold text-[#1E2D22]">
                        Scan to Pay with Any UPI App
                      </span>
                      <span className="text-xs text-[#2E7D32] bg-green-50 px-2 py-0.5 rounded font-mono">
                        GPay / PhonePe / Paytm / BHIM
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-6 justify-center py-2">
                      <div className="p-3 bg-white border-2 border-dashed border-[#1E2D22] rounded-xl text-center">
                        <div className="w-36 h-36 bg-[#F4EFE6] flex items-center justify-center rounded-lg border border-[#E5DAC8]">
                          <QrCode className="w-28 h-28 text-[#1E2D22]" />
                        </div>
                        <span className="text-[10px] text-[#8E7B6C] font-mono mt-1 block">
                          UPI ID: rangika@okhdfcbank
                        </span>
                      </div>

                      <div className="flex-1 space-y-3">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5B4E] mb-1">
                            Or Enter Your UPI ID / VPA
                          </label>
                          <input
                            type="text"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            placeholder="username@okaxis"
                            className="w-full text-sm px-3.5 py-2.5 border border-[#E2D7C5] rounded-xl outline-none focus:border-[#C85A32]"
                          />
                        </div>
                        <p className="text-[11px] text-[#8E7B6C]">
                          A payment collect request for ₹{cartTotal.toLocaleString('en-IN')} will be initiated directly on your UPI mobile app.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'Card' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5B4E] mb-1">
                        Card Number (Visa / Mastercard / RuPay)
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full text-sm px-3.5 py-2.5 border border-[#E2D7C5] rounded-xl outline-none focus:border-[#C85A32] font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5B4E] mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full text-sm px-3.5 py-2.5 border border-[#E2D7C5] rounded-xl outline-none focus:border-[#C85A32]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5B4E] mb-1">
                          CVV
                        </label>
                        <input
                          type="password"
                          maxLength={4}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="•••"
                          className="w-full text-sm px-3.5 py-2.5 border border-[#E2D7C5] rounded-xl outline-none focus:border-[#C85A32]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'NetBanking' && (
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5B4E] mb-2">
                      Choose Your Bank
                    </label>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full text-sm px-3.5 py-2.5 border border-[#E2D7C5] rounded-xl outline-none bg-white focus:border-[#C85A32]"
                    >
                      <option value="HDFC Bank">HDFC Bank</option>
                      <option value="State Bank of India">State Bank of India (SBI)</option>
                      <option value="ICICI Bank">ICICI Bank</option>
                      <option value="Axis Bank">Axis Bank</option>
                      <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                    </select>
                  </div>
                )}

                {paymentMethod === 'Cash on Delivery' && (
                  <div className="text-xs text-[#5A4D41] space-y-2">
                    <p className="font-semibold text-[#1E2D22]">Cash on Delivery Policy:</p>
                    <p>
                      Because our Mithila paintings are high-value delicate works of art crafted with organic pigments, our dispatch coordinator will place a quick verification phone call before courier handover.
                    </p>
                    <p className="text-[11px] text-[#8E7B6C]">
                      Please keep exact cash of ₹{cartTotal.toLocaleString('en-IN')} ready upon arrival.
                    </p>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="text-xs text-[#6B5B4E] hover:underline"
                >
                  ← Back to Shipping
                </button>

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handlePlaceOrder}
                  className="bg-[#1E2D22] hover:bg-[#C85A32] disabled:opacity-50 text-white px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>
                    {isProcessing
                      ? 'Authenticating Transaction...'
                      : `Pay & Confirm Order (₹${cartTotal.toLocaleString('en-IN')})`}
                  </span>
                </button>
              </div>
            </div>
          )}

          {step === 'confirmed' && confirmedOrder && (
            <div className="text-center py-6 sm:py-8 space-y-6 animate-in fade-in">
              <div className="w-16 h-16 bg-[#233327] text-[#D4943E] rounded-full flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs uppercase tracking-[0.25em] text-[#C85A32] font-semibold block mb-1">
                  PAYMENT VERIFIED & ORDER CONFIRMED
                </span>
                <h3 className="font-serif text-3xl font-medium text-[#1E2D22]">
                  Dhanyavaad, {confirmedOrder.customerName}!
                </h3>
                <p className="text-sm text-[#6B5B4E] mt-1">
                  Order ID: <span className="font-mono font-bold text-[#1E2D22]">{confirmedOrder.id}</span>
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#E5DAC8] text-xs text-left max-w-md mx-auto space-y-2.5">
                <div className="flex justify-between pb-2 border-b border-[#EAE3D5]">
                  <span className="text-[#8E7B6C]">Order Status:</span>
                  <span className="font-semibold text-[#2E7D32] bg-green-50 px-2 py-0.5 rounded">
                    {confirmedOrder.orderStatus}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8E7B6C]">Courier Partner:</span>
                  <span className="font-medium text-[#1E2D22]">{confirmedOrder.courierPartner}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8E7B6C]">Tracking Number:</span>
                  <span className="font-mono font-semibold text-[#1E2D22]">
                    {confirmedOrder.trackingNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8E7B6C]">Delivery Destination:</span>
                  <span className="font-medium text-[#1E2D22]">
                    {confirmedOrder.shippingAddress.city}, {confirmedOrder.shippingAddress.state}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#EAE3D5] font-semibold text-sm">
                  <span>Total Amount Paid:</span>
                  <span className="font-serif text-base text-[#1E2D22]">
                    ₹{confirmedOrder.total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setIsCheckoutOpen(false);
                    setIsAccountOpen(true);
                  }}
                  className="w-full sm:w-auto bg-[#1E2D22] hover:bg-[#C85A32] text-white px-7 py-3 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Track Order in My Account
                </button>
                <button
                  onClick={() => setIsCheckoutOpen(false)}
                  className="w-full sm:w-auto bg-[#FAF7F2] border border-[#E2D7C5] hover:bg-[#EAE3D5] text-[#2E251E] px-7 py-3 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Return to Gallery
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
