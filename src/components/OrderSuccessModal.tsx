/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, ShieldCheck, ClipboardCheck, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { Order } from '../types';
import { BRAND_COLORS } from '../data';

interface OrderSuccessModalProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({ order, onClose }) => {
  const [animationStage, setAnimationStage] = useState<'analyzing' | 'verifying' | 'writing' | 'success'>('analyzing');
  const [progressText, setProgressText] = useState('অর্ডার নিরাপদে সাবমিট করা হচ্ছে...');

  useEffect(() => {
    if (!order) return;
    
    setAnimationStage('analyzing');
    setProgressText('আপনার অর্ডার নিরাপদে প্রসেস করা হচ্ছে...');

    const timer1 = setTimeout(() => {
      setAnimationStage('verifying');
      setProgressText(
        order.paymentMethod === 'Cash on Delivery'
          ? 'তথ্যসমূহ যাচাই করা হচ্ছে এবং সিক্রেট টোকেন জেনারেট হচ্ছে...'
          : 'মোবাইল ব্যাংকিং ট্রানজেকশন এবং পেমেন্ট রশিদ ভেরিফাই করা হচ্ছে...'
      );
    }, 1500);

    const timer2 = setTimeout(() => {
      setAnimationStage('writing');
      setProgressText('জার্সি এসেন্স ডাটাবেজে আপনার অর্ডার চিরস্থায়ীভাবে নথিভুক্ত করা হচ্ছে...');
    }, 3200);

    const timer3 = setTimeout(() => {
      setAnimationStage('success');
    }, 4800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [order]);

  if (!order) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop for absolute dark luxury */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/90 backdrop-blur-lg"
        />

        {/* Cinematic Loader / Modal container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-gold/30 bg-[#0a0a0a] p-8 text-stone-200 shadow-2xl shadow-black/90"
        >
          {/* Top stripe pattern */}
          <div className="absolute top-0 left-0 right-0 flex h-1">
            <div className="flex-1" style={{ backgroundColor: BRAND_COLORS.teal }} />
            <div className="flex-1" style={{ backgroundColor: BRAND_COLORS.coral }} />
            <div className="flex-1" style={{ backgroundColor: BRAND_COLORS.orange }} />
            <div className="flex-1" style={{ backgroundColor: BRAND_COLORS.yellow }} />
          </div>

          <AnimatePresence mode="wait">
            {animationStage !== 'success' ? (
              <motion.div
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                {/* Cinematic dynamic ring rotation */}
                <div className="relative mb-6 h-20 w-20 flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    className="absolute inset-0 rounded-full border-4 border-dashed border-gold"
                  />
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                    className="absolute inset-2 rounded-full border-2 border-dashed border-gold-dark"
                  />
                  <Loader2 className="h-8 w-8 text-white animate-pulse" />
                </div>

                <h4 className="text-lg font-serif font-semibold text-white tracking-wide uppercase">
                  {animationStage === 'analyzing' && 'Step 1: বিশ্লেষণ করা হচ্ছে'}
                  {animationStage === 'verifying' && 'Step 2: পেমেন্ট ও তথ্য ভেরিফিকেশন'}
                  {animationStage === 'writing' && 'Step 3: অর্ডার বুকিং নিশ্চিতকরণ'}
                </h4>
                
                <p className="mt-3 text-stone-300 text-sm max-w-sm leading-relaxed min-h-[48px] font-light">
                  {progressText}
                </p>

                <div className="mt-8 flex gap-2 justify-center w-full max-w-[200px]">
                  <span className={`h-1.5 flex-1 rounded transition-colors duration-500 ${animationStage === 'analyzing' || animationStage==='verifying' || animationStage==='writing' ? 'bg-gold' : 'bg-stone-800'}`} />
                  <span className={`h-1.5 flex-1 rounded transition-colors duration-500 ${animationStage === 'verifying' || animationStage==='writing' ? 'bg-gold-dark' : 'bg-stone-800'}`} />
                  <span className={`h-1.5 flex-1 rounded transition-colors duration-500 ${animationStage === 'writing' ? 'bg-white' : 'bg-stone-800'}`} />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success-content"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center"
              >
                <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gold/10 text-gold ring-2 ring-gold/40 animate-bounce">
                  <div className="absolute inset-0 rounded-full blur-lg opacity-30 bg-gold" />
                  <CheckCircle2 className="h-10 w-10" />
                </div>

                <div className="text-center">
                  <span className="text-gold text-xs font-semibold tracking-widest uppercase flex items-center justify-center gap-1">
                    <Sparkles className="h-3.5 w-3.5 text-gold-dark" />
                    CONGRATULATIONS / অভিনন্দন!
                  </span>
                  <h3 className="mt-1 text-2xl font-serif font-bold text-white">
                    আপনার অর্ডার সফল হয়েছে!
                  </h3>
                  <p className="mt-1.5 text-xs text-stone-450">
                    আমাদের প্রতিনিধি শীঘ্রই আপনার সাথে ফোনে যোগাযোগ করবে।
                  </p>
                </div>

                {/* Receipt Box styled beautifully */}
                <div className="mt-6 w-full space-y-3.5 rounded-xl bg-black/50 p-5 border border-gold/15 text-sm">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                    <span className="text-stone-400 font-light">অর্ডার নাম্বার:</span>
                    <span className="font-mono font-bold text-gold tracking-wider">{order.orderNumber}</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-stone-400">কাস্টমার নাম:</span>
                      <span className="text-stone-200 font-semibold">{order.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">মোবাইল নাম্বার:</span>
                      <span className="text-stone-200 font-semibold">{order.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">ডেলিভারি ঠিকানা:</span>
                      <span className="text-stone-200 text-right max-w-[250px] truncate">{order.address}, {order.city}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">পেমেন্ট মেথড:</span>
                      <span className="text-stone-200 font-semibold">{order.paymentMethod}</span>
                    </div>
                    {order.paymentDetails?.transactionId && (
                      <div className="flex justify-between">
                        <span className="text-gold">Transaction ID:</span>
                        <span className="font-mono font-bold text-gold">{order.paymentDetails.transactionId}</span>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-white/5 pt-3 flex justify-between items-center">
                    <span className="text-stone-400 font-medium font-serif">সর্বমোট পরিশোধযোগ্য মূল্য:</span>
                    <span className="text-lg font-mono font-bold text-gold">৳{order.totalAmount}</span>
                  </div>
                </div>

                {/* Quick Info Badge */}
                <div className="mt-4 flex items-center gap-2 text-xs text-stone-300 bg-gold/5 border border-gold/20 px-3.5 py-2 rounded-lg">
                  <ShieldCheck className="h-4 w-4 text-gold" />
                  <span>আপনার তথ্য নিরাপদ এনক্রিপশনে সুরক্ষিত করা হয়েছে।</span>
                </div>

                <button
                  onClick={onClose}
                  id="success-dismiss-button"
                  className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-gold to-gold-dark text-black font-semibold rounded-xl hover:scale-[1.01] transition-all transform active:scale-95 cursor-pointer shadow-lg shadow-gold/20"
                >
                  <span>স্টোরে ফেরত যান (Back to Homepage)</span>
                  <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
