export type { UserRole, OrderStatus, DeliveryType, CouponType } from './database';

export interface NavLink {
  label: string;
  href: string;
  isExternal?: boolean;
}

export interface ServiceCard {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  startingPrice: number;
  turnaroundTime: string;
  imageUrl?: string;
}

export interface PricingItem {
  id: string;
  itemName: string;
  category: string;
  washFoldPrice: number | null;
  dryCleanPrice: number | null;
  steamIronPrice: number | null;
}

export interface Testimonial {
  id: string;
  customerName: string;
  customerLocation: string;
  rating: number;
  review: string;
  avatarUrl?: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface ServiceArea {
  id: string;
  name: string;
  slug: string;
  city: string;
  coverageInfo: string;
  pickupAvailability: string;
  deliveryTimeline: string;
}

export interface AuthUser {
  id: string;
  email: string;
  fullName: string | null;
  phone: string | null;
  avatarUrl: string | null;
  role: 'customer' | 'admin' | 'super_admin';
}

export interface Order {
  id: string;
  orderNumber: string;
  status: string;
  deliveryType: 'regular' | 'express';
  pickupDate: string;
  pickupTime: string;
  total: number;
  createdAt: string;
}

export interface SchedulePickupForm {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  serviceType: string;
  pickupDate: string;
  pickupTime: string;
  deliveryType: 'regular' | 'express';
  couponCode: string;
  notes: string;
}

export interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}
