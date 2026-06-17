/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Package, ShoppingBag, Radio, Plus, Trash2, Edit, Save, X, Eye, Check, Truck, Ban, RefreshCw, Upload, Sparkles, Image as ImageIcon, Key, Lock, Settings2, Star, Film, Sliders
} from 'lucide-react';
import { Product, Order, AdConfig, Review } from '../types';
import { BRAND_COLORS } from '../data';
import { JerseySvg } from './JerseySvg';

interface AdminPanelProps {
  products: Product[];
  orders: Order[];
  adConfig: AdConfig;
  customLogo: string;
  onUpdateProducts: (products: Product[]) => void;
  onUpdateOrders: (orders: Order[]) => void;
  onUpdateAdConfig: (config: AdConfig) => void;
  onUpdateCustomLogo: (logo: string) => void;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  products,
  orders,
  adConfig,
  customLogo,
  onUpdateProducts,
  onUpdateOrders,
  onUpdateAdConfig,
  onUpdateCustomLogo,
  onClose
}) => {
  // Safe authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState(false);

  // Active controls
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'ad-config' | 'store-settings'>('orders');
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);

  // States for product editing / creation
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  
  // Local error text for operations
  const [opError, setOpError] = useState<string | null>(null);

  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    price: 1200,
    originalPrice: 1500,
    description: '',
    category: 'Retro Classic',
    stripeColors: [BRAND_COLORS.teal, BRAND_COLORS.coral, BRAND_COLORS.orange, BRAND_COLORS.yellow],
    baseColor: BRAND_COLORS.maroon,
    accentColor: BRAND_COLORS.cream,
    patternType: 'vintage-stripes',
    rating: 4.8,
    reviewsCount: 1,
    images: [],
    videoUrl: '',
    reviews: []
  });

  const [editedAd, setEditedAd] = useState<AdConfig>({ ...adConfig });

  // References
  const logoInputRef = useRef<HTMLInputElement>(null);
  const prodImg1Ref = useRef<HTMLInputElement>(null);
  const prodImg2Ref = useRef<HTMLInputElement>(null);
  const prodImg3Ref = useRef<HTMLInputElement>(null);
  const prodVideoRef = useRef<HTMLInputElement>(null);

  // Verify Operator Passcode
  const handleVerifyPass = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'JE2026') {
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
      setPasswordInput('');
    }
  };

  // Update Status
  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    const updated = orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
    onUpdateOrders(updated);
  };

  // Save/Update Catalog Jersey
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    setOpError(null);

    if (isAddingNew) {
      if (!newProduct.name.trim() || !newProduct.description.trim()) {
        setOpError('জার্সির নাম এবং বিবরণী প্রদান করুন!');
        return;
      }
      const id = `jersey-${Date.now()}`;
      const created: Product = { ...newProduct, id: id as string };
      onUpdateProducts([...products, created]);
      setIsAddingNew(false);
      resetNewProductForm();
    } else if (editingProduct) {
      if (!editingProduct.name.trim() || !editingProduct.description.trim()) {
        setOpError('জার্সির নাম এবং বিবরণী প্রদান করুন!');
        return;
      }
      const updated = products.map(p => p.id === editingProduct.id ? editingProduct : p);
      onUpdateProducts(updated);
      setEditingProduct(null);
    }
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('আপনি কি নিশ্চিত যে আপনি এই জার্সিটি ক্যাটালগ থেকে সম্পূর্ণ ডিলিট করতে চান?')) {
      const filtered = products.filter(p => p.id !== productId);
      onUpdateProducts(filtered);
    }
  };

  const resetNewProductForm = () => {
    setNewProduct({
      name: '',
      price: 1200,
      originalPrice: 1500,
      description: '',
      category: 'Retro Classic',
      stripeColors: [BRAND_COLORS.teal, BRAND_COLORS.coral, BRAND_COLORS.orange, BRAND_COLORS.yellow],
      baseColor: BRAND_COLORS.maroon,
      accentColor: BRAND_COLORS.cream,
      patternType: 'vintage-stripes',
      rating: 4.8,
      reviewsCount: 1,
      images: [],
      videoUrl: '',
      reviews: []
    });
  };

  const handleEditClick = (p: Product) => {
    setEditingProduct({
      ...p,
      images: p.images || [],
      videoUrl: p.videoUrl || '',
      reviews: p.reviews || []
    });
    setIsAddingNew(false);
  };

  const handleSaveAdConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateAdConfig(editedAd);
    alert('বিজ্ঞাপন প্যানেলটি সফলভাবে লাইভ ডেটাবেজে আপডেট করা হয়েছে!');
  };

  // Stripe configurations
  const handleUpdateStripeColor = (index: number, value: string) => {
    if (isAddingNew) {
      const updatedColors = [...newProduct.stripeColors];
      updatedColors[index] = value;
      setNewProduct({ ...newProduct, stripeColors: updatedColors });
    } else if (editingProduct) {
      const updatedColors = [...editingProduct.stripeColors];
      updatedColors[index] = value;
      setEditingProduct({ ...editingProduct, stripeColors: updatedColors });
    }
  };

  // Logo uploader
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('লোগোর ফাইল সাইজ ২ মেগাবাইটের বেশি হওয়া যাবে না।');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateCustomLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Product real visual asset uploads
  const handleProdImageUpload = (index: number, file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      alert('ছবির সাইজ ২ মেগাবাইটের বেশি হওয়া যাবে না।');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      if (isAddingNew) {
        const imgs = [...(newProduct.images || [])];
        imgs[index] = base64;
        setNewProduct({ ...newProduct, images: imgs });
      } else if (editingProduct) {
        const imgs = [...(editingProduct.images || [])];
        imgs[index] = base64;
        setEditingProduct({ ...editingProduct, images: imgs });
      }
    };
    reader.readAsDataURL(file);
  };

  // Product video upload with duration checking (Up to 1 minute limit verified)
  const handleProdVideoUpload = (file: File) => {
    // Basic size check to prevent memory issues in string state
    if (file.size > 8 * 1024 * 1024) {
      alert('ভিডিওর সাইজ ৮ মেগাবাইটের বেশি হওয়া যাবে না। অনুগ্রহ করে কম্প্রেসড ভিডিও আপলোড করুন।');
      return;
    }

    const videoEl = document.createElement('video');
    videoEl.preload = 'metadata';
    videoEl.src = URL.createObjectURL(file);
    
    videoEl.onloadedmetadata = () => {
      URL.revokeObjectURL(videoEl.src);
      if (videoEl.duration > 61) {
        alert('ভিডিওর দৈর্ঘ্য ১ মিনিটের বেশি হওয়া যাবে না। অনুগ্রহ করে ছোট ভিডিও ক্লিপ সিলেক্ট করুন।');
        return;
      }

      // Convert to Base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        if (isAddingNew) {
          setNewProduct({ ...newProduct, videoUrl: base64 });
        } else if (editingProduct) {
          setEditingProduct({ ...editingProduct, videoUrl: base64 });
        }
      };
      reader.readAsDataURL(file);
    };
  };

  // PASSWORD PROTECT OVERLAY VIEW
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
        {/* Radial backing */}
        <div className="absolute w-[450px] h-[450px] rounded-full filter blur-[120px] opacity-20 bg-gradient-to-tr from-gold to-[#1d1607] pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-[#0a0a0a] border border-gold/25 rounded-2xl p-6 md:p-8 shadow-2xl relative"
        >
          {/* Top colored stripe decorator */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-gold via-gold-dark to-[#050505] rounded-t-2xl" />

          <div className="text-center space-y-4">
            <div className="h-14 w-14 bg-black/60 border border-gold/20 rounded-full flex items-center justify-center mx-auto text-gold shadow-lg shadow-gold/5">
              <Lock className="h-6 w-6 stroke-[1.8] animate-pulse" />
            </div>
            
            <div className="space-y-1">
              <h3 className="text-lg font-serif font-extrabold text-white uppercase tracking-wider">
                Operator Security Portal
              </h3>
              <p className="text-xs text-stone-400 font-light">
                অ্যাডমিন ড্যাশবোর্ড অ্যাক্সেস করতে অনুগ্রহ করে ভেরিফাইড অপারেটর পিন কোডটি লিখুন
              </p>
            </div>

            <form onSubmit={handleVerifyPass} className="space-y-4 pt-3">
              <div className="relative">
                <input
                  type="password"
                  placeholder="যেমন: JE2026"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setAuthError(false);
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-black border border-gold/25 text-center text-sm font-mono tracking-widest text-white focus:border-gold focus:outline-none placeholder-white/10"
                />
                <Key className="absolute left-3.5 top-3.5 text-gold/50 h-4.5 w-4.5" />
              </div>

              {authError && (
                <p className="text-xs text-rose-500 bg-rose-500/10 border border-rose-500/20 py-1.5 px-3 rounded-lg animate-shake font-medium">
                  পাসকোড সঠিক নয়! পুনরায় চেষ্টা করুন।
                </p>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 bg-[#1b1b1b] border border-white/5 hover:bg-[#252525] text-stone-300 text-xs rounded-xl transition-colors cursor-pointer uppercase font-mono font-bold"
                >
                  স্টোরে ফিরুন
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-gradient-to-r from-gold to-gold-dark text-black text-xs rounded-xl font-serif font-black uppercase tracking-wider transition-all hover:scale-[1.01] cursor-pointer shadow-lg shadow-gold/15"
                >
                  প্রবেশ করুন (Unlock)
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  // CORE AUTHENTICATED ADMIN LAYOUT
  return (
    <div className="min-h-screen bg-[#050505] text-stone-200">
      {/* Upper Navigation Header */}
      <div className="border-b border-gold/20 bg-[#0a0a0a]/95 px-6 py-4 sticky top-0 z-40 backdrop-blur-md shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 flex items-center justify-center bg-gradient-to-tr from-gold to-gold-dark rounded-lg shadow-lg shadow-gold/25">
              <Settings2 className="h-5 w-5 text-black" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-serif font-extrabold text-white tracking-wider uppercase leading-none">
                Jersey Essence — অ্যাডমিন প্যানেল
              </h2>
              <span className="text-[10px] md:text-xs text-stone-400 font-light mt-1 block">
                পণ্য ক্যাটালগ রিমডেলিং, ভিডিও আপলোডার, ব্র্যান্ড লোগো এবং পেমেন্ট ভেরিফিকেশন কন্টেইনার
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gold/30 hover:bg-gold/20 text-gold hover:text-white bg-black transition-all cursor-pointer text-xs"
          >
            <X className="h-4 w-4" />
            <span>অপারেটর ড্যাশবোর্ড বন্ধ করুন</span>
          </button>
        </div>
      </div>

      {/* Main layout container */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* LEFT: Rails Selection */}
          <div className="md:col-span-3 space-y-4">
            <div className="bg-[#0e0e0e] rounded-xl border border-gold/15 p-4 space-y-1.5 shadow-xl">
              <span className="text-[10px] text-stone-500 font-mono tracking-widest uppercase mb-4 block">কন্ট্রোল হাব ক্যাটাগরি</span>

              <button
                onClick={() => { setActiveTab('orders'); setEditingProduct(null); setIsAddingNew(false); }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-xs transition-all cursor-pointer border ${activeTab === 'orders' ? 'bg-gradient-to-r from-gold to-gold-dark text-black border-gold font-black shadow-md shadow-gold/15' : 'text-stone-300 border-transparent hover:bg-gold/5'}`}
              >
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  <span>অর্ডার এবং পেমেন্ট যাচাই</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${activeTab === 'orders' ? 'bg-black text-gold' : 'bg-stone-900 text-stone-400'}`}>
                  {orders.length}
                </span>
              </button>

              <button
                onClick={() => { setActiveTab('products'); setEditingProduct(null); setIsAddingNew(false); }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-xs transition-all cursor-pointer border ${activeTab === 'products' ? 'bg-gradient-to-r from-gold to-gold-dark text-black border-gold font-black shadow-md shadow-gold/15' : 'text-stone-300 border-transparent hover:bg-gold/5'}`}
              >
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  <span>পণ্য ক্যাটালগ ({products.length})</span>
                </div>
              </button>

              <button
                onClick={() => { setActiveTab('ad-config'); setEditingProduct(null); setIsAddingNew(false); }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-xs transition-all cursor-pointer border ${activeTab === 'ad-config' ? 'bg-gradient-to-r from-gold to-gold-dark text-black border-gold font-black shadow-md shadow-gold/15' : 'text-stone-300 border-transparent hover:bg-gold/5'}`}
              >
                <div className="flex items-center gap-2">
                  <Radio className="h-4 w-4 text-gold animate-pulse" />
                  <span>ক্যাম্পেইন বিজ্ঞাপন পপ-আপ</span>
                </div>
              </button>

              <button
                onClick={() => { setActiveTab('store-settings'); setEditingProduct(null); setIsAddingNew(false); }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-xs transition-all cursor-pointer border ${activeTab === 'store-settings' ? 'bg-gradient-to-r from-gold to-gold-dark text-black border-gold font-black shadow-md shadow-gold/15' : 'text-stone-300 border-transparent hover:bg-gold/5'}`}
              >
                <div className="flex items-center gap-2">
                  <Sliders className="h-4 w-4" />
                  <span>দোকানের লোগো কাস্টমাইজার</span>
                </div>
              </button>
            </div>

            {/* Micro analytics widget */}
            <div className="bg-[#080808] rounded-xl border border-gold/10 p-4 font-light text-xs text-stone-400 space-y-2">
              <span className="text-[10px] text-gold uppercase tracking-wider font-mono font-medium block">আর্থিক ক্যাটালগ সামারি</span>
              <div className="grid grid-cols-2 gap-2 text-center pt-1">
                <div className="bg-black/40 border border-white/5 py-1.5 rounded">
                  <span className="block text-[9px] text-stone-500 font-mono">মোট প্রাপ্তি</span>
                  <span className="text-xs font-bold text-white font-mono">৳{orders.filter(o => o.status !== 'Cancelled').reduce((acc, current) => acc + current.totalAmount, 0)}</span>
                </div>
                <div className="bg-black/40 border border-white/5 py-1.5 rounded">
                  <span className="block text-[9px] text-stone-500 font-mono">পেন্ডিং অর্ডার</span>
                  <span className="text-xs font-bold text-gold font-mono">{orders.filter(o => o.status === 'Pending').length} Pnd</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Content panes */}
          <div className="md:col-span-9">
            
            {/* TAB 1: ORDER LOGISTICS */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <h3 className="text-base font-serif font-extrabold text-white tracking-widest uppercase">অর্ডার এবং রশিদের তালিকা ({orders.length})</h3>
                  <span className="text-xs text-stone-500 font-mono">গ্রাহক অর্থপ্রদান ও বকেয়া স্ট্যাটাস ভেরিফায়ার</span>
                </div>

                {orders.length === 0 ? (
                  <div className="bg-[#0b0b0b] rounded-xl border border-dashed border-gold/15 p-16 text-center text-stone-500 hover:border-gold/30 transition-all font-light text-xs">
                    এখন পর্যন্ত কোনো গ্রাহক সফলভাবে অর্ডার প্লেস করেননি।
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="bg-[#0f0f0f] border border-gold/15 hover:border-gold/35 rounded-xl overflow-hidden transition-all shadow-xl">
                        {/* Upper Strip */}
                        <div className="px-5 py-4 bg-black/40 border-b border-gold/15 flex flex-wrap items-center justify-between gap-3 text-xs">
                          <div className="space-y-1">
                            <span className="font-mono text-[10px] font-bold text-gold bg-gold/10 border border-gold/20 px-2 py-0.5 rounded mr-2">
                              {order.orderNumber}
                            </span>
                            <span className="text-stone-550 font-mono">তারিখ: {order.orderDate}</span>
                            <h4 className="text-sm font-bold text-white pt-1">{order.customerName} ({order.phone})</h4>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-stone-400">স্ট্যাটাস পরিবর্তন:</span>
                            <select
                              value={order.status}
                              onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                              className="px-2.5 py-1.5 rounded bg-black text-xs text-gold border border-gold/30 focus:outline-none"
                            >
                              <option value="Pending">পেন্ডিং (Pending)</option>
                              <option value="Confirmed">কনফার্মড (Confirmed)</option>
                              <option value="Shipped">ডেলিভারড (Shipped)</option>
                              <option value="Cancelled">বাতিল (Cancelled)</option>
                            </select>
                          </div>
                        </div>

                        {/* Order info details */}
                        <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
                          <div className="lg:col-span-7 space-y-4">
                            <p className="text-[10px] uppercase font-mono tracking-widest text-[#9c9c9c]">ক্রয় তালিকা (Selected Items)</p>
                            <div className="space-y-2">
                              {order.items.map((item) => (
                                <div key={item.id} className="flex justify-between items-center bg-black/45 p-2 rounded-lg border border-gold/10 text-xs text-stone-300">
                                  <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 bg-stone-900 border border-white/5 rounded p-0.5">
                                      <JerseySvg baseColor={item.product.baseColor} accentColor={item.product.accentColor} stripeColors={item.product.stripeColors} patternType={item.product.patternType} showShadow={false} />
                                    </div>
                                    <div>
                                      <span className="font-bold text-white block">{item.product.name}</span>
                                      <span className="text-[10px] text-stone-500">Chosen Size: <b className="text-gold">{item.chosenSize}</b> | Qty: {item.quantity}</span>
                                    </div>
                                  </div>
                                  <span className="font-mono text-gold font-bold">৳{item.product.price * item.quantity}</span>
                                </div>
                              ))}
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-xs bg-black/20 p-3 rounded-lg border border-white/5">
                              <div>
                                <span className="text-[10px] font-mono text-stone-500 block">পূর্ণ কুরিয়ার ঠিকানা</span>
                                <span className="text-stone-300 block font-light leading-relaxed whitespace-pre-line mt-1">{order.address}, {order.city}</span>
                              </div>
                              <div>
                                <span className="text-[10px] font-mono text-stone-500 block">নির্বাচিত গেটওয়ে</span>
                                <span className="text-stone-200 mt-1 inline-block bg-gold/15 px-2 py-0.5 rounded border border-gold/25 font-bold">{order.paymentMethod}</span>
                              </div>
                            </div>
                          </div>

                          {/* Lightbox / Proof screenshot validations */}
                          <div className="lg:col-span-5 bg-black/45 p-4 rounded-xl border border-gold/10 flex flex-col justify-between text-xs">
                            <div className="space-y-3">
                              <span className="text-[10px] font-mono font-black text-gold uppercase tracking-wider block">মোবাইল ব্যাংকিং পেমেন্ট রশিদ</span>
                              
                              {order.paymentMethod === 'Cash on Delivery' ? (
                                <div className="text-center font-serif text-stone-500 py-6 border border-dashed border-stone-850 rounded bg-stone-950 italic">
                                  ক্যাশ অন ডেলিভারি (COD) পেমেন্ট গেমিফিকেশন। রশিদ নেই।
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  <p className="flex justify-between p-1 rounded bg-black border border-white/5">
                                    <span className="text-stone-450 text-[10px]"> প্রেরক ওয়ালেট:</span>
                                    <span className="font-mono text-stone-200">{order.paymentDetails?.bKashNumberUsed || order.paymentDetails?.nagadNumberUsed || 'N/A'}</span>
                                  </p>
                                  {order.paymentDetails?.transactionId && (
                                    <p className="p-2 rounded bg-black/80 text-xs border border-gold/15">
                                      <span className="text-[9px] text-gold/60 font-mono block">ভেরিফাইড ট্রানজেকশন আইডি:</span>
                                      <span className="font-mono text-sm block font-black text-gold mt-0.5 select-all">{order.paymentDetails.transactionId}</span>
                                    </p>
                                  )}

                                  {order.paymentDetails?.screenshotData ? (
                                    <div className="space-y-1">
                                      <span className="text-[9px] text-stone-500 font-mono">আপলোড করা স্ক্রিনশট প্রুফ (Click to view):</span>
                                      <div
                                        onClick={() => setSelectedScreenshot(order.paymentDetails?.screenshotData || null)}
                                        className="h-20 w-full relative rounded-lg overflow-hidden cursor-zoom-in border border-gold/15 bg-black"
                                      >
                                        <img src={order.paymentDetails.screenshotData} alt="Client Receipt" className="h-full w-full object-cover" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center text-xs text-gold transition-opacity">
                                          <Eye className="h-3 w-3 mr-1" />
                                          <span>জুম ভিউ</span>
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    <span className="text-[9px] block text-stone-500 italic">গ্রাহক কোনো স্ক্রিনশট রিসিভ আপলোড ছাড়াই ট্রানজেকশন টাইপ করেছেন।</span>
                                  )}
                                </div>
                              )}
                            </div>

                            <div className="border-t border-white/5 pt-3 mt-4 flex items-center justify-between font-bold">
                              <span className="text-stone-450">অর্ডার ভ্যালু:</span>
                              <span className="text-[#F1B13B] text-sm font-mono">৳{order.totalAmount}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: JERSEY CATALOG */}
            {activeTab === 'products' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <div>
                    <h3 className="text-base font-serif font-extrabold text-white uppercase tracking-widest">ভিন্টেজ জার্সি ক্যাটালগ</h3>
                    <p className="text-[10px] text-stone-400 font-light mt-0.5">নতুন ডিজাইন এড করুন, রিয়াল ছবি/ভিডিও জুড়ুন ও মূল্য পরিবর্তন করুন</p>
                  </div>

                  {!isAddingNew && !editingProduct && (
                    <button
                      onClick={() => { setIsAddingNew(true); setEditingProduct(null); }}
                      className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-gold to-gold-dark text-black text-xs rounded-lg hover:scale-[1.01] transition-all cursor-pointer font-serif font-black"
                    >
                      <Plus className="h-4 w-4" />
                      <span>নতুন জার্সি ইনসার্ট করুন</span>
                    </button>
                  )}
                </div>

                {/* Error Banner */}
                {opError && (
                  <div className="bg-rose-500/10 border border-rose-500/30 p-3 rounded-lg text-rose-300 text-xs">
                    {opError}
                  </div>
                )}

                {/* FORM: ADD OR EDIT */}
                {(isAddingNew || editingProduct) && (
                  <form onSubmit={handleSaveProduct} className="bg-[#0e0e0e] border border-gold/25 rounded-2xl p-6 space-y-6 animate-fadeIn shadow-2xl">
                    <div className="flex items-center justify-between border-b border-gold/15 pb-3">
                      <h4 className="text-xs uppercase font-mono tracking-widest text-[#F1B13B] font-bold">
                        {isAddingNew ? 'নতুন জার্সি ডিজাইনার ও আপলোডার' : 'জার্সি বিবরণী মডিফাই ও মিডিয়া আপলোডার'}
                      </h4>
                      <button
                        type="button"
                        onClick={() => { setIsAddingNew(false); setEditingProduct(null); setOpError(null); }}
                        className="text-stone-400 hover:text-white"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      <div className="lg:col-span-8 space-y-4">
                        
                        <div>
                          <label className="block text-[10px] font-mono uppercase tracking-widest text-stone-450 mb-1.5">জার্সির পূর্ণ নাম (Name/Title) *</label>
                          <input
                            type="text"
                            required
                            placeholder="যেমন: Retro AC Milan 1996 Knit Fit Jersey"
                            value={isAddingNew ? newProduct.name : editingProduct?.name}
                            onChange={(e) => {
                              if (isAddingNew) setNewProduct({ ...newProduct, name: e.target.value });
                              else if (editingProduct) setEditingProduct({ ...editingProduct, name: e.target.value });
                            }}
                            className="w-full px-3.5 py-2.5 rounded-lg bg-black border border-gold/20 text-stone-200 text-xs focus:border-gold focus:outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="block text-[10px] font-mono uppercase tracking-widest text-stone-450 mb-1.5">ক্যাটাগরি</label>
                            <select
                              value={isAddingNew ? newProduct.category : editingProduct?.category}
                              onChange={(e) => {
                                const val = e.target.value as Product['category'];
                                if (isAddingNew) setNewProduct({ ...newProduct, category: val });
                                else if (editingProduct) setEditingProduct({ ...editingProduct, category: val });
                              }}
                              className="w-full px-2.5 py-2 rounded-lg bg-black border border-gold/20 text-stone-200 text-xs focus:outline-none"
                            >
                              <option value="Retro Classic">Retro Classic</option>
                              <option value="Club Special">Club Special</option>
                              <option value="National Team">National Team</option>
                              <option value="Special Edition">Special Edition</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[10px] font-mono uppercase tracking-widest text-stone-450 mb-1.5">বিক্রয় মূল্য (৳) *</label>
                            <input
                              type="number"
                              required
                              value={isAddingNew ? newProduct.price : editingProduct?.price}
                              onChange={(e) => {
                                const val = parseInt(e.target.value) || 0;
                                if (isAddingNew) setNewProduct({ ...newProduct, price: val });
                                else if (editingProduct) setEditingProduct({ ...editingProduct, price: val });
                              }}
                              className="w-full px-2.5 py-2 rounded-lg bg-black border border-gold/20 text-stone-200 text-xs focus:outline-none font-mono"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-mono uppercase tracking-widest text-stone-450 mb-1.5">আসল মূল্য (৳)</label>
                            <input
                              type="number"
                              value={(isAddingNew ? newProduct.originalPrice : editingProduct?.originalPrice) || ''}
                              onChange={(e) => {
                                const val = e.target.value ? parseInt(e.target.value) : undefined;
                                if (isAddingNew) setNewProduct({ ...newProduct, originalPrice: val });
                                else if (editingProduct) setEditingProduct({ ...editingProduct, originalPrice: val });
                              }}
                              className="w-full px-2.5 py-2 rounded-lg bg-black border border-gold/20 text-stone-200 text-xs focus:outline-none font-mono"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono uppercase tracking-widest text-stone-450 mb-1.5">বিস্তারিত বিবরণী / ফ্যাব্রিকেশন তথ্য *</label>
                          <textarea
                            required
                            rows={3}
                            placeholder="যেমন: ১০০% প্রিমিয়াম ডাবল-নিট কটন ও ক্লাসিক ভিন্টেজ কলার ফিনিশিং..."
                            value={isAddingNew ? newProduct.description : editingProduct?.description}
                            onChange={(e) => {
                              if (isAddingNew) setNewProduct({ ...newProduct, description: e.target.value });
                              else if (editingProduct) setEditingProduct({ ...editingProduct, description: e.target.value });
                            }}
                            className="w-full px-3 py-2 rounded-lg bg-black border border-gold/20 text-stone-200 text-xs focus:outline-none leading-relaxed"
                          />
                        </div>

                        {/* Jersey custom visual simulation attributes */}
                        <div className="bg-black/40 p-4 rounded-xl border border-white/5 space-y-4">
                          <span className="text-[10px] font-mono uppercase font-bold text-gold tracking-wider">সিমুলেশন ডিজাইন কিট</span>
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div>
                              <span className="text-stone-400 block mb-1">জার্সির মূল রং (Base):</span>
                              <input
                                type="color"
                                value={isAddingNew ? newProduct.baseColor : editingProduct?.baseColor}
                                onChange={(e) => {
                                  if (isAddingNew) setNewProduct({ ...newProduct, baseColor: e.target.value });
                                  else if (editingProduct) setEditingProduct({ ...editingProduct, baseColor: e.target.value });
                                }}
                                className="h-8 w-12 bg-transparent cursor-pointer"
                              />
                            </div>
                            <div>
                              <span className="text-stone-400 block mb-1">কলার কালার (Acct):</span>
                              <input
                                type="color"
                                value={isAddingNew ? newProduct.accentColor : editingProduct?.accentColor}
                                onChange={(e) => {
                                  if (isAddingNew) setNewProduct({ ...newProduct, accentColor: e.target.value });
                                  else if (editingProduct) setEditingProduct({ ...editingProduct, accentColor: e.target.value });
                                }}
                                className="h-8 w-12 bg-transparent cursor-pointer"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div>
                              <span className="text-stone-400 block mb-1">রেট্রো স্ট্রাইপ ক্যাটাগরি:</span>
                              <select
                                value={isAddingNew ? newProduct.patternType : editingProduct?.patternType}
                                onChange={(e) => {
                                  const val = e.target.value as Product['patternType'];
                                  if (isAddingNew) setNewProduct({ ...newProduct, patternType: val });
                                  else if (editingProduct) setEditingProduct({ ...editingProduct, patternType: val });
                                }}
                                className="w-full px-2 py-1.5 bg-[#0a0a0a] text-xs text-white border border-white/15 rounded"
                              >
                                <option value="vintage-stripes">ঐতিহ্যবাহী ৪টি ছড়ানো স্ট্রাইপ</option>
                                <option value="chest-band">বুকের চওড়া রেট্রো ব্যান্ড</option>
                                <option value="retro-v">বুকের মাঝে ক্লাসিক ভি-প্যাটার্ন</option>
                                <option value="classic-quarters">কোয়ার্টার ব্লক ডিজাইন</option>
                                <option value="minimalist">সাইড মিনি স্ট্রাইপস</option>
                              </select>
                            </div>

                            <div>
                              <span className="text-stone-400 block mb-1">স্ট্রাইপের ৩টি রং:</span>
                              <div className="flex gap-2">
                                {[0, 1, 2].map((idx) => {
                                  let currentVal = '#000000';
                                  if (isAddingNew) currentVal = newProduct.stripeColors[idx] || '#F1B13B';
                                  else if (editingProduct) currentVal = editingProduct.stripeColors[idx] || '#F1B13B';
                                  
                                  return (
                                    <input
                                      key={`color-dot-${idx}`}
                                      type="color"
                                      value={currentVal}
                                      onChange={(e) => handleUpdateStripeColor(idx, e.target.value)}
                                      className="h-7 w-7 bg-transparent rounded cursor-pointer"
                                    />
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* HIGH PRIORITY MODULE: REAL JERSEY IMAGE AND VIDEO UPLOADER */}
                        <div className="bg-[#121212] p-4 rounded-xl border border-gold/15 space-y-4">
                          <span className="text-[10px] font-mono uppercase font-black text-[#F1B13B] tracking-wider block">📷 প্রিমিয়াম রিয়াল ছবির অ্যালবাম ও ভিডিও মিডিয়া (Max 3 Images + 1 Min Video)</span>
                          
                          {/* Image triggers layout */}
                          <div className="grid grid-cols-3 gap-3">
                            {[0, 1, 2].map((idx) => {
                              const imagesList = isAddingNew ? (newProduct.images || []) : (editingProduct?.images || []);
                              const currentImg = imagesList[idx];

                              return (
                                <div key={`prod-img-box-${idx}`} className="space-y-1">
                                  <span className="text-[9px] text-stone-500 font-mono">ছবি নং #{idx + 1}</span>
                                  <div
                                    onClick={() => {
                                      if (idx === 0) prodImg1Ref.current?.click();
                                      if (idx === 1) prodImg2Ref.current?.click();
                                      if (idx === 2) prodImg3Ref.current?.click();
                                    }}
                                    className="h-20 bg-black hover:bg-zinc-950 border border-dashed border-gold/20 hover:border-gold/50 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative"
                                  >
                                    <input
                                      type="file"
                                      accept="image/*"
                                      ref={idx === 0 ? prodImg1Ref : idx === 1 ? prodImg2Ref : prodImg3Ref}
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleProdImageUpload(idx, file);
                                      }}
                                      className="hidden"
                                    />
                                    {currentImg ? (
                                      <img src={currentImg} alt="Kitted jersey" className="h-full w-full object-cover" />
                                    ) : (
                                      <div className="text-center p-1">
                                        <Plus className="h-4 w-4 mx-auto text-gold" />
                                        <span className="text-[9px] text-stone-400 block leading-tight mt-0.5">ছবি সিলেক্ট করুন</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Video uploader section */}
                          <div className="space-y-1.5 pt-1.5">
                            <span className="text-[10px] text-stone-400 font-mono flex items-center gap-1">
                              <Film className="h-3.5 w-3.5 text-gold shrink-0" />
                              <span>১ মিনিটের প্রমোশনাল ভিডিও ফাইল (Optional Video File)</span>
                            </span>
                            
                            <div
                              onClick={() => prodVideoRef.current?.click()}
                              className="border border-dashed border-gold/20 hover:border-gold/50 rounded-lg p-3 bg-black cursor-pointer text-center text-xs text-stone-300 transition-all hover:bg-neutral-950 flex items-center justify-between gap-4"
                            >
                              <input
                                type="file"
                                accept="video/*"
                                ref={prodVideoRef}
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleProdVideoUpload(file);
                                }}
                                className="hidden"
                              />
                              <div className="flex items-center gap-2">
                                <Film className="h-4 w-4 text-gold shrink-0" />
                                <span className="text-[11px] font-mono truncate max-w-[200px]">
                                  {(isAddingNew ? newProduct.videoUrl : editingProduct?.videoUrl) ? '✓ ভিডিও কোয়ালিটি বাফার্ড এবং আপলোডেড' : '১ মিনিটের ভিডিও ক্লিপ সিলেক্ট করুন'}
                                </span>
                              </div>
                              <span className="text-[9px] text-gold underline font-mono">ব্রাউজ করুন</span>
                            </div>
                            <span className="text-[9px] text-stone-600 block italic leading-tight">
                              * আপলোড করা ভিডিও ফাইলের প্রিমিয়ার অটোমেটিক ১ মিনিটের লিমিট চেকে সাইজ ও দৈর্ঘ্য যাচাই হবে (অনধিক ৬০ সেকেন্ড)।
                            </span>
                          </div>
                        </div>

                      </div>

                      {/* Right visualization frame */}
                      <div className="lg:col-span-4 flex flex-col justify-between bg-[#070707] border border-gold/20 p-5 rounded-xl text-center">
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-widest text-[#9c9c9c] block mb-3">সিমুলেশন লাইভ প্রিভিউ</span>
                          <div className="w-28 mx-auto">
                            <JerseySvg
                              baseColor={isAddingNew ? newProduct.baseColor : editingProduct?.baseColor || BRAND_COLORS.maroon}
                              accentColor={isAddingNew ? newProduct.accentColor : editingProduct?.accentColor || BRAND_COLORS.cream}
                              stripeColors={isAddingNew ? newProduct.stripeColors : editingProduct?.stripeColors || []}
                              patternType={isAddingNew ? newProduct.patternType : editingProduct?.patternType || 'vintage-stripes'}
                              showShadow={false}
                            />
                          </div>
                        </div>

                        <div className="space-y-2 mt-6 pt-4 border-t border-white/5">
                          <button
                            type="submit"
                            className="w-full flex items-center justify-center gap-1.5 py-3 bg-gradient-to-r from-gold to-gold-dark text-black font-serif font-black uppercase text-xs rounded-lg shadow-lg hover:scale-[1.01] transition-transform cursor-pointer"
                          >
                            <Save className="h-4 w-4" />
                            <span>ক্যাটালগে সংরক্ষণ করুন (Publish Upgrade)</span>
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => { setIsAddingNew(false); setEditingProduct(null); setOpError(null); }}
                            className="w-full py-2 bg-stone-900 border border-white/10 hover:bg-stone-850 text-stone-400 text-xs rounded-lg cursor-pointer"
                          >
                            বাতিল করুন
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                )}

                {/* CURRENT JERSEY CATALOG LISTINGS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {products.map((p) => (
                    <div key={p.id} className="bg-[#0b0b0b] border border-gold/10 hover:border-gold/30 p-4 rounded-xl flex gap-4 transition-all group">
                      <div className="h-24 w-20 bg-black/60 rounded-lg p-1.5 flex items-center justify-center shrink-0 border border-white/5 relative">
                        <JerseySvg baseColor={p.baseColor} accentColor={p.accentColor} stripeColors={p.stripeColors} patternType={p.patternType} showShadow={false} />
                        {/* Real photos banner counts */}
                        {p.images && p.images.length > 0 && (
                          <span className="absolute bottom-1 right-1 bg-gold text-black text-[8px] font-black px-1 rounded">
                            {p.images.length}Img
                          </span>
                        )}
                      </div>

                      <div className="flex-1 flex flex-col justify-between truncate text-xs">
                        <div>
                          <span className="text-[8px] font-bold text-gold uppercase bg-gold/10 border border-gold/20 px-2 py-0.5 rounded inline-block">{p.category}</span>
                          <h4 className="font-serif font-bold text-white text-sm mt-1 truncate max-w-[280px]">{p.name}</h4>
                          <p className="text-stone-500 mt-1 line-clamp-1 italic">{p.description}</p>
                        </div>

                        <div className="flex items-center justify-between border-t border-white/5 pt-1.5 mt-2">
                          <span className="font-mono text-gold font-bold">৳{p.price}</span>
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleEditClick(p)}
                              className="p-1 px-1.5 hover:bg-gold hover:text-black border border-gold/15 transition-all rounded text-stone-300 font-bold bg-[#141414] cursor-pointer"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              className="p-1 px-1.5 hover:bg-rose-950 hover:text-rose-400 border border-red-950/20 transition-all rounded text-stone-400 bg-[#141414] cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: PROMO ADVERTISING POP-UP CAMPAIGNS */}
            {activeTab === 'ad-config' && (
              <div className="space-y-6">
                <div className="space-y-1">
                  <h3 className="text-[#F1B13B] text-base font-serif font-extrabold uppercase tracking-wider">ক্যাম্পেইন পপ-আপ সেটিংস</h3>
                  <p className="text-xs text-stone-400 font-light mt-0.5">গ্রাহক হোমপেজে প্রবেশ করতে চমৎকার ডিল পপ-আপ অ্যাডভার্টাইজ করতে ব্যবহার করুন</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Configuration Form controls */}
                  <form onSubmit={handleSaveAdConfig} className="lg:col-span-7 bg-[#0b0b0b] border border-gold/15 p-5 md:p-6 rounded-2xl shadow-xl space-y-4">
                    <div className="flex items-center justify-between bg-black/60 p-4 border border-gold/15 rounded-xl">
                      <div>
                        <span className="text-xs font-bold text-white block">বিজ্ঞাপন প্রদর্শন স্ট্যাটাস</span>
                        <span className="text-[10px] text-stone-450 mt-0.5 block">অন থাকলে গ্রাহক প্রবেশের সাথে সাথেই এই অ্যাডটি লোড হবে</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditedAd({ ...editedAd, isEnabled: !editedAd.isEnabled })}
                        className={`relative inline-flex h-6 w-11 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${editedAd.isEnabled ? 'bg-gold' : 'bg-stone-850'}`}
                      >
                        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ${editedAd.isEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    <div className="space-y-3 pt-2 text-xs">
                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-widest text-stone-450 mb-1">ক্যাম্পেইন ব্যাজ (Badge Text)</label>
                        <input
                          type="text"
                          value={editedAd.badgeText}
                          onChange={(e) => setEditedAd({ ...editedAd, badgeText: e.target.value })}
                          className="w-full px-3 py-2 bg-black text-stone-300 border border-gold/20 rounded focus:outline-none placeholder-stone-600"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-widest text-stone-450 mb-1">মূল প্রমো শিরোনাম (Promo Title) *</label>
                        <input
                          type="text"
                          required
                          value={editedAd.title}
                          onChange={(e) => setEditedAd({ ...editedAd, title: e.target.value })}
                          className="w-full px-3 py-2 bg-black text-stone-300 border border-gold/20 rounded focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-widest text-stone-450 mb-1">বিজ্ঞাপনের আকর্ষণীয় ডেসক্রিপশন *</label>
                        <textarea
                          required
                          rows={3}
                          value={editedAd.description}
                          onChange={(e) => setEditedAd({ ...editedAd, description: e.target.value })}
                          className="w-full px-3 py-2 bg-black text-stone-300 border border-gold/20 rounded focus:outline-none leading-relaxed"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-widest text-stone-450 mb-1">টুইংকিং বাটন ল্যান্ডার (Call To Action Button)</label>
                        <input
                          type="text"
                          value={editedAd.buttonText}
                          onChange={(e) => setEditedAd({ ...editedAd, buttonText: e.target.value })}
                          className="w-full px-3 py-2 bg-black text-stone-300 border border-gold/20 rounded focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-widest text-stone-450 mb-1">ট্রেডিং ল্যান্ডিং প্রোডাক্ট লিংক (Target Product Target) *</label>
                        <select
                          value={editedAd.targetProductId}
                          onChange={(e) => setEditedAd({ ...editedAd, targetProductId: e.target.value })}
                          className="w-full px-3 py-2.5 bg-black text-stone-300 border border-gold/20 rounded focus:outline-none font-bold"
                        >
                          <option value="">কোন পণ্য সিলেক্ট করুন</option>
                          {products.map(p => (
                            <option key={`opt-p-${p.id}`} value={p.id}>{p.name} (৳{p.price})</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/5">
                      <button
                        type="submit"
                        className="w-full py-2.5 bg-gradient-to-r from-gold to-gold-dark text-black font-serif font-black uppercase text-xs rounded-xl shadow-lg cursor-pointer hover:scale-[1.01]"
                      >
                        বিজ্ঞাপন পাবলিশ করুন (Save Campaign)
                      </button>
                    </div>
                  </form>

                  {/* Mock previews box */}
                  <div className="lg:col-span-5 bg-black/45 p-5 rounded-2xl border border-gold/20 space-y-4">
                    <span className="text-[10px] font-mono uppercase text-stone-500 tracking-widest block">মোবাইল কাস্টমার প্রিভিউ</span>
                    
                    <div className="bg-[#050505] p-5 rounded-xl border border-gold/15 space-y-3 relative overflow-hidden text-xs">
                      <div className="h-1 bg-gold absolute top-0 inset-x-0" />
                      
                      <div className="flex justify-between items-center text-[10px] font-bold">
                        {editedAd.badgeText && <span className="bg-gold/10 px-2 py-0.5 rounded border border-gold/15 text-gold">{editedAd.badgeText}</span>}
                        <span className="text-emerald-500">● LIVE PVE</span>
                      </div>

                      <h4 className="font-serif font-extrabold text-sm text-white pt-1">{editedAd.title || 'ক্যাম্পেইন প্রমোশন'}</h4>
                      <p className="text-stone-400 text-[11px] leading-relaxed line-clamp-3">{editedAd.description || 'বিজ্ঞাপন ডেসক্রিপশন...'}</p>

                      <div className="bg-gradient-to-r from-gold to-gold-dark text-black py-2 rounded text-center font-serif font-black uppercase text-[10px]">
                        {editedAd.buttonText || 'ভিজিট করুন'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: STORE SETTINGS / LOGO CUSTOMIZER */}
            {activeTab === 'store-settings' && (
              <div className="space-y-6">
                <div className="space-y-1">
                  <h3 className="text-base font-serif font-extrabold text-[#F1B13B] uppercase tracking-wider">দোকানের ব্র্যান্ডিং এবং লোগো সেটিংস</h3>
                  <p className="text-xs text-stone-400 font-light mt-0.5">নিজের জার্সি এসেন্স শপের হেডার লোগো এবং নাম কাস্টমাইজ করুন</p>
                </div>

                <div className="bg-[#0b0b0b] border border-gold/15 p-6 rounded-2xl shadow-xl space-y-5 text-xs max-w-2xl">
                  <h4 className="font-mono text-[10px] font-bold text-gold uppercase tracking-wider pb-2 border-b border-white/5">লোগো কাস্টমাইজার মডিউল</h4>
                  
                  {/* Logo previews layout */}
                  <div className="flex flex-col md:flex-row items-center gap-6 bg-black/40 p-4 rounded-xl border border-gold/10">
                    <div className="space-y-1 text-center">
                      <span className="text-[10.5px] font-mono text-stone-500 block">বর্তমান লোগো ক্যাটালগ</span>
                      <div className="h-16 w-16 bg-gradient-to-br from-gold to-[#8A6D3B] p-1 rounded-full flex items-center justify-center overflow-hidden shadow-lg shadow-gold/15">
                        {customLogo ? (
                          <img src={customLogo} alt="Custom store logo" className="h-full w-full object-contain" />
                        ) : (
                          <span className="font-serif font-black text-black text-lg italic">JE</span>
                        )}
                      </div>
                    </div>

                    <div className="flex-1 space-y-3">
                      <p className="text-stone-300 leading-relaxed font-light">
                        আপনার জার্সি বিক্রয়কারী পেজ বা স্টোরের অফিশিয়াল লোগো (image format) এখানে আপলোড করুন। আপলোড করার সাথে সাথে জেই-স্টোরের হেডার এবং লোডারসহ সমগ্র ল্যান্ডিং পেজে আপনার কাস্টম ব্র্যান্ড লোগোটি রিয়েল-টাইমে অ্যাক্টিভেট হবে।
                      </p>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => logoInputRef.current?.click()}
                          className="flex items-center gap-1.5 px-4.5 py-2.5 bg-gradient-to-r from-gold to-gold-dark text-black text-xs rounded-lg font-bold transition-all cursor-pointer hover:scale-[1.01]"
                        >
                          <Upload className="h-4.5 w-4.5 shrink-0" />
                          <span>লোগো ইমেজ সিলেক্ট করুন</span>
                        </button>

                        {customLogo && (
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm('আপনি কি রিসেট করে সিগনেচার "JE" লোগো দিয়ে রাখতে চান?')) {
                                onUpdateCustomLogo('');
                              }
                            }}
                            className="px-3.5 py-2.5 bg-rose-950/20 hover:bg-rose-950 border border-rose-900/40 text-rose-300 text-xs rounded-lg transition-colors cursor-pointer"
                          >
                            লোগো রিসেট করুন
                          </button>
                        )}
                      </div>

                      <input
                        type="file"
                        accept="image/*"
                        ref={logoInputRef}
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </div>
                  </div>

                  <p className="text-[10px] text-stone-500 leading-relaxed font-light italic">
                    * কাস্টম ব্র্যান্ড লোগোটি পিএনজি, জেপিইজি বা এসভিজি ফরম্যাটে ২ মেগাবাইটের নীচে হওয়া আবশ্যক। আপলোড হওয়ার সাথে সাথেই এটি লোকাল স্টোরেজে পিনড স্টোরেজ আকারে পিসিস্ট্যান্স থাকবে।
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Screen Shot lightbox modal view (Zoom display) */}
      {selectedScreenshot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95">
          <button
            onClick={() => setSelectedScreenshot(null)}
            className="absolute top-4 right-4 text-white bg-stone-800 hover:bg-rose-950 p-2.5 rounded-full z-10 cursor-pointer"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="relative max-w-2xl w-full flex flex-col justify-center items-center">
            <h4 className="text-[#F1B13B] font-serif font-bold text-center mb-4 text-xs tracking-widest uppercase">
              জেই অপারেটর পেমেন্ট ভেরিফিকেশন রশিদ
            </h4>
            <div className="max-h-[80vh] overflow-auto rounded-xl border border-white/10 bg-black shadow-2xl">
              <img src={selectedScreenshot} alt="Verified payment bill" className="max-h-[75vh] mx-auto object-contain" />
            </div>
            <p className="text-xs text-stone-500 font-mono mt-3">Click anywhere to return</p>
            <div className="absolute inset-0 z-[-1]" onClick={() => setSelectedScreenshot(null)} />
          </div>
        </div>
      )}
    </div>
  );
};
