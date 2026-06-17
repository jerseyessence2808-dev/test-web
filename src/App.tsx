/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingBag, Search, Sparkles, Star, ChevronRight, Globe, Shield, Send, CreditCard, Layers, SlidersHorizontal, Settings, Info, Heart, ArrowRight, RefreshCw, X, Film, Play, MessageSquare, Trash2
} from 'lucide-react';

import { Product, Order, CartItem, AdConfig, Review } from './types';
import { INITIAL_PRODUCTS, INITIAL_AD_CONFIG, BRAND_COLORS } from './data';
import { JerseySvg } from './components/JerseySvg';
import { AdPopup } from './components/AdPopup';
import { CartDrawer } from './components/CartDrawer';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { AdminPanel } from './components/AdminPanel';
import { CheckoutPage } from './components/CheckoutPage';
import { translations } from './translations';

export default function App() {
  // Sync core databases to LocalStorage
  const [products, setProducts] = useState<Product[]>(() => {
    const local = localStorage.getItem('je_products');
    return local ? JSON.parse(local) : INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const local = localStorage.getItem('je_orders');
    return local ? JSON.parse(local) : [];
  });

  const [adConfig, setAdConfig] = useState<AdConfig>(() => {
    const local = localStorage.getItem('je_ad_config');
    return local ? JSON.parse(local) : INITIAL_AD_CONFIG;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const local = localStorage.getItem('je_cart');
    return local ? JSON.parse(local) : [];
  });

  // Language Preferences setup
  const [lang, setLang] = useState<'bn' | 'en'>(() => {
    const saved = localStorage.getItem('je_lang') as 'bn' | 'en';
    return saved || 'bn';
  });

  const [showLangSelector, setShowLangSelector] = useState(() => {
    return localStorage.getItem('je_lang_set') !== 'true';
  });

  // Brand customized logo
  const [customLogo, setCustomLogo] = useState<string>(() => {
    return localStorage.getItem('je_custom_logo') || '';
  });

  // UI Flow States
  const [isIntroLoading, setIsIntroLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<'S' | 'M' | 'L' | 'XL' | 'XXL'>('M');
  const [qtyToAdd, setQtyToAdd] = useState(1);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdOpen, setIsAdOpen] = useState(false);
  const [issuedOrder, setIssuedOrder] = useState<Order | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [likedProducts, setLikedProducts] = useState<Record<string, boolean>>({});

  // Navigation router to Checkout Page
  const [showCheckout, setShowCheckout] = useState(false);

  // Gallery view controls for details
  const [activeMediaIndex, setActiveMediaIndex] = useState<number | 'vector'>('vector');

  // Customer Review forms
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [reviewSuccessMessage, setReviewSuccessMessage] = useState(false);

  // Push updates to localStorage whenever state undergoes transformation
  useEffect(() => {
    localStorage.setItem('je_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('je_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('je_ad_config', JSON.stringify(adConfig));
  }, [adConfig]);

  useEffect(() => {
    localStorage.setItem('je_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('je_lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('je_custom_logo', customLogo);
  }, [customLogo]);

  // Loading Screen Timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsIntroLoading(false);
      // Trigger Advertisement Pop-up 2.2 seconds after intro loader finishes!
      if (localStorage.getItem('je_lang_set') === 'true') {
        setTimeout(() => {
          setIsAdOpen(adConfig.isEnabled);
        }, 1800);
      }
    }, 2800); // Cinematic fast transition loader
    return () => clearTimeout(timer);
  }, []);

  // Multi-language strings
  const str = translations[lang];

  // Handle Cart updates
  const handleAddToCart = (product: Product, size: 'S' | 'M' | 'L' | 'XL' | 'XXL', quantity: number) => {
    const itemId = `${product.id}-${size}`;
    const existingIndex = cart.findIndex(item => item.id === itemId);

    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += quantity;
      setCart(updated);
    } else {
      setCart([...cart, { id: itemId, product, chosenSize: size, quantity }]);
    }

    setQtyToAdd(1);
    setSelectedProduct(null);
    setIsCartOpen(true);
  };

  // Direct fast checkout "Buy Now" handler
  const handleBuyNow = (product: Product, size: 'S' | 'M' | 'L' | 'XL' | 'XXL', quantity: number) => {
    const itemId = `${product.id}-${size}`;
    const existingIndex = cart.findIndex(item => item.id === itemId);

    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += quantity;
      setCart(updated);
    } else {
      setCart([...cart, { id: itemId, product, chosenSize: size, quantity }]);
    }

    setQtyToAdd(1);
    setSelectedProduct(null);
    setShowCheckout(true); // Open the full screen checkout immediately!
  };

  const handleUpdateCartQty = (itemId: string, newQty: number) => {
    const updated = cart.map(item => item.id === itemId ? { ...item, quantity: newQty } : item);
    setCart(updated);
  };

  const handleRemoveCartItem = (itemId: string) => {
    const filtered = cart.filter(item => item.id !== itemId);
    setCart(filtered);
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Order submission
  const handlePlaceOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'orderDate'>) => {
    const dateStr = new Date().toLocaleString('bn-BD', { timeZone: 'Asia/Dhaka' });
    const orderNumber = `JE-${Date.now().toString().slice(-6)}`;
    const id = `order-${Date.now()}`;
    
    const finalizedOrder: Order = {
      ...orderData,
      id,
      orderNumber,
      orderDate: dateStr
    };

    const updatedOrders = [finalizedOrder, ...orders];
    setOrders(updatedOrders);
    setCart([]); // Clear cart
    setShowCheckout(false); // Return from checkout page
    
    // Open the Order Success loader & confirmation Modal
    setIssuedOrder(finalizedOrder);
  };

  // Toggle favorite
  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedProducts(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Dynamic products filtering
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Open product from ad popup click redirection
  const handleSelectProductFromAd = (productId: string) => {
    const targetProd = products.find(p => p.id === productId);
    if (targetProd) {
      setSelectedProduct(targetProd);
      setIsAdOpen(false);
      setActiveMediaIndex('vector');
    }
  };

  const handleLangSelect = (selectedLang: 'bn' | 'en') => {
    setLang(selectedLang);
    localStorage.setItem('je_lang_set', 'true');
    setShowLangSelector(false);
    setTimeout(() => {
      setIsAdOpen(adConfig.isEnabled);
    }, 1200);
  };

  // Submit dynamic client reviews
  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    if (!newReviewName.trim() || !newReviewComment.trim()) return;

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      customerName: newReviewName,
      rating: newReviewRating,
      comment: newReviewComment,
      date: new Date().toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US')
    };

    const currentReviews = selectedProduct.reviews || [];
    const updatedReviews = [newReview, ...currentReviews];
    const totalReviewsCount = updatedReviews.length;
    
    // Recalculating the rating mean average
    const totalScore = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
    const newRatingAverage = parseFloat((totalScore / totalReviewsCount).toFixed(1));

    const updatedProducts = products.map(p => {
      if (p.id === selectedProduct.id) {
        return {
          ...p,
          reviews: updatedReviews,
          reviewsCount: totalReviewsCount,
          rating: newRatingAverage
        };
      }
      return p;
    });

    setProducts(updatedProducts);
    
    // Update active modal selected product context also
    setSelectedProduct({
      ...selectedProduct,
      reviews: updatedReviews,
      reviewsCount: totalReviewsCount,
      rating: newRatingAverage
    });

    // Reset reviewer states
    setNewReviewName('');
    setNewReviewRating(5);
    setNewReviewComment('');
    setReviewSuccessMessage(true);
    setTimeout(() => {
      setReviewSuccessMessage(false);
    }, 4500);
  };

  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#050505] text-stone-205 font-sans relative selection:bg-gold/30 select-none border-[12px] border-[#131313]">
      {/* Decorative inner watermark border line */}
      <div className="absolute inset-0 pointer-events-none border border-gold/10 m-4 z-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.95)]" />
      
      {/* ================= INTRO LOADER SECTION ================= */}
      <AnimatePresence>
        {isIntroLoading && (
          <motion.div
            key="cinematic-intro-loader"
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1, ease: 'easeInOut' }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050505]"
          >
            {/* Cinematic stripes glowing elements */}
            <div className="absolute top-0 left-0 right-0 h-2 flex">
              <div className="flex-1" style={{ backgroundColor: BRAND_COLORS.teal }} />
              <div className="flex-1" style={{ backgroundColor: BRAND_COLORS.coral }} />
              <div className="flex-1" style={{ backgroundColor: BRAND_COLORS.orange }} />
              <div className="flex-1" style={{ backgroundColor: BRAND_COLORS.yellow }} />
            </div>

            {/* Glowing Backdrop Mesh with Gold Halo */}
            <div className="absolute w-[400px] h-[400px] rounded-full filter blur-[120px] opacity-25 bg-gradient-to-tr from-gold to-[#1a1409]" />

            {/* Animation sequence for brand logo */}
            <div className="text-center space-y-6 z-10 px-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex flex-col items-center gap-4"
              >
                {customLogo ? (
                  <div className="h-24 w-24 bg-gradient-to-br from-gold to-[#8A6D3B] p-1.5 rounded-full flex items-center justify-center overflow-hidden shadow-lg shadow-gold/20">
                    <img src={customLogo} alt="Corporate logo" className="h-full w-full object-contain" />
                  </div>
                ) : (
                  <div className="font-serif text-5xl md:text-6xl text-gold tracking-widest font-extrabold italic">
                    Jersey Essence
                  </div>
                )}
                
                {/* Retro stripe decor */}
                <div className="flex flex-col gap-1 w-40 h-2.5">
                  <div className="h-0.5 w-full" style={{ backgroundColor: BRAND_COLORS.teal }} />
                  <div className="h-0.5 w-full" style={{ backgroundColor: BRAND_COLORS.coral }} />
                  <div className="h-0.5 w-full" style={{ backgroundColor: BRAND_COLORS.orange }} />
                  <div className="h-0.5 w-full" style={{ backgroundColor: BRAND_COLORS.yellow }} />
                </div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ delay: 0.8 }}
                className="text-stone-400 font-mono text-[10px] uppercase tracking-[0.25em]"
              >
                Luxury Sporting Outlets Bangladesh
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= ENTRY LANGUAGE SELECTOR MODAL GATE ================= */}
      <AnimatePresence>
        {!isIntroLoading && showLangSelector && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="max-w-md w-full bg-[#0a0a0a] border border-gold/20 rounded-2xl p-6 md:p-8 space-y-6 text-center relative"
            >
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-gold to-[#141414] rounded-t-2xl" />

              <div className="space-y-2">
                <Globe className="h-10 w-10 text-gold mx-auto animate-spin" style={{ animationDuration: '4s' }} />
                <h3 className="text-lg font-serif font-extrabold text-white uppercase tracking-wider">Choose Your Language</h3>
                <p className="text-xs text-stone-400">ভাষা নির্বাচন করুন: আপনার সুনির্দিষ্ট কেনাকাটার অভিজ্ঞতার জন্য</p>
              </div>

              {/* Languages choice buttons layout */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <button
                  onClick={() => handleLangSelect('bn')}
                  className="flex flex-col items-center gap-2 p-5 rounded-xl border border-gold/15 hover:border-gold hover:bg-gold/5 transition-all text-stone-200 cursor-pointer text-center group"
                >
                  <span className="font-bold text-[#F1B13B] text-xl group-hover:scale-105 transition-transform">বাংলা</span>
                  <span className="text-[10px] text-stone-500 font-mono uppercase">Bengali Engine</span>
                </button>

                <button
                  onClick={() => handleLangSelect('en')}
                  className="flex flex-col items-center gap-2 p-5 rounded-xl border border-gold/15 hover:border-gold hover:bg-gold/5 transition-all text-stone-200 cursor-pointer text-center group"
                >
                  <span className="font-bold text-[#F1B13B] text-xl group-hover:scale-105 transition-transform">English</span>
                  <span className="text-[10px] text-stone-500 font-mono uppercase">English Engine</span>
                </button>
              </div>

              <div className="text-[10px] font-mono text-stone-600 uppercase tracking-widest pt-2">
                Jersey Essence Verification Gate
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      
      {/* ================= FULL PAGE ROUTER DESIGN ================= */}
      {showCheckout ? (
        <CheckoutPage
          cartItems={cart}
          lang={lang}
          onClose={() => setShowCheckout(false)}
          onUpdateQty={handleUpdateCartQty}
          onRemoveItem={handleRemoveCartItem}
          onClearCart={handleClearCart}
          onPlaceOrder={handlePlaceOrder}
        />
      ) : showAdmin ? (
        <AdminPanel
          products={products}
          orders={orders}
          adConfig={adConfig}
          customLogo={customLogo}
          onUpdateProducts={setProducts}
          onUpdateOrders={setOrders}
          onUpdateAdConfig={setAdConfig}
          onUpdateCustomLogo={setCustomLogo}
          onClose={() => setShowAdmin(false)}
        />
      ) : (
        <div className="min-h-screen flex flex-col justify-between relative z-10">
          
          {/* Header Navigation Tab */}
          <nav className="border-b border-gold/20 bg-[#050505]/95 backdrop-blur-md sticky top-0 z-30">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
              
              {/* Logo / Brand */}
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gradient-to-br from-gold to-[#8A6D3B] p-0.5 rounded-full flex items-center justify-center overflow-hidden shadow-lg shadow-gold/20">
                  {customLogo ? (
                    <img src={customLogo} className="h-full w-full object-contain" alt="Jersey Essence Corporate Logo" />
                  ) : (
                    <span className="font-serif font-black text-black text-sm italic">JE</span>
                  )}
                </div>
                <div>
                  <h1 className="font-serif text-lg md:text-xl font-bold text-white tracking-wide leading-none uppercase flex items-center gap-1.5">
                    Jersey <span className="text-gold">Essence</span>
                  </h1>
                  <span className="text-[9px] text-[#A67C1E] font-mono tracking-widest uppercase">Premium retro store</span>
                </div>
              </div>

              {/* Center Language switcher widget inside navbar */}
              <div className="bg-black border border-gold/20 rounded-lg p-0.5 flex">
                <button
                  type="button"
                  onClick={() => setLang('bn')}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded transiton-all cursor-pointer ${lang === 'bn' ? 'bg-[#9C7A1D] text-black font-extrabold shadow' : 'text-stone-400 hover:text-white'}`}
                >
                  বাংলা
                </button>
                <button
                  type="button"
                  onClick={() => setLang('en')}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded transiton-all cursor-pointer ${lang === 'en' ? 'bg-[#9C7A1D] text-black font-extrabold shadow' : 'text-stone-400 hover:text-white'}`}
                >
                  EN
                </button>
              </div>

              {/* Right shopping drawer actions */}
              <div className="flex items-center gap-3">
                {/* Shopping bag floating trigger */}
                <button
                  onClick={() => setIsCartOpen(true)}
                  id="cart-drawer-trigger"
                  className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-gold to-gold-dark text-black hover:scale-105 transition-all shadow-lg shadow-gold/20 cursor-pointer"
                >
                  <ShoppingBag className="h-4.5 w-4.5 stroke-[2.5]" />
                  {totalCartItems > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-white text-black text-[9px] font-black h-5 w-5 rounded-full flex items-center justify-center shadow-md border border-[#F1B13B]">
                      {totalCartItems}
                    </span>
                  )}
                </button>
              </div>

            </div>
          </nav>


          {/* Core Body Container */}
          <main className="flex-grow max-w-7xl mx-auto w-full px-4 md:px-6 py-8 space-y-12">
            
            {/* HERO BANNER SHOWCASE */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0c0c0c] to-[#040404] border border-gold/15 p-8 md:p-12 shadow-xl flex flex-col md:flex-row items-center gap-8 md:justify-between group">
              
              <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 rounded-full filter blur-[100px] opacity-25 bg-gold" />
              <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full filter blur-[80px] opacity-15 bg-gold-dark" />

              <div className="space-y-4 max-w-xl z-10 text-center md:text-left transition-all">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold/10 border border-gold/30 text-gold text-xs font-bold rounded-full uppercase tracking-wider">
                  <Sparkles className="h-3.5 w-3.5" />
                  100% PREMIUM BANGLADESH QUALITY
                </span>

                <h2 className="text-2xl md:text-3.5xl lg:text-4.5xl font-serif font-extrabold text-[#F4EFEB] leading-tight">
                  {str.welcomeTagline}
                </h2>

                <p className="text-stone-300 text-xs md:text-sm leading-relaxed font-light">
                  {str.welcomeDesc}
                </p>

                {/* Decorative horizontal stripes */}
                <div className="flex gap-1 h-1.5 w-36 pt-2 mx-auto md:mx-0">
                  <div className="h-full flex-1" style={{ backgroundColor: BRAND_COLORS.teal }} />
                  <div className="h-full flex-1" style={{ backgroundColor: BRAND_COLORS.coral }} />
                  <div className="h-full flex-1" style={{ backgroundColor: BRAND_COLORS.orange }} />
                  <div className="h-full flex-1" style={{ backgroundColor: BRAND_COLORS.yellow }} />
                </div>
              </div>

              {/* Interactive flagship mockup display */}
              <div className="w-52 h-60 md:w-60 md:h-72 bg-black/40 p-5 rounded-2xl border border-gold/15 relative flex items-center justify-center shrink-0 z-10 shadow-inner group-hover:scale-[1.02] transition-transform duration-500">
                <JerseySvg
                  baseColor="#121213"
                  accentColor={BRAND_COLORS.yellow}
                  stripeColors={[BRAND_COLORS.yellow, BRAND_COLORS.orange, BRAND_COLORS.cream]}
                  patternType="vintage-stripes"
                />
              </div>
            </section>


            {/* SEPARATE BAR TO SEARCH AND FILTER CATEGORIES */}
            <section className="space-y-6">
              
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-[#0a0a0a] p-4 rounded-xl border border-gold/10 shadow-md">
                
                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={str.searchPlaceholder}
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-[#050505] border border-gold/25 text-stone-200 text-xs focus:border-gold focus:outline-none placeholder-stone-500 font-light"
                  />
                  <Search className="absolute top-3.5 left-3 h-3.5 w-3.5 text-gold" />
                </div>

                {/* Category filters */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                  <SlidersHorizontal className="h-4.5 w-4.5 text-stone-400 shrink-0 mr-1 hidden md:block" />
                  
                  {(['All', 'Retro Classic', 'Club Special', 'National Team', 'Special Edition'] as const).map((cat) => {
                    // Translate category label
                    let label = cat === 'All' ? str.categories.all :
                                cat === 'Retro Classic' ? str.categories.retroClassic :
                                cat === 'Club Special' ? str.categories.clubSpecial :
                                cat === 'National Team' ? str.categories.nationalTeam :
                                str.categories.specialEdition;
                    return (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`text-xs px-3.5 py-2.5 rounded-lg font-semibold transition-all shrink-0 cursor-pointer ${
                          selectedCategory === cat
                            ? 'bg-gradient-to-r from-gold to-gold-dark text-black shadow-md shadow-gold/20'
                            : 'bg-[#151515] text-stone-400 hover:text-stone-200 border border-white/5 hover:border-gold/30'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>


              {/* PRODUCTS LISTING GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 pt-2">
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    layoutId={`p-card-${product.id}`}
                    onClick={() => {
                      setSelectedProduct(product);
                      setSelectedSize('M');
                      setActiveMediaIndex('vector'); // Reset slider on open
                    }}
                    className="group bg-[#0d0d0d] border border-white/5 hover:border-gold/30 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-lg relative cursor-pointer"
                  >
                    
                    {/* Retro stripe subtle ribbon side badge */}
                    <div className="absolute top-0 left-0 bottom-0 w-1 flex flex-col">
                      <div className="flex-1" style={{ backgroundColor: BRAND_COLORS.teal }} />
                      <div className="flex-1" style={{ backgroundColor: BRAND_COLORS.coral }} />
                      <div className="flex-1" style={{ backgroundColor: BRAND_COLORS.orange }} />
                      <div className="flex-1" style={{ backgroundColor: BRAND_COLORS.yellow }} />
                    </div>

                    {/* Image Area with Svg or uploaded image */}
                    <div className="p-6 h-64 bg-black/35 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute w-32 h-32 rounded-full blur-2xl opacity-10 bg-gold group-hover:opacity-25 transition-opacity" />
                      
                      <div className="w-40 h-48 transform group-hover:scale-[1.05] transition-transform duration-500 flex items-center justify-center">
                        {product.images && product.images[0] ? (
                          <img src={product.images[0]} alt={product.name} className="h-full w-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.65)]" />
                        ) : (
                          <JerseySvg
                            baseColor={product.baseColor}
                            accentColor={product.accentColor}
                            stripeColors={product.stripeColors}
                            patternType={product.patternType}
                            showShadow={true}
                          />
                        )}
                      </div>

                      {/* Floating actions */}
                      <button
                        onClick={(e) => toggleLike(product.id, e)}
                        className={`absolute top-4 right-4 h-9 w-9 flex items-center justify-center rounded-full bg-black/35 backdrop-blur-sm border ${likedProducts[product.id] ? 'text-gold border-gold/40' : 'text-stone-400 border-white/5'} hover:scale-105 transition-all cursor-pointer`}
                      >
                        <Heart className="h-4 w-4" fill={likedProducts[product.id] ? "currentColor" : "none"} />
                      </button>

                      {product.originalPrice && (
                        <span className="absolute bottom-4 left-5 text-[10px] font-black bg-gold text-black px-2 py-0.5 rounded tracking-wide font-mono uppercase">
                          SAVE ৳{product.originalPrice - product.price}!
                        </span>
                      )}
                    </div>

                    {/* Metadata Detail Area */}
                    <div className="p-5 space-y-4">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37]">
                            {product.category === 'Retro Classic' ? str.categories.retroClassic :
                             product.category === 'Club Special' ? str.categories.clubSpecial :
                             product.category === 'National Team' ? str.categories.nationalTeam :
                             str.categories.specialEdition}
                          </span>
                          
                          <div className="flex items-center gap-1 text-[#D4AF37] text-xs font-bold">
                            <Star className="h-3.5 w-3.5 fill-current" />
                            <span>{product.rating}</span>
                          </div>
                        </div>

                        <h3 className="font-serif font-bold text-stone-100 text-sm group-hover:text-gold transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                      </div>

                      <p className="text-stone-400 text-xs font-light line-clamp-2 leading-relaxed h-8">
                        {product.description}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-white/5">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-lg font-bold font-mono text-gold">৳{product.price}</span>
                          {product.originalPrice && (
                            <span className="text-xs line-through text-stone-500 font-mono">৳{product.originalPrice}</span>
                          )}
                        </div>

                        <button
                          type="button"
                          className="flex items-center gap-1 px-3.5 py-1.5 bg-gold/10 hover:bg-gold text-gold hover:text-black border border-gold/30 hover:border-transparent text-xs font-semibold rounded-lg transition-all"
                        >
                          <span>{lang === 'bn' ? 'বিস্তারিত দেখুন' : 'Explore Outfits'}</span>
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                  </motion.div>
                ))}

                {filteredProducts.length === 0 && (
                  <div className="col-span-full py-16 text-center text-stone-500 bg-black/40 rounded-xl border border-dashed border-gold/20 text-xs">
                    {lang === 'bn' ? 'আপনার খোঁজা জার্সিটি পাওয়া যায়নি। অন্য কিছু লিখে অনুসন্ধান বা ব্রাউজ করুন।' : 'No outfits found matching your keywords, verify parameters.'}
                  </div>
                )}
              </div>
            </section>


            {/* BRAND VALUE HIGHLIGHTS */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
              
              <div className="bg-[#0d0d0d] p-5 rounded-xl border border-gold/10 flex gap-4 text-xs">
                <div className="h-10 w-10 flex items-center justify-center bg-gold/10 text-gold rounded-lg shrink-0 border border-gold/30 animate-pulse">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-200 mb-1">{lang === 'bn' ? 'নিরাপদ অর্থপ্রদান গেটওয়ে' : 'Verified Secure Escrows'}</h4>
                  <p className="text-stone-400 font-light leading-relaxed">{lang === 'bn' ? 'বিকাশ, নগদ বা ক্যাশ অন ডেলিভারিতে ট্রানজেকশন প্রুফ ও স্ক্রিনশট যাচাইকরণ ব্যবস্থা' : 'Accepting bKash, Nagad or Cash on Delivery with direct receipt validation.'}</p>
                </div>
              </div>

              <div className="bg-[#0d0d0d] p-5 rounded-xl border border-gold/10 flex gap-4 text-xs">
                <div className="h-10 w-10 flex items-center justify-center bg-gold/10 text-gold rounded-lg shrink-0 border border-gold/30">
                  <Layers className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-200 mb-1">{lang === 'bn' ? 'রিয়েল ইমেজ ও ভিডিও প্রচার' : 'Full High Definition Previews'}</h4>
                  <p className="text-stone-400 font-light leading-relaxed">{lang === 'bn' ? 'ত্রিমাত্রিক ভেক্টর সিমুলেশন ছাড়াও প্রিমিয়াম রিয়াল ফ্যাব্রিক ছবি ও ভিডিও অ্যালবাম প্রিভিউ' : 'Detailed multi-image layout gallery paired with close Fabric promotional videos.'}</p>
                </div>
              </div>

              <div className="bg-[#0d0d0d] p-5 rounded-xl border border-gold/10 flex gap-4 text-xs">
                <div className="h-10 w-10 flex items-center justify-center bg-gold/10 text-gold rounded-lg shrink-0 border border-gold/30">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-200 mb-1">{lang === 'bn' ? 'হাতে পেয়ে রিভিউ দেওয়ার ব্যবস্থা' : 'Verified Review Ecosystem'}</h4>
                  <p className="text-stone-400 font-light leading-relaxed">{lang === 'bn' ? 'যে কেউ পণ্যের রেটিং দিতে পারবে যা সবার কাছে ১০০% স্বচ্ছতায় প্রদর্শিত থাকবে' : 'Public reviews allowing you to state rating feedback directly after procurement.'}</p>
                </div>
              </div>

            </section>

          </main>


          {/* Dark visual footer detailing hidden Admin entry */}
          <footer className="border-t border-gold/15 bg-black py-8 text-xs text-stone-500 text-center relative">
            <div className="max-w-7xl mx-auto px-4 space-y-4">
              <div className="flex justify-center gap-1 h-1 w-24 mx-auto">
                <div className="flex-1" style={{ backgroundColor: BRAND_COLORS.teal }} />
                <div className="flex-1" style={{ backgroundColor: BRAND_COLORS.coral }} />
                <div className="flex-1" style={{ backgroundColor: BRAND_COLORS.orange }} />
                <div className="flex-1" style={{ backgroundColor: BRAND_COLORS.yellow }} />
              </div>
              
              <div className="flex items-center justify-center flex-wrap gap-x-6 gap-y-2">
                <p>© 2026 Jersey Essence. Luxury Vintage Outlets Bangladesh. All Rights Reserved.</p>
                
                {/* Secure operator gateway, nicely placed in footer to keep the site clean and realistic */}
                <button
                  onClick={() => setShowAdmin(true)}
                  className="font-mono text-[9px] text-stone-750 hover:text-gold tracking-widest uppercase py-1 cursor-pointer"
                >
                  [ {str.adminHubBtn} Gate ]
                </button>
              </div>
            </div>
          </footer>

        </div>
      )}


      {/* ================= PRODUCT DETAIL MODAL ================= */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-40 flex items-center justify-center p-4 overflow-y-auto">
            
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="fixed inset-0 bg-[#000000]/90 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-4xl rounded-2xl border border-gold/30 bg-[#0a0a0a] shadow-2xl shadow-black text-stone-200 z-10 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex h-1.5 w-full sticky top-0 z-10">
                <div className="flex-1" style={{ backgroundColor: BRAND_COLORS.teal }} />
                <div className="flex-1" style={{ backgroundColor: BRAND_COLORS.coral }} />
                <div className="flex-1" style={{ backgroundColor: BRAND_COLORS.orange }} />
                <div className="flex-1" style={{ backgroundColor: BRAND_COLORS.yellow }} />
              </div>

              {/* Close Button */}
              <button
                onClick={() => setSelectedProduct(null)}
                id="close-detail-modal"
                className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 hover:bg-gold hover:text-black text-gold font-bold transition-all cursor-pointer border border-gold/20 z-20"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-12 md:divide-x md:divide-white/5">
                
                {/* Left Side: Real image multi-gallery system */}
                <div className="md:col-span-5 p-6 md:p-8 bg-black/45 flex flex-col justify-start items-center relative gap-6">
                  <div className="absolute w-44 h-44 rounded-full blur-[90px] opacity-20 bg-gradient-to-r from-gold to-[#1d1408] pointer-events-none" />
                  
                  {/* Primary Visual Media box */}
                  <div className="w-52 h-60 z-10 flex items-center justify-center relative bg-black/40 rounded-xl border border-gold/10 p-2 overflow-hidden shadow">
                    
                    {activeMediaIndex === 'vector' ? (
                      <JerseySvg
                        baseColor={selectedProduct.baseColor}
                        accentColor={selectedProduct.accentColor}
                        stripeColors={selectedProduct.stripeColors}
                        patternType={selectedProduct.patternType}
                      />
                    ) : (
                      <img
                        src={(selectedProduct.images || [])[activeMediaIndex]}
                        alt="Product visual"
                        className="h-full w-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)] animate-fadeIn"
                      />
                    )}
                  </div>

                  {/* Carousel Thumbnails selector */}
                  {selectedProduct.images && selectedProduct.images.length > 0 && (
                    <div className="flex gap-2 z-10 justify-center flex-wrap pt-1">
                      {/* VECTOR thumbnail trigger */}
                      <button
                        onClick={() => setActiveMediaIndex('vector')}
                        className={`h-11 w-11 p-1 bg-[#101010] rounded border transition-all cursor-pointer ${activeMediaIndex === 'vector' ? 'border-gold shadow shadow-gold/25 scale-105' : 'border-white/10 hover:border-gold/45'}`}
                        title="3D Design Sim"
                      >
                        <JerseySvg baseColor={selectedProduct.baseColor} accentColor={selectedProduct.accentColor} stripeColors={selectedProduct.stripeColors} patternType={selectedProduct.patternType} showShadow={false} />
                      </button>

                      {/* Real Image thumbnail triggers */}
                      {selectedProduct.images.map((imgUrl, imgIdx) => (
                        <button
                          key={`nav-thumb-${imgIdx}`}
                          type="button"
                          onClick={() => setActiveMediaIndex(imgIdx)}
                          className={`h-11 w-11 bg-black rounded overflow-hidden border transition-all cursor-pointer ${activeMediaIndex === imgIdx ? 'border-gold shadow shadow-gold/25 scale-105' : 'border-white/10 hover:border-gold/45'}`}
                        >
                          <img src={imgUrl} alt="Thumbnail review" className="h-full w-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Embedded high definition verified promotional video */}
                  {selectedProduct.videoUrl && (
                    <div className="w-full z-10 pt-2 border-t border-white/5 space-y-2">
                      <span className="text-[10px] text-gold font-mono font-bold uppercase tracking-wider block text-center">🎥 রিয়াল ফ্যাব্রিক ক্লোজ-আপ ভিডিও (Premium Fabric Preview)</span>
                      <video
                        src={selectedProduct.videoUrl}
                        controls
                        className="w-full h-36 bg-black rounded-lg border border-gold/15 object-cover"
                      />
                    </div>
                  )}

                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#F1B13B] bg-[#F1B13B]/10 px-3 py-1 rounded border border-[#F1B13B]/20">
                    {selectedProduct.category === 'Retro Classic' ? str.categories.retroClassic :
                     selectedProduct.category === 'Club Special' ? str.categories.clubSpecial :
                     selectedProduct.category === 'National Team' ? str.categories.nationalTeam :
                     str.categories.specialEdition}
                  </span>
                </div>

                {/* Right Side: Options, Add, and Reviews */}
                <div className="md:col-span-7 p-6 md:p-8 space-y-6 flex flex-col justify-between bg-[#0a0a0a]">
                  
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase font-mono text-stone-500 tracking-wider">Premium Retro Apparel</span>
                      <div className="flex items-center gap-1.5 text-gold font-mono text-xs font-bold bg-gold/10 px-2.5 py-0.5 rounded border border-gold/20 animate-pulse">
                        <Star className="h-3.5 w-3.5 fill-current" />
                        <span>{selectedProduct.rating} / 5 ({selectedProduct.reviewsCount} {lang === 'bn' ? 'টি কাস্টমার রিভিউ' : 'reviews'})</span>
                      </div>
                    </div>

                    <h3 className="font-serif font-extrabold text-white text-2xl tracking-wide">
                      {selectedProduct.name}
                    </h3>

                    <div className="flex items-baseline gap-2.5">
                      <span className="text-2xl font-bold font-mono text-gold">৳{selectedProduct.price}</span>
                      {selectedProduct.originalPrice && (
                        <span className="text-sm line-through text-stone-500 font-mono">৳{selectedProduct.originalPrice}</span>
                      )}
                    </div>

                    <p className="text-stone-350 text-xs md:text-sm font-light leading-relaxed whitespace-pre-line">
                      {selectedProduct.description}
                    </p>
                  </div>

                  {/* Size and Quantities selectors */}
                  <div className="space-y-4 pt-4 border-t border-white/5">
                    
                    {/* Size Selector */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-semibold text-stone-400">{str.sizeSelectorLabel}</span>
                        <span className="text-[10px] text-stone-500">{str.sizeGuide}</span>
                      </div>
                      
                      <div className="flex gap-2">
                        {(['S', 'M', 'L', 'XL', 'XXL'] as const).map((sz) => (
                          <button
                            key={sz}
                            onClick={() => setSelectedSize(sz)}
                            className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                              selectedSize === sz
                                ? 'bg-gradient-to-r from-gold to-gold-dark text-black border-gold shadow-md'
                                : 'bg-black/40 border-white/5 text-stone-400 hover:text-stone-200 hover:border-gold/30'
                            }`}
                          >
                            {sz}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Quantity selectors & Action to Add / Buy now */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        
                        {/* Quantity Stepper */}
                        <div className="flex items-center border border-white/10 rounded-lg overflow-hidden bg-black/40 h-11">
                          <button
                            onClick={() => qtyToAdd > 1 && setQtyToAdd(qtyToAdd - 1)}
                            className="px-3 text-stone-200 hover:bg-white/5 text-sm transition-all"
                          >
                            -
                          </button>
                          <span className="px-3 font-mono text-xs text-gold font-bold">{qtyToAdd}</span>
                          <button
                            onClick={() => setQtyToAdd(qtyToAdd + 1)}
                            className="px-3 text-stone-200 hover:bg-white/5 text-sm transition-all"
                          >
                            +
                          </button>
                        </div>

                        {/* Add to Bag trigger */}
                        <button
                          onClick={() => handleAddToCart(selectedProduct, selectedSize, qtyToAdd)}
                          id="add-jersey-action"
                          className="flex-1 flex items-center justify-center gap-1.5 h-11 bg-transparent hover:bg-white/5 border border-gold/30 text-gold font-serif font-black tracking-wider rounded-lg transition-all cursor-pointer text-xs uppercase"
                        >
                          <ShoppingBag className="h-4 w-4" />
                          <span>{str.addToBagBtn} • ৳{selectedProduct.price * qtyToAdd}</span>
                        </button>
                      </div>

                      {/* HIGH PRIORITY BUTTON SPEC: BUY NOW - REDIRECT TO CheckoutPage */}
                      <button
                        onClick={() => handleBuyNow(selectedProduct, selectedSize, qtyToAdd)}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-gold to-gold-dark text-black hover:scale-[1.01] active:scale-[0.99] font-serif font-black tracking-wider rounded-lg transition-all cursor-pointer text-xs shadow-lg shadow-gold/20"
                      >
                        <CreditCard className="h-4.5 w-4.5 stroke-[2.5]" />
                        <span>{str.buyNowBtn} (ডেলিভারি গেইটে যান)</span>
                      </button>
                    </div>

                    <div className="flex justify-center items-center gap-1.5 text-[10px] text-stone-500 pt-1">
                      <Shield className="h-3.5 w-3.5 text-stone-600" />
                      <span>{str.returnGuarantee}</span>
                    </div>

                  </div>

                  {/* ================= VERIFIED REVIEW SYSTEM (HIGH PRIORITY OUTCOME) ================= */}
                  <div className="pt-6 border-t border-white/5 space-y-4">
                    <h4 className="text-xs uppercase tracking-wider font-mono font-black text-gold flex items-center gap-1.5">
                      <MessageSquare className="h-4 w-4 shrink-0" />
                      <span>{str.reviewsHeader} ({selectedProduct.reviewsCount})</span>
                    </h4>

                    {/* Display Alerts */}
                    {reviewSuccessMessage && (
                      <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] p-3 rounded-lg leading-relaxed animate-fadeIn">
                        {str.reviewSuccessAlert}
                      </div>
                    )}

                    {/* Write customized reviews section */}
                    <form onSubmit={handleAddReview} className="bg-black/60 p-4 border border-gold/15 rounded-xl space-y-3.5 text-xs">
                      <span className="font-serif font-bold text-stone-200 block">{str.writeReviewTitle}</span>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <input
                            type="text"
                            required
                            placeholder={lang === 'bn' ? 'আপনার নাম লিখুন' : 'Enter your name'}
                            value={newReviewName}
                            onChange={(e) => setNewReviewName(e.target.value)}
                            className="w-full px-3 py-2 rounded bg-stone-900 border border-white/5 text-stone-300 focus:outline-none text-xs"
                          />
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-stone-550">{str.yourRatingLabel}</span>
                          <div className="flex gap-1 text-[#F1B13B]">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={`star-input-${star}`}
                                type="button"
                                onClick={() => setNewReviewRating(star)}
                                className="hover:scale-110 transition-transform cursor-pointer"
                              >
                                <Star className={`h-3.5 w-3.5 ${newReviewRating >= star ? 'fill-current' : 'text-stone-700'}`} />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <textarea
                          rows={2}
                          required
                          placeholder={str.yourReviewPlaceholder}
                          value={newReviewComment}
                          onChange={(e) => setNewReviewComment(e.target.value)}
                          className="w-full px-3 py-2 rounded bg-stone-900 border border-white/5 text-stone-350 focus:outline-none text-xs leading-relaxed"
                        />
                      </div>

                      <button
                        type="submit"
                        className="py-1.5 px-4 bg-gold/15 hover:bg-gold hover:text-black border border-gold/35 hover:border-transparent text-gold font-bold text-[10px] rounded transition-all cursor-pointer uppercase font-mono tracking-wider"
                      >
                        {str.submitReviewBtn}
                      </button>
                    </form>

                    {/* View existing customer reviews */}
                    <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                      {(!selectedProduct.reviews || selectedProduct.reviews.length === 0) ? (
                        <p className="text-[11px] text-stone-500 italic text-center py-4 bg-stone-950/40 rounded border border-white/5">
                          {str.noReviewsYet}
                        </p>
                      ) : (
                        selectedProduct.reviews.map((rev) => (
                          <div key={rev.id} className="bg-black p-3.5 rounded-lg border border-white/5 space-y-1.5 text-xs animate-fadeIn">
                            <div className="flex justify-between items-center bg-stone-950/70 p-1 px-2.5 rounded text-[10.5px]">
                              <span className="font-bold text-stone-200">{rev.customerName}</span>
                              <span className="text-[10px] text-stone-500 font-mono">{rev.date}</span>
                            </div>
                            <div className="flex gap-0.5 text-gold pt-0.5">
                              {Array.from({ length: 5 }).map((_, idx) => (
                                <Star key={`star-rev-${rev.id}-${idx}`} className={`h-3 w-3 ${rev.rating > idx ? 'fill-current' : 'text-stone-850'}`} />
                              ))}
                            </div>
                            <p className="text-stone-400 font-light leading-relaxed text-[11px] font-sans">"{rev.comment}"</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* ================= ADVERTISING POPUP WINDOW ================= */}
      {isAdOpen && adConfig.isEnabled && (
        <AdPopup
          config={adConfig}
          product={products.find(p => p.id === adConfig.targetProductId)}
          onClose={() => setIsAdOpen(false)}
          onSelectProduct={handleSelectProductFromAd}
        />
      )}


      {/* ================= SECURE CART SYSTEM DRAWER ================= */}
      <CartDrawer
        isOpen={isCartOpen}
        cartItems={cart}
        lang={lang}
        onClose={() => setIsCartOpen(false)}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onCheckout={() => {
          setIsCartOpen(false);
          setShowCheckout(true); // Switch to checkout page router!
        }}
      />


      {/* ================= ORDER SUCCESS CINEMATIC RECEIPT ================= */}
      {issuedOrder && (
        <OrderSuccessModal
          order={issuedOrder}
          onClose={() => setIssuedOrder(null)}
        />
      )}

    </div>
  );
}
