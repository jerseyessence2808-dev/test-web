/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, ShoppingBag } from 'lucide-react';
import { AdConfig, Product } from '../types';
import { BRAND_COLORS } from '../data';
import { JerseySvg } from './JerseySvg';

interface AdPopupProps {
  config: AdConfig;
  product: Product | undefined;
  onClose: () => void;
  onSelectProduct: (productId: string) => void;
}

export const AdPopup: React.FC<AdPopupProps> = ({
  config,
  product,
  onClose,
  onSelectProduct
}) => {
  if (!config.isEnabled) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          key="ad-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/90 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          key="ad-container"
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
          className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-gold/30 bg-[#0a0a0a] text-white shadow-2xl shadow-black/80"
        >
          {/* Logo Brand Deco Banner */}
          <div className="flex h-1.5 w-full">
            <div className="flex-1" style={{ backgroundColor: BRAND_COLORS.teal }} />
            <div className="flex-1" style={{ backgroundColor: BRAND_COLORS.coral }} />
            <div className="flex-1" style={{ backgroundColor: BRAND_COLORS.orange }} />
            <div className="flex-1" style={{ backgroundColor: BRAND_COLORS.yellow }} />
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            id="close-ad-button"
            className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-gold hover:bg-gold/20 transition-all cursor-pointer border border-gold/15"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Campaign Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 md:p-8">
            
            {/* Left Column: Visual Showcase (The Jersey) */}
            <div className="md:col-span-5 flex flex-col items-center justify-center bg-black/35 rounded-xl p-4 border border-white/5 relative overflow-hidden group">
              {/* Retro gradient background circle */}
              <div className="absolute w-40 h-40 rounded-full blur-2xl opacity-25 bg-gradient-to-tr from-gold to-gold-dark" />
              
              {product ? (
                <div className="w-full max-w-[200px] transform hover:scale-105 transition-transform duration-500">
                  <JerseySvg
                    baseColor={product.baseColor}
                    accentColor={product.accentColor}
                    stripeColors={product.stripeColors}
                    patternType={product.patternType}
                  />
                </div>
              ) : (
                <div className="w-32 h-32 flex items-center justify-center border-2 border-dashed border-stone-600 rounded-lg text-stone-500 text-xs">
                  No Product Selected
                </div>
              )}
              
              {product && (
                <div className="mt-4 text-center">
                  <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold bg-gold/10 px-3 py-1 rounded-full border border-gold/20">
                    {product.category}
                  </span>
                  <h4 className="mt-1 font-serif text-sm text-stone-200 truncate max-w-[180px]">
                    {product.name}
                  </h4>
                </div>
              )}
            </div>

            {/* Right Column: Copy & Action */}
            <div className="md:col-span-7 flex flex-col justify-between space-y-5">
              
              <div className="space-y-3">
                {/* Badge text */}
                {config.badgeText && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#D4AF37] bg-gold/10 border border-gold/30 px-2.5 py-0.5 rounded">
                    <Sparkles className="h-3 w-3" />
                    {config.badgeText}
                  </span>
                )}
                
                {/* Title */}
                <h3 className="text-xl md:text-2xl font-serif font-bold text-white leading-snug">
                  {config.title}
                </h3>

                {/* Description */}
                <p className="text-stone-300 text-sm leading-relaxed whitespace-pre-line font-light">
                  {config.description}
                </p>
              </div>

              {/* Action and Pricing */}
              <div className="space-y-4 pt-2">
                {product && (
                  <div className="flex items-baseline gap-2.5 bg-black/40 px-4 py-2.5 rounded-lg border border-gold/10">
                    <span className="text-stone-400 text-xs font-mono">Special Price:</span>
                    <span className="text-xl font-bold font-mono text-gold">৳{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm line-through text-stone-500 font-mono">৳{product.originalPrice}</span>
                    )}
                  </div>
                )}

                <button
                  onClick={() => {
                    if (product) {
                      onSelectProduct(product.id);
                    } else {
                      onClose();
                    }
                  }}
                  id="ad-action-button"
                  className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-gold to-gold-dark text-black hover:scale-[1.01] font-serif font-black tracking-wider rounded-xl transition-all shadow-lg shadow-gold/20 transform active:scale-[0.98] cursor-pointer"
                >
                  <ShoppingBag className="h-5 w-5 stroke-[2.5]" />
                  <span>{config.buttonText}</span>
                </button>
              </div>
              
            </div>
            
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
