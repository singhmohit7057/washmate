export const BRAND = {
  name: 'WashMate',
  tagline: 'Your Clothes Deserve Better.',
  email: 'hello@washmate.in',
  phone: '+91 98765 43210',
  whatsapp: import.meta.env.VITE_WHATSAPP_NUMBER || '919999999999',
  address: 'Kolkata, West Bengal, India',
  instagram: 'https://instagram.com/washmate',
  facebook: 'https://facebook.com/washmate',
  twitter: 'https://twitter.com/washmate',
} as const;

export const COLORS = {
  primary: '#007AFF',
  primaryDark: '#0056CC',
  primaryLight: '#E8F3FF',
  secondary: '#FFFFFF',
  dark: '#111827',
  darkMuted: '#374151',
  muted: '#6B7280',
  border: '#E5E7EB',
  success: '#34C759',
  warning: '#FF9500',
  danger: '#FF3B30',
  background: '#FAFAFA',
  surface: '#FFFFFF',
  surfaceHover: '#F3F4F6',
} as const;

export const WHATSAPP_URL = `https://wa.me/${BRAND.whatsapp}?text=Hi%20WashMate!%20I'd%20like%20to%20schedule%20a%20pickup.`;

export const ORDER_STATUSES = [
  { key: 'pickup_scheduled', label: 'Pickup Scheduled', icon: 'Calendar' },
  { key: 'picked_up', label: 'Picked Up', icon: 'Package' },
  { key: 'processing', label: 'Processing', icon: 'Settings' },
  { key: 'washing', label: 'Washing', icon: 'Droplets' },
  { key: 'quality_check', label: 'Quality Check', icon: 'CheckCircle' },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: 'Truck' },
  { key: 'delivered', label: 'Delivered', icon: 'Home' },
] as const;

export const SERVICE_AREAS = [
  { name: 'Kolkata', slug: 'kolkata', pincode: ['700001', '700002', '700003'] },
  { name: 'Barrackpore', slug: 'barrackpore', pincode: ['700120', '700121'] },
  { name: 'Kankinara', slug: 'kankinara', pincode: ['743126'] },
  { name: 'Naihati', slug: 'naihati', pincode: ['743165'] },
  { name: 'Titagarh', slug: 'titagarh', pincode: ['700119'] },
  { name: 'Kalyani', slug: 'kalyani', pincode: ['741235', '741236'] },
] as const;

export const FAQS = [
  {
    question: 'How does the pickup and delivery work?',
    answer: "Simply schedule a pickup through our website. We'll arrive at your doorstep at the scheduled time, collect your garments, clean them with professional care, and deliver them back fresh and clean.",
  },
  {
    question: 'What are the delivery timelines?',
    answer: 'Regular delivery: Laundry in 48 hours, Dry Cleaning in 72 hours, Shoe Cleaning in 3-5 days. Express delivery (1.5x charges) offers same-day or next-day service for selected items.',
  },
  {
    question: 'Is pickup and delivery free?',
    answer: 'Yes! Pickup and standard delivery are completely free for all orders. Express delivery carries a 1.5x surcharge on the order value.',
  },
  {
    question: 'How do I track my order?',
    answer: 'Once logged in, visit your Dashboard and click "Order Tracking". You\'ll see real-time updates at every step — from pickup to delivery.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept UPI, credit/debit cards, net banking, and cash on delivery. Payment is collected at the time of delivery.',
  },
  {
    question: 'Are my clothes safe with WashMate?',
    answer: 'Absolutely. Every garment is tagged individually, processed with fabric-safe detergents, and passes a 3-point quality inspection before delivery.',
  },
  {
    question: 'Can I use a coupon code?',
    answer: 'Yes! Enter your coupon code during scheduling a pickup. Active coupons offer percentage discounts, flat reductions, free pickup, or free delivery.',
  },
  {
    question: 'What areas do you serve?',
    answer: 'We currently serve Kolkata, Barrackpore, Kankinara, Naihati, Titagarh, and Kalyani. We are expanding rapidly — contact us to check availability in your area.',
  },
] as const;
