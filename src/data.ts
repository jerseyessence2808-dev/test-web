/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, AdConfig } from './types';

export const BRAND_COLORS = {
  maroon: '#2D0B0F', // Main logo background (luxury dark burgundy)
  cream: '#F4EFEB',  // Vintage text / accent color
  teal: '#468285',   // Top stripe in logo
  coral: '#B84A39',  // Second stripe in logo
  orange: '#D37233', // Third stripe in logo
  yellow: '#F1B13B', // Bottom stripe in logo
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'jersey-maroon-revival',
    name: 'The Burgundy Revival Retro Jersey',
    price: 1350,
    originalPrice: 1600,
    description: 'আমাদের সিগনেচার জার্সি, যা চমৎকার ডিপ মেরুন ফেব্রিকের উপর তৈরি এবং কাফ ও কলারে রয়েছে লোগোর সাথে সামঞ্জস্যপূর্ণ ৪টি ঐতিহ্যবাহী ট্র্যাডিশনাল স্ট্রাইপ। আরামদায়ক ড্রাই-ফিট প্রযুক্তিতে তৈরি যা প্লেয়িং বা ক্লাসিক ক্যাজুয়াল আউটফিত হিসেবে মানানসই।',
    category: 'Special Edition',
    stripeColors: [BRAND_COLORS.teal, BRAND_COLORS.coral, BRAND_COLORS.orange, BRAND_COLORS.yellow],
    baseColor: BRAND_COLORS.maroon,
    accentColor: BRAND_COLORS.cream,
    patternType: 'vintage-stripes',
    rating: 4.9,
    reviewsCount: 148,
    isFeatured: true
  },
  {
    id: 'jersey-retro-essence',
    name: 'The Retro Essence Edition (Cream & Stripe)',
    price: 1450,
    originalPrice: 1800,
    description: 'ভিন্টেজ লাক্সারি লুকের সবথেকে নান্দনিক কম্বিনেশন। এন্টিক ক্রিম বডির সাথে বুকে মেরুন, টিল এবং কোরাল কালারের সুদৃশ্য অ্যাশ ডেকোরেটেড স্ট্রাইপ। এটি স্ট্রিট ফ্যাশনের জন্য খুবই ট্রেন্ডি এবং কাস্টমারদের প্রথম পছন্দ।',
    category: 'Retro Classic',
    stripeColors: [BRAND_COLORS.maroon, BRAND_COLORS.teal, BRAND_COLORS.coral],
    baseColor: BRAND_COLORS.cream,
    accentColor: BRAND_COLORS.maroon,
    patternType: 'chest-band',
    rating: 5.0,
    reviewsCount: 215,
    isFeatured: true
  },
  {
    id: 'jersey-emerald-classic',
    name: 'Classic Emerald Retro Varsity',
    price: 1250,
    description: 'গভীর ডার্ক এমারেল্ড টিল বডির চমৎকার টেক্সচার্ড ডিজাইন। হালকা গোল্ডেন বাটন কলারে ভিন্টেজ স্পোর্টিং ফিল এনে দেবে। বডির মাঝখানে রয়েছে ক্রিম এবং কোরাল কালারের কাস্টমাইজড স্ট্রাইপ প্যাটার্ন।',
    category: 'Club Special',
    stripeColors: [BRAND_COLORS.cream, BRAND_COLORS.coral, BRAND_COLORS.yellow],
    baseColor: '#1E3E3F',
    accentColor: BRAND_COLORS.yellow,
    patternType: 'retro-v',
    rating: 4.8,
    reviewsCount: 92,
    isFeatured: true
  },
  {
    id: 'jersey-crimson-horizon',
    name: 'Crimson Horizon Classic Jersey',
    price: 1300,
    originalPrice: 1550,
    description: 'উষ্ণ টেরাকোটা রেড কালারের সাথে লাক্সারিয়াস মেরুন ফিনিশ। বুকের দুই পাশে স্লিভে রয়েছে আইকনিক রানিং স্ট্রাইপস। প্রফেশনাল স্পোর্টস ক্লাব গ্রেড পলিয়েস্টার দিয়ে নিপুণভাবে তৈরি।',
    category: 'National Team',
    stripeColors: [BRAND_COLORS.maroon, BRAND_COLORS.teal, BRAND_COLORS.cream],
    baseColor: '#962B1D',
    accentColor: BRAND_COLORS.cream,
    patternType: 'classic-quarters',
    rating: 4.7,
    reviewsCount: 78
  },
  {
    id: 'jersey-midnight-essence',
    name: 'Midnight Gold Prestige Jersey',
    price: 1500,
    originalPrice: 1950,
    description: 'অন্ধকার রাতের মতো কালো ও সোনালী কম্বিনেশন সমৃদ্ধ স্পেশাল প্রিমিয়াম লাক্সারি এডিশন। বুকের মাঝখানে কালজয়ী রেট্রো স্ট্রাইপ গোল্ডেন এবং কোরাল রঙের সুতলি এম্বেড প্যাটার্নে সুসজ্জিত। যেকোনো উৎসব কিংবা মাঠে এটি আপনাকে করবে অনন্য।',
    category: 'Special Edition',
    stripeColors: [BRAND_COLORS.yellow, BRAND_COLORS.orange, BRAND_COLORS.cream],
    baseColor: '#121213',
    accentColor: BRAND_COLORS.yellow,
    patternType: 'vintage-stripes',
    rating: 4.9,
    reviewsCount: 310,
    isFeatured: true
  },
  {
    id: 'jersey-cyber-teal',
    name: 'Cyber Vintage Teal Activewear',
    price: 1190,
    originalPrice: 1400,
    description: 'লাইট টিল ভাইব্রেন্ট কালারের একটি সতেজ স্পোর্টি ফিল। ট্র্যাডিশনাল মেরুন এবং অরেঞ্জ কালারের কনট্রাস্ট স্ট্রাইপ স্লিভের ডিজাইনে দারুণ বৈচিত্র্য তৈরি করেছে। লাইটওয়েট এবং অত্যন্ত আরামদায়ক সুতা দিয়ে তৈরি।',
    category: 'Club Special',
    stripeColors: [BRAND_COLORS.maroon, BRAND_COLORS.orange, BRAND_COLORS.cream],
    baseColor: '#366F72',
    accentColor: BRAND_COLORS.maroon,
    patternType: 'minimalist',
    rating: 4.6,
    reviewsCount: 64
  }
];

export const INITIAL_AD_CONFIG: AdConfig = {
  isEnabled: true,
  title: "🔥 Special Eid Campaign: Jersey Essence Signature Jersey!",
  description: "আমাদের লিমিটেড লাক্সারিয়াস সিগনেচার ক্রিম এডিশন জার্সিতে পাচ্ছেন সরাসরি ক্যাশব্যাক ডিসকাউন্ট। এডভার্টাইজমেন্টের এই ব্যানারে ক্লিক করে সরাসরি প্রোডাক্ট পেজে চলে যান এবং অর্ডার কনফার্ম করুন!",
  targetProductId: "jersey-retro-essence",
  badgeText: "EXCLUSIVE PROMO",
  buttonText: "সম্পূর্ণ দেখতে ক্লিক করুন (Take Me There)"
};

export const bKASH_NUMBER = "01789-123456";
export const NAGAD_NUMBER = "01987-654321";
