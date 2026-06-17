/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import {
  ShoppingBag, X, Trash2, ArrowRight, ShieldCheck, Clipboard, Check, Phone, MapPin, CreditCard, Upload, AlertCircle, ShoppingCart, Truck, Lock, ArrowLeft
} from 'lucide-react';
import { CartItem, Order, PaymentDetails } from '../types';
import { BRAND_COLORS, bKASH_NUMBER, NAGAD_NUMBER } from '../data';
import { JerseySvg } from './JerseySvg';

interface CheckoutPageProps {
  cartItems: CartItem[];
  lang: 'bn' | 'en';
  onClose: () => void;
  onUpdateQty: (itemId: string, newQty: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
  onPlaceOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'orderDate'>) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  cartItems,
  lang,
  onClose,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onPlaceOrder,
}) => {
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'details' | 'payment'>('details');

  // Checkout Form States
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Dhaka');
  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad' | 'Cash on Delivery'>('Cash on Delivery');

  // Payment Proof States
  const [senderNumber, setSenderNumber] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [screenshotData, setScreenshotData] = useState<string>(''); // Base64
  const [screenshotName, setScreenshotName] = useState<string>('');

  // Feedbacks
  const [errorText, setErrorText] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cart total computation
  const baseSubtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const deliveryCharge = city === 'Dhaka' ? 80 : 150;
  const totalAmount = baseSubtotal + deliveryCharge;

  // Dictionary translation overrides for Checkout Page
  const t = {
    cartSummary: lang === 'bn' ? 'অর্ডার সামারি' : 'Order Summary',
    jerseyDetails: lang === 'bn' ? 'জার্সি বিবরণী' : 'Jersey Details',
    size: lang === 'bn' ? 'সাইজ' : 'Size',
    quantity: lang === 'bn' ? 'পরিমাণ' : 'Qty',
    totalPrice: lang === 'bn' ? 'সর্বমোট মূল্য' : 'Total Price',
    subtotal: lang === 'bn' ? 'জার্সির মূল্য' : 'Subtotal',
    shipping: lang === 'bn' ? 'ডেলিভারি চার্জ' : 'Delivery Cost',
    grandTotal: lang === 'bn' ? 'সর্বমোট প্রদেয় বিল' : 'Grand Total',
    customerInfo: lang === 'bn' ? '১. কাস্টমার ও ডেলিভারি তথ্য' : '1. Customer & Shipping Info',
    paymentStep: lang === 'bn' ? '২. নিরাপদ পেমেন্ট গেটওয়ে' : '2. Secure Payment Gateway',
    fullNameLabel: lang === 'bn' ? 'আপনার পুরো নাম (Full Name) *' : 'Your Full Name *',
    phoneLabel: lang === 'bn' ? 'মোবাইল নাম্বার (Mobile Number) *' : 'Active Mobile Number *',
    cityLabel: lang === 'bn' ? 'ডেলিভারি এরিয়া (Delivery Location) *' : 'Delivery Area *',
    addressLabel: lang === 'bn' ? 'পূর্ণ ঠিকানা (থানা, জেলা সহ পিনপয়েন্ট লোকেশন) *' : 'Complete Shipping Address *',
    cityInside: lang === 'bn' ? 'ঢাকা সিটির ভিতরে (৳৮০)' : 'Inside Dhaka City (৳80)',
    cityOutside: lang === 'bn' ? 'ঢাকার বাইরে (৳১৫০)' : 'Outside Dhaka (৳150)',
    paymentMethodPrompt: lang === 'bn' ? 'পেমেন্ট করার মাধ্যম নির্বাচন করুন:' : 'Select Your Payment Method:',
    codTermsTitle: lang === 'bn' ? '📦 ক্যাশ অন ডেলিভারি শর্তাবলী:' : '📦 Cash on Delivery Conditions:',
    codTermsDesc: lang === 'bn' ? 'পণ্য হাতে বুঝে পাওয়ার পর সম্পূর্ণ মূল্য ডেলিভারিম্যানকে পরিশোধ করুন। জার্সি এসেন্স আপনাকে প্রোডাক্ট চেক করার পূর্ণ সুযোগ দেবে।' : 'Pay the full invoice to the delivery agent upon receiving and inspecting your premium jersey.',
    payInstruction: lang === 'bn' ? 'নিচের পার্সোনাল নাম্বারে সেন্ডমানি করুন:' : 'Send Money to the following personal wallet:',
    paymentWarning: lang === 'bn' ? '* টাকা পাঠানোর পর নিচের ইনপুটে ট্রানজেকশন আইডি দিন অথবা স্ক্রিনশটটি আপলোড করুন। এর যেকোনো একটি ছাড়া অর্ডার নিশ্চিত হবে না।' : '* After payment, enter Transaction ID or upload a screenshot. Order cannot be validated without either.',
    senderPhoneLabel: lang === 'bn' ? 'আপনার সেন্ডিং মোবাইল নাম্বার (যেখান থেকে টাকা পাঠিয়েছেন)' : 'Your Sending Wallet Number',
    txIdLabel: lang === 'bn' ? 'পেমেন্ট ট্রানজেকশন আইডি (Transaction ID) *' : 'Payment Transaction ID (TxID) *',
    screenshotLabel: lang === 'bn' ? 'পেমেন্ট রশিদ স্ক্রিনশট (Screenshot Upload) *' : 'Payment Success Receipt Screenshot *',
    uploadPlaceholder: lang === 'bn' ? 'রশিদের স্ক্রিনশট সিলেক্ট করুন বা ড্রপ করুন' : 'Drop or browse the payment receipt screenshot',
    orderSubmitBtn: lang === 'bn' ? 'অর্ডার প্লেস করুন (Confirm Order)' : 'Place Secure Order Now',
    backBtn: lang === 'bn' ? 'স্টোরে ফিরে যান' : 'Go Back to Store',
    checkoutSecureTitle: lang === 'bn' ? 'জেই লাক্সারি সিকিউর চেকআউট' : 'JE Luxury Secure Checkout',
    checkoutSecureSub: lang === 'bn' ? 'আপনার তথ্য নিরাপদ চ্যানেলে থার্ড পার্টি ছাড়াই ভেরিফাইড করা হচ্ছে' : 'Your credentials are encrypted over a private verified vintage protection gate',
    requiredFieldsErr: lang === 'bn' ? 'অনুগ্রহ করে আপনার সঠিক নাম, সচল মোবাইল নাম্বার এবং পুরো ঠিকানা প্রদান করুন।' : 'Please provide your correct full name, active mobile number, and full address.',
    phoneDigitsErr: lang === 'bn' ? 'অনুগ্রহ করে একটি সঠিক ১১ ডিজিটের মোবাইল নাম্বার প্রদান করুন।' : 'Please enter a valid 11-digit mobile number.',
    paymentProofErr: lang === 'bn' ? 'আপনি মোবাইল ব্যাংকিং সিলেক্ট করেছেন। সফল অর্ডারের জন্য সফল ট্রানজেকশন আইডি অথবা সফল পেমেন্ট স্ক্রিনশট প্রদান করা আবশ্যক।' : 'You selected a mobile payment method. Please provide either a Transaction ID or a receipt screenshot to verify.',
    successAction: lang === 'bn' ? 'অর্ডার প্রসেস করুন' : 'Validate Payment Info',
    checkoutStepLabel: lang === 'bn' ? 'নিরাপদ পেমেন্টে যান' : 'Proceed to Payment Gate',
    returnCartLabel: lang === 'bn' ? 'পূর্বের পাতায় যান' : 'Back to Delivery Details',
    billingOverview: lang === 'bn' ? 'বিলিং হিসাব-নিকাশ' : 'Billing Information'
  };

  const handleCopy = (num: string, label: string) => {
    navigator.clipboard.writeText(num);
    setCopiedText(label);
    setTimeout(() => {
      setCopiedText(null);
    }, 2000);
  };

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        setErrorText(lang === 'bn' ? 'স্ক্রিনশটের সাইজ ৩ মেগাবাইটের বেশি হওয়া যাবে না।' : 'Screenshot file size cannot exceed 3MB.');
        return;
      }
      setScreenshotName(file.name);
      setErrorText(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setScreenshotData(base64);
        setScreenshotPreview(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText(null);

    // Form validations
    if (!customerName.trim() || !phone.trim() || !address.trim() || !city.trim()) {
      setErrorText(t.requiredFieldsErr);
      return;
    }

    if (phone.replace(/\D/g, '').length < 11) {
      setErrorText(t.phoneDigitsErr);
      return;
    }

    if (paymentMethod !== 'Cash on Delivery') {
      const isTxIdEmpty = !transactionId.trim();
      const isScreenshotEmpty = !screenshotData;

      if (isTxIdEmpty && isScreenshotEmpty) {
        setErrorText(t.paymentProofErr);
        return;
      }
    }

    // Prepare payment payload
    const paymentDetails: PaymentDetails = {};
    if (paymentMethod === 'bKash') {
      paymentDetails.bKashNumberUsed = senderNumber;
      paymentDetails.transactionId = transactionId.trim();
      paymentDetails.screenshotData = screenshotData;
      paymentDetails.screenshotName = screenshotName;
    } else if (paymentMethod === 'Nagad') {
      paymentDetails.nagadNumberUsed = senderNumber;
      paymentDetails.transactionId = transactionId.trim();
      paymentDetails.screenshotData = screenshotData;
      paymentDetails.screenshotName = screenshotName;
    }

    // Call callback
    onPlaceOrder({
      customerName,
      phone,
      address,
      city,
      items: cartItems,
      paymentMethod,
      paymentDetails,
      totalAmount,
      status: 'Pending'
    });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-stone-200 py-6 md:py-12 px-4 select-none relative overflow-y-auto">
      {/* Background radial effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full filter blur-[150px] opacity-15 bg-gradient-to-tr from-gold to-[#1d1607] pointer-events-none" />

      <div className="max-w-6xl mx-auto z-10 relative">
        {/* Header toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b border-gold/15">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 bg-stone-900 border border-gold/25 text-gold hover:text-white rounded-lg hover:bg-gold/15 transition-all cursor-pointer shadow flex items-center justify-center gap-1 text-xs"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{t.backBtn}</span>
            </button>
            <div>
              <h2 className="text-xl md:text-2xl font-serif font-black text-white tracking-wider flex items-center gap-2 uppercase">
                <Lock className="h-5 w-5 text-gold animate-pulse shrink-0" />
                {t.checkoutSecureTitle}
              </h2>
              <p className="text-[10px] md:text-xs text-stone-400 font-light mt-0.5">
                {t.checkoutSecureSub}
              </p>
            </div>
          </div>
          
          <div className="text-xs font-mono font-bold py-1 bg-gold/10 px-3.5 rounded border border-gold/25 text-gold self-start md:self-auto flex items-center gap-1">
            <ShieldCheck className="h-4 w-4" />
            <span>SSL HIGH END VINTAGE ENCRYPTED</span>
          </div>
        </div>

        {/* Outer Layout GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: Shipping details & Payment steps (Col-span 7) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Steps Controller toggling */}
            <div className="flex items-center gap-2 bg-stone-950 p-1.5 rounded-xl border border-white/5">
              <button
                onClick={() => setCheckoutStep('details')}
                className={`flex-1 py-2 text-xs font-serif font-bold rounded-lg transition-all ${checkoutStep === 'details' ? 'bg-[#1e1e1e] text-gold border border-gold/10 shadow' : 'text-stone-400 hover:text-white'}`}
              >
                {t.customerInfo}
              </button>
              <button
                onClick={() => {
                  if (customerName.trim() && phone.trim() && address.trim()) {
                    setCheckoutStep('payment');
                  } else {
                    setErrorText(t.requiredFieldsErr);
                  }
                }}
                className={`flex-1 py-2 text-xs font-serif font-bold rounded-lg transition-all ${checkoutStep === 'payment' ? 'bg-[#1e1e1e] text-gold border border-gold/10 shadow' : 'text-stone-500'}`}
              >
                {t.paymentStep}
              </button>
            </div>

            {/* Error notifications */}
            {errorText && (
              <div className="bg-rose-500/10 border border-rose-500/30 p-4 rounded-xl flex gap-3 text-rose-200 text-xs leading-relaxed items-start animate-shake">
                <AlertCircle className="h-5 w-5 shrink-0 text-rose-400 mt-0.5" />
                <span>{errorText}</span>
              </div>
            )}

            {/* FORM WRAPPERS */}
            {checkoutStep === 'details' ? (
              <div className="bg-[#0c0c0c] border border-gold/15 rounded-xl p-6 space-y-4 shadow-xl">
                <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-white pb-2.5 border-b border-white/5">
                  📬 {lang === 'bn' ? 'অর্ডার ডেলিভারি ও কুরিয়ার এলাকা ফর্ম' : 'Courier Details & Form'}
                </h3>
                
                <div className="space-y-4 pt-1">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-stone-450 mb-1.5">{t.fullNameLabel}</label>
                    <input
                      type="text"
                      placeholder={lang === 'bn' ? 'যেমন: হাসিন শাহরিয়ার সৈকত' : 'e.g., Hasin Shahriar Saikat'}
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-black border border-gold/20 text-stone-200 text-sm focus:border-gold focus:outline-none placeholder-stone-600 focus:ring-1 focus:ring-gold/10"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-stone-450 mb-1.5">{t.phoneLabel}</label>
                    <div className="relative">
                      <input
                        type="tel"
                        maxLength={11}
                        placeholder="01xxxxxxxxx"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-black border border-gold/20 text-stone-200 text-sm font-mono focus:border-gold focus:outline-none placeholder-stone-600"
                      />
                      <Phone className="absolute top-3.5 left-3.5 text-gold h-4 w-4" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-stone-450 mb-1.5">{t.cityLabel}</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setCity('Dhaka')}
                        className={`py-3.5 px-3.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${city === 'Dhaka' ? 'bg-gradient-to-r from-gold to-gold-dark text-black border-gold shadow' : 'bg-black border-gold/15 text-stone-300 hover:border-gold/45'}`}
                      >
                        {t.cityInside}
                      </button>
                      <button
                        type="button"
                        onClick={() => setCity('Outside Dhaka')}
                        className={`py-3.5 px-3.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${city === 'Outside Dhaka' ? 'bg-gradient-to-r from-gold to-gold-dark text-black border-gold shadow' : 'bg-black border-gold/15 text-stone-300 hover:border-gold/45'}`}
                      >
                        {t.cityOutside}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-stone-450 mb-1.5">{t.addressLabel}</label>
                    <div className="relative">
                      <textarea
                        rows={3}
                        placeholder={lang === 'bn' ? 'থানা, জেলা, গ্রাম বা বাড়ির নাম্বার পিনপয়েন্ট লিখুন...' : 'Write custom village, area, house and road number...'}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-black border border-gold/20 text-stone-200 text-sm focus:border-gold focus:outline-none placeholder-stone-600 leading-relaxed"
                      />
                      <MapPin className="absolute top-3.5 left-3.5 text-gold h-4.5 w-4.5" />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5">
                  <button
                    onClick={() => {
                      if (!customerName.trim() || !phone.trim() || !address.trim()) {
                        setErrorText(t.requiredFieldsErr);
                        return;
                      }
                      if (phone.replace(/\D/g, '').length < 11) {
                        setErrorText(t.phoneDigitsErr);
                        return;
                      }
                      setErrorText(null);
                      setCheckoutStep('payment');
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-gold to-gold-dark text-black font-serif font-black uppercase tracking-wider rounded-xl transition-all hover:scale-[1.01] cursor-pointer text-xs"
                  >
                    <span>{t.checkoutStepLabel}</span>
                    <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-[#0c0c0c] border border-gold/15 rounded-xl p-6 space-y-5 shadow-xl animate-fadeIn">
                <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-white pb-2.5 border-b border-white/5">
                  🔒 {t.paymentMethodPrompt}
                </h3>

                {/* Gate choices */}
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => { setPaymentMethod('Cash on Delivery'); setErrorText(null); }}
                    className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer text-center ${paymentMethod === 'Cash on Delivery' ? 'bg-gold/10 border-gold text-gold font-bold scale-[1.03]' : 'bg-black border-gold/10 text-stone-400'}`}
                  >
                    <CreditCard className="h-5 w-5" />
                    <span className="text-[10px] font-bold">{lang === 'bn' ? 'ক্যাশ অন ডেলিভারি' : 'Cash on Delivery'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setPaymentMethod('bKash'); setErrorText(null); }}
                    className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer text-center ${paymentMethod === 'bKash' ? 'bg-[#d12462]/10 border-[#d12462]/80 text-white scale-[1.03]' : 'bg-black border-gold/10 text-stone-400'}`}
                  >
                    <span className="font-black text-sm text-[#d12462]">bKash</span>
                    <span className="text-[10px] font-bold">{lang === 'bn' ? 'বিকাশ সেন্ডমানি' : 'bKash Sendmoney'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setPaymentMethod('Nagad'); setErrorText(null); }}
                    className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer text-center ${paymentMethod === 'Nagad' ? 'bg-[#e35a22]/10 border-[#e35a22]/80 text-white scale-[1.03]' : 'bg-black border-gold/10 text-stone-400'}`}
                  >
                    <span className="font-black text-sm text-[#e35a22]">Nagad</span>
                    <span className="text-[10px] font-bold">{lang === 'bn' ? 'নগদ সেন্ডমানি' : 'Nagad Sendmoney'}</span>
                  </button>
                </div>

                {/* Terms or dynamic content */}
                {paymentMethod === 'Cash on Delivery' ? (
                  <div className="bg-black/55 p-4 rounded-xl border border-gold/15 text-xs text-stone-300 leading-relaxed space-y-3">
                    <p className="font-semibold text-gold text-sm flex items-center gap-1">
                      {t.codTermsTitle}
                    </p>
                    <p className="font-light text-stone-400 leading-relaxed">
                      {t.codTermsDesc}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 animate-fadeIn pt-1">
                    {/* Send money banner */}
                    <div className="bg-black p-4 rounded-xl border border-gold/25 space-y-3.5">
                      <span className="text-xs text-stone-400 font-mono block">
                        {t.payInstruction} <b className="text-white text-sm">৳{totalAmount}</b>
                      </span>

                      <div className="flex items-center justify-between bg-zinc-950 px-4 py-2.5 rounded-lg border border-gold/15">
                        <div className="flex items-center gap-2.5">
                          <span className="h-6 w-1 rounded bg-[#D4AF37]" />
                          <span className="font-mono text-base md:text-lg font-bold text-gold tracking-widest">
                            {paymentMethod === 'bKash' ? bKASH_NUMBER : NAGAD_NUMBER}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleCopy(paymentMethod === 'bKash' ? bKASH_NUMBER : NAGAD_NUMBER, paymentMethod)}
                          className="text-stone-400 hover:text-white px-2.5 py-1.5 bg-white/5 hover:bg-white/10 rounded border border-white/10 transition-colors text-xs flex items-center gap-1 cursor-pointer font-bold"
                        >
                          {copiedText === paymentMethod ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-emerald-400" />
                              <span className="text-emerald-400">COPIED</span>
                            </>
                          ) : (
                            <>
                              <Clipboard className="h-3.5 w-3.5 text-gold" />
                              <span>{lang === 'bn' ? 'কপি করুন' : 'Copy'}</span>
                            </>
                          )}
                        </button>
                      </div>

                      <span className="text-[10px] text-gold/80 block leading-relaxed italic font-light">
                        {t.paymentWarning}
                      </span>
                    </div>

                    {/* Receipt fields */}
                    <div className="space-y-3 pt-1">
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-stone-450 mb-1">{t.senderPhoneLabel}</label>
                        <input
                          type="tel"
                          maxLength={11}
                          placeholder="e.g., 017xxxxxxxx"
                          value={senderNumber}
                          onChange={(e) => setSenderNumber(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-lg bg-black border border-gold/20 text-stone-200 text-xs font-mono focus:border-gold focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-stone-450 mb-1">
                          {t.txIdLabel}
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., 8N48F89A"
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-lg bg-black border border-gold/25 text-stone-200 text-sm font-mono focus:border-gold focus:outline-none uppercase"
                        />
                      </div>

                      {/* Screenshot drag drop container */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-mono uppercase tracking-wider text-stone-450">
                          {t.screenshotLabel}
                        </label>

                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="border border-dashed border-gold/30 hover:border-gold/70 rounded-xl p-4 flex flex-col items-center justify-center gap-2 bg-black cursor-pointer transition-all hover:bg-black/60"
                        >
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleScreenshotChange}
                            accept="image/*"
                            className="hidden"
                          />

                          {screenshotPreview ? (
                            <div className="space-y-2 text-center w-full">
                              <div className="h-24 w-36 mx-auto relative bg-black/90 rounded border border-gold/20 overflow-hidden">
                                <img src={screenshotPreview} alt="Receipt proof" className="h-full w-full object-cover" />
                                <div className="absolute top-1 right-1 bg-black/80 px-1 py-0.5 rounded text-gold text-[9px] font-mono border border-gold/20">OK</div>
                              </div>
                              <span className="text-[10px] text-stone-300 block truncate max-w-[200px] mx-auto font-mono">{screenshotName}</span>
                            </div>
                          ) : (
                            <>
                              <div className="p-2 bg-[#1b1b1b] rounded-full border border-gold/20 text-gold shadow">
                                <Upload className="h-4.5 w-4.5" />
                              </div>
                              <span className="text-xs text-stone-300 font-serif">{t.uploadPlaceholder}</span>
                              <span className="text-[9px] text-stone-550">png, jpeg, jpg • Max 3MB</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submits and Back buttons */}
                <div className="grid grid-cols-3 gap-3.5 pt-4 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setCheckoutStep('details')}
                    className="col-span-1 py-3 bg-stone-900 border border-gold/25 hover:bg-gold/10 text-stone-300 text-xs rounded-xl font-medium transition-colors cursor-pointer text-center"
                  >
                    {t.returnCartLabel}
                  </button>
                  <button
                    type="button"
                    onClick={handleCheckoutSubmit}
                    className="col-span-2 flex items-center justify-center gap-1.5 py-3 bg-gradient-to-r from-gold to-gold-dark text-black font-serif font-black uppercase tracking-wider rounded-xl shadow-lg shadow-gold/20 cursor-pointer active:scale-95 text-xs"
                  >
                    <span>{t.orderSubmitBtn}</span>
                    <ShieldCheck className="h-4.5 w-4.5 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Order Summary items preview (Col-span 5) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Items Card */}
            <div className="bg-[#0c0c0c] border border-gold/15 rounded-xl p-5 shadow-xl space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-white pb-2.5 border-b border-white/5 flex items-center justify-between">
                <span>👜 {t.cartSummary}</span>
                <span className="text-xs font-mono py-0.5 px-2.5 bg-gold/10 rounded border border-gold/20 text-gold">
                  {cartItems.reduce((acc, item) => acc + item.quantity, 0)} Items
                </span>
              </h3>

              <div className="max-h-[350px] overflow-y-auto divide-y divide-white/5 pr-1 space-y-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 pt-3 first:pt-0">
                    <div className="h-16 w-14 bg-black/60 border border-gold/10 p-1.5 rounded flex items-center justify-center shrink-0">
                      <JerseySvg
                        baseColor={item.product.baseColor}
                        accentColor={item.product.accentColor}
                        stripeColors={item.product.stripeColors}
                        patternType={item.product.patternType}
                        showShadow={false}
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-serif font-bold text-stone-100 line-clamp-1">
                          {item.product.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9px] uppercase font-bold text-gold bg-gold/10 px-2 py-0.5 rounded border border-gold/15">
                            {t.size}: {item.chosenSize}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1.5">
                        <div className="flex items-center border border-white/5 rounded overflow-hidden bg-black/35 font-mono">
                          <button
                            onClick={() => item.quantity > 1 && onUpdateQty(item.id, item.quantity - 1)}
                            className="px-1.5 py-0.5 text-stone-400 hover:text-white"
                          >
                            -
                          </button>
                          <span className="px-2 text-gold font-bold">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                            className="px-1.5 py-0.5 text-stone-400 hover:text-white"
                          >
                            +
                          </button>
                        </div>

                        <span className="font-mono text-stone-100 font-semibold">৳{item.product.price * item.quantity}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="p-1 px-1.5 text-stone-600 hover:text-rose-500 self-start hover:bg-rose-500/10 rounded transition-colors"
                      title="Remove jersey item"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Pricing section with subtotal and logistics */}
              <div className="pt-4 border-t border-white/5 space-y-2.5 text-xs text-stone-300">
                <p className="text-[10px] uppercase tracking-widest font-mono text-stone-500">{t.billingOverview}</p>
                
                <div className="flex justify-between">
                  <span className="text-stone-450">{t.subtotal}:</span>
                  <span className="font-mono text-stone-100">৳{baseSubtotal}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-stone-450">
                    {t.shipping} ({city === 'Dhaka' ? (lang === 'bn' ? 'ঢাকা সিটি' : 'Inside Dhaka') : (lang === 'bn' ? 'ঢাকার বাইরে' : 'Outside Dhaka')}):
                  </span>
                  <span className="font-mono text-stone-100">৳{deliveryCharge}</span>
                </div>

                <div className="flex justify-between items-baseline text-sm font-bold pt-3 border-t border-gold/10">
                  <span className="text-white font-serif">{t.grandTotal}:</span>
                  <span className="font-mono text-gold text-lg">৳{totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Micro details assurance */}
            <div className="bg-[#0c0c0c] border border-stone-900 rounded-xl p-4 flex gap-3 text-[10px] text-stone-500 font-light leading-relaxed">
              <Truck className="h-5 w-5 text-gold shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-stone-300 uppercase font-mono tracking-wider">{lang === 'bn' ? 'এক্সপ্রেস শিপিং ট্র্যাকিং' : 'Express Delivery Partners'}</p>
                <p className="mt-0.5">{lang === 'bn' ? 'ঢাকা সিটিতে ২৪-৪৮ ঘণ্টা এবং ঢাকার বাইরে ৩-৫ দিনের মাঝে পাঠাও বা সুন্দরবন কুরিয়ারের মাধ্যমে ১০০% প্রিমিয়াম সুতি ফিনিশ জার্সি সুরক্ষিত ব্যাগে পাঠানো হবে।' : 'Within 24-48 hours inside Dhaka and 3-5 days outside via Pathao Courier in secure layered protection bags.'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
