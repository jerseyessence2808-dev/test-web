/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingBag, X, Trash2, ArrowRight, ShieldCheck, ShoppingCart
} from 'lucide-react';
import { CartItem } from '../types';
import { BRAND_COLORS } from '../data';
import { JerseySvg } from './JerseySvg';

interface CartDrawerProps {
  isOpen: boolean;
  cartItems: CartItem[];
  lang: 'bn' | 'en';
  onClose: () => void;
  onUpdateQty: (itemId: string, newQty: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  cartItems,
  lang,
  onClose,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onCheckout,
}) => {
  // Cart total computation
  const baseSubtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  // Localization labels
  const t = {
    myBag: lang === 'bn' ? 'আপনার শপিং ব্যাগ' : 'Your Shopping Bag',
    emptyBag: lang === 'bn' ? 'আপনার ব্যাগ খালি রয়েছে' : 'Your bag is empty',
    emptySub: lang === 'bn' ? 'স্টোরে ব্রাউজ করে আকর্ষণীয় রেট্রো জার্সি সিলেক্ট করুন।' : 'Browse our premium catalog to add custom vintage outfits.',
    browseBtn: lang === 'bn' ? 'স্টোরে ব্রাউজ করুন' : 'Browse Online Store',
    totalQty: lang === 'bn' ? 'মোট জার্সি সংখ্যা:' : 'Total jerseys:',
    clearAll: lang === 'bn' ? 'সব রিমুভ করুন' : 'Remove All',
    size: lang === 'bn' ? 'সাইজ' : 'SIZE',
    subtotal: lang === 'bn' ? 'উপ-মোট জার্সির মূল্য' : 'Subtotal Price',
    checkoutBtn: lang === 'bn' ? 'চেকআউট পাতায় যান (Checkout)' : 'Proceed to Checkout',
    secureChanel: lang === 'bn' ? 'SSL সুরক্ষিত ভিন্টেজ ট্রানজেকশন কন্টেইনার' : 'SSL Secure Vintage Transaction Gate'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Drawer Body container */}
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.35, ease: 'easeInOut' }}
              className="w-screen max-w-md bg-[#0a0a0a] border-l border-gold/30 text-stone-200 flex flex-col shadow-2xl relative"
            >
              {/* Brand striped indicator top edge */}
              <div className="flex h-1.5 w-full">
                <div className="flex-1" style={{ backgroundColor: BRAND_COLORS.teal }} />
                <div className="flex-1" style={{ backgroundColor: BRAND_COLORS.coral }} />
                <div className="flex-1" style={{ backgroundColor: BRAND_COLORS.orange }} />
                <div className="flex-1" style={{ backgroundColor: BRAND_COLORS.yellow }} />
              </div>

              {/* Drawer Title Section */}
              <div className="px-5 py-4 border-b border-gold/10 bg-black/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-gold" />
                  <h3 className="font-serif font-bold text-white uppercase tracking-wider text-sm">
                    {t.myBag}
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-full hover:bg-gold/10 text-gold hover:text-white transition-colors border border-gold/10 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Shopping bag dynamic area */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#0a0a0a]">
                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
                    <div className="h-16 w-16 flex items-center justify-center rounded-full bg-stone-900/50 border border-gold/15">
                      <ShoppingBag className="h-8 w-8 text-gold" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-serif font-semibold text-stone-200 text-sm">{t.emptyBag}</p>
                      <p className="text-xs text-stone-500 max-w-[200px]">{t.emptySub}</p>
                    </div>
                    <button
                      onClick={onClose}
                      className="px-5 py-2.5 bg-gradient-to-r from-gold to-gold-dark text-black font-serif font-black tracking-wider text-xs rounded-lg transition-all cursor-pointer shadow-lg shadow-gold/20 hover:scale-[1.02]"
                    >
                      {t.browseBtn}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs text-stone-400">
                      <span>{t.totalQty} <b className="text-white font-mono">{cartItems.reduce((acc, current) => acc + current.quantity, 0)}</b></span>
                      <button onClick={onClearCart} className="text-gold hover:underline font-bold cursor-pointer">{t.clearAll}</button>
                    </div>

                    <div className="divide-y divide-white/5 space-y-3.5">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex gap-3.5 pt-3.5 first:pt-0">
                          {/* SVG jersey rendering */}
                          <div className="h-20 w-16 bg-black/40 border border-gold/10 rounded p-1.5 shrink-0 flex items-center justify-center">
                            <JerseySvg
                              baseColor={item.product.baseColor}
                              accentColor={item.product.accentColor}
                              stripeColors={item.product.stripeColors}
                              patternType={item.product.patternType}
                              showShadow={false}
                            />
                          </div>

                          {/* Details */}
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start">
                                <h4 className="text-xs font-serif font-bold text-stone-100 max-w-[170px] truncate leading-tight">
                                  {item.product.name}
                                </h4>
                                <button
                                  onClick={() => onRemoveItem(item.id)}
                                  className="text-stone-500 hover:text-rose-500 p-1 transition-colors hover:scale-105 cursor-pointer"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                              <span className="text-[10px] uppercase font-bold text-gold mt-1 bg-gold/10 px-2.5 py-0.5 rounded inline-block border border-gold/20">
                                {t.size}: {item.chosenSize}
                              </span>
                            </div>

                            {/* Steppers */}
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center border border-gold/15 rounded-lg overflow-hidden bg-black/40 font-mono">
                                <button
                                  onClick={() => item.quantity > 1 && onUpdateQty(item.id, item.quantity - 1)}
                                  className="px-2.5 py-1 text-xs text-stone-400 hover:text-gold hover:bg-gold/10 cursor-pointer"
                                >
                                  -
                                </button>
                                <span className="px-3 text-xs text-gold font-bold">{item.quantity}</span>
                                <button
                                  onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                                  className="px-2.5 py-1 text-xs text-stone-400 hover:text-gold hover:bg-gold/10 cursor-pointer"
                                >
                                  +
                                </button>
                              </div>
                              <span className="font-mono text-sm font-bold text-white">৳{item.product.price * item.quantity}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Pricing breakdown & checkout button footer */}
              {cartItems.length > 0 && (
                <div className="p-5 border-t border-gold/10 bg-black/55 space-y-4">
                  <div className="flex justify-between text-base font-bold py-1 border-b border-gold/5 pb-2">
                    <span className="text-white font-serif">{t.subtotal}:</span>
                    <span className="font-mono text-gold text-lg">৳{baseSubtotal}</span>
                  </div>

                  <div className="pt-1">
                    <button
                      onClick={onCheckout}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-gold to-gold-dark text-black font-serif font-black uppercase tracking-[0.1em] rounded-xl transition-all cursor-pointer text-sm shadow-lg shadow-gold/20 hover:scale-[1.01]"
                    >
                      <span>{t.checkoutBtn}</span>
                      <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 text-[9px] text-stone-600 justify-center">
                    <ShieldCheck className="h-3 w-3 text-stone-750" />
                    <span>{t.secureChanel}</span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
