/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  category: 'Retro Classic' | 'Club Special' | 'National Team' | 'Special Edition';
  stripeColors: string[]; // HEX colors of stripes matching the logo (teal, red, orange, yellow) or custom
  baseColor: string; // The primary background color of the jersey
  accentColor: string; // Neck/Cuff color
  patternType: 'vintage-stripes' | 'chest-band' | 'retro-v' | 'minimalist' | 'classic-quarters';
  rating: number;
  reviewsCount: number;
  isFeatured?: boolean;
  images?: string[]; // Maximum 3 base64 or URL real images
  videoUrl?: string; // Optional video base64 or URL (maximum 1 minute)
  reviews?: Review[]; // Product reviews shown to everyone
}

export interface CartItem {
  id: string; // unique combination of product.id + size
  product: Product;
  quantity: number;
  chosenSize: 'S' | 'M' | 'L' | 'XL' | 'XXL';
}

export interface PaymentDetails {
  bKashNumberUsed?: string;
  nagadNumberUsed?: string;
  transactionId?: string;
  screenshotData?: string; // base64 representation of uploaded screenshot
  screenshotName?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  orderDate: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  items: CartItem[];
  paymentMethod: 'bKash' | 'Nagad' | 'Cash on Delivery';
  paymentDetails?: PaymentDetails;
  totalAmount: number;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Cancelled';
}

export interface AdConfig {
  isEnabled: boolean;
  title: string;
  description: string;
  targetProductId: string; // Clicking this ad redirects or opens this product modal
  imageUrl?: string;
  buttonText: string;
  badgeText?: string;
}
