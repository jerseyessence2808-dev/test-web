/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TranslationDict {
  welcomeTagline: string;
  welcomeDesc: string;
  searchPlaceholder: string;
  categories: {
    all: string;
    retroClassic: string;
    clubSpecial: string;
    nationalTeam: string;
    specialEdition: string;
  };
  adminHubBtn: string;
  shoppingBagTitle: string;
  emptyBagMsg: string;
  emptyBagSub: string;
  browseStoreBtn: string;
  sizeSelectorLabel: string;
  sizeGuide: string;
  addToBagBtn: string;
  buyNowBtn: string;
  returnGuarantee: string;
  exclusiveOffer: string;
  hotSeller: string;
  reviewCountStr: string;
  reviewsHeader: string;
  noReviewsYet: string;
  writeReviewTitle: string;
  yourRatingLabel: string;
  yourReviewPlaceholder: string;
  submitReviewBtn: string;
  reviewSuccessAlert: string;
}

export const translations: Record<'bn' | 'en', TranslationDict> = {
  bn: {
    welcomeTagline: "ঐতিহ্য আর আধুনিকতার নান্দনিক মেলবন্ধন!",
    welcomeDesc: "জার্সি এসেন্সে আপনাকে স্বাগতম। লোগোর ৪টি স্ট্রাইপ থিমের উপর ভিত্তি করে আমাদের লাক্সারিয়াস এবং প্রিমিয়াম ভিন্টেজ স্পোর্টিং জার্সিগুলো ডিজাইন করা হয়েছে। চমৎকার ফেব্রিক ফ্যাব্রিকেশন এবং কাস্টমাইজড নিট ফিটের প্রিমিয়াম অভিজ্ঞতা নিন এখনই।",
    searchPlaceholder: "আপনার পছন্দের ডিজাইন, রং বা জার্সি খুঁজুন...",
    categories: {
      all: "সকল জার্সি",
      retroClassic: "রেট্রো ক্লাসিক",
      clubSpecial: "ক্লাব স্পেশাল",
      nationalTeam: "জাতীয় দল",
      specialEdition: "বিশেষ সংস্করণ"
    },
    adminHubBtn: "অপারেটর হব",
    shoppingBagTitle: "আপনার শপিং ব্যাগ",
    emptyBagMsg: "আপনার ব্যাগ খালি রয়েছে",
    emptyBagSub: "নতুন ভিন্টেজ জার্সি এড করতে স্টোরে ব্রাউজ করুন।",
    browseStoreBtn: "স্টোরে ব্রাউজ করুন",
    sizeSelectorLabel: "সাইজ নির্বাচন করুন:",
    sizeGuide: "স্ট্যান্ডার্ড এশিয়ান স্পোর্টস ফিট",
    addToBagBtn: "ব্যাগে যোগ করুন",
    buyNowBtn: "এখনই কিনুন",
    returnGuarantee: "৭ দিনের সহজ রিটার্ন বা সাইজ পরিবর্তন গ্যারান্টি",
    exclusiveOffer: "এক্সক্লুসিভ অফার",
    hotSeller: "হট সেলার",
    reviewCountStr: "রিভিউ",
    reviewsHeader: "পণ্য রিভিউ এবং কাস্টমার মতামত",
    noReviewsYet: "এখনো কোনো রিভিউ দেয়া হয়নি। এই জার্সির প্রথম রিভিউটি লিখুন!",
    writeReviewTitle: "রিভিউ লিখুন ও অভিজ্ঞতা শেয়ার করুন",
    yourRatingLabel: "আপনার রেটিং সিলেক্ট করুন:",
    yourReviewPlaceholder: "যেমন: জার্সির কাপড় খুব আরামদায়ক ছিল এবং সেলাই ফিনিশিং অসম্ভব সুন্দর! অতি দ্রুত ডেলিভারি পেয়েছি।",
    submitReviewBtn: "রিভিউ সাবমিট করুন",
    reviewSuccessAlert: "ধন্যবাদ! আপনার মূল্যবান রিভিউটি সফলভাবে সায়িট ক্যাটালগে যুক্ত করা হয়েছে।"
  },
  en: {
    welcomeTagline: "Aesthetic blend of heritage and modern vintage style",
    welcomeDesc: "Welcome to Jersey Essence. Our luxurious and premium vintage sporting jerseys are designed based on the signature 4-stripe logo theme. Experience exquisite fabrication and custom-knit premium fit today.",
    searchPlaceholder: "Search your favorite designs, colors, or teams...",
    categories: {
      all: "All Jerseys",
      retroClassic: "Retro Classic",
      clubSpecial: "Club Special",
      nationalTeam: "National Team",
      specialEdition: "Special Edition"
    },
    adminHubBtn: "Operator Hub",
    shoppingBagTitle: "Your Shopping Bag",
    emptyBagMsg: "Your bag is currently empty",
    emptyBagSub: "Browse our premium store to add stunning vintage jerseys.",
    browseStoreBtn: "Browse Online Store",
    sizeSelectorLabel: "Select Fit Size:",
    sizeGuide: "Standard Asian Sports Slim Fit",
    addToBagBtn: "Add to Bag",
    buyNowBtn: "Buy It Now",
    returnGuarantee: "7 Days Hassle-Free Returns & Size Exchange Guarantee",
    exclusiveOffer: "Exclusive Piece",
    hotSeller: "Hot Seller",
    reviewCountStr: "reviews",
    reviewsHeader: "Product Reviews & Customer Experience",
    noReviewsYet: "No reviews offered yet. Be the first to share your thoughts for this jersey!",
    writeReviewTitle: "Share Your Honest Review",
    yourRatingLabel: "Identify Your Score:",
    yourReviewPlaceholder: "E.g., Incredibly premium knitting fabrication and colors match the pictures perfectly! Express fast shipping.",
    submitReviewBtn: "Submit Review",
    reviewSuccessAlert: "Thank you! Your verified customer review is successfully active in store catalog."
  }
};
