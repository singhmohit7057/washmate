export type UserRole = 'customer' | 'admin' | 'super_admin';

export type OrderStatus =
  | 'pickup_scheduled'
  | 'picked_up'
  | 'processing'
  | 'washing'
  | 'quality_check'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export type DeliveryType = 'regular' | 'express';

export type CouponType = 'percentage' | 'fixed' | 'free_pickup' | 'free_delivery';

export interface Database {
  public: {
    Tables: {
      users: {
        Row: UserRow;
        Insert: Omit<UserRow, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<UserRow, 'id' | 'created_at'>>;
      };
      services: {
        Row: ServiceRow;
        Insert: Omit<ServiceRow, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<ServiceRow, 'id' | 'created_at'>>;
      };
      orders: {
        Row: OrderRow;
        Insert: Omit<OrderRow, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<OrderRow, 'id' | 'created_at'>>;
      };
      order_items: {
        Row: OrderItemRow;
        Insert: Omit<OrderItemRow, 'id' | 'created_at'>;
        Update: Partial<Omit<OrderItemRow, 'id' | 'created_at'>>;
      };
      pricing: {
        Row: PricingRow;
        Insert: Omit<PricingRow, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<PricingRow, 'id' | 'created_at'>>;
      };
      coupons: {
        Row: CouponRow;
        Insert: Omit<CouponRow, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<CouponRow, 'id' | 'created_at'>>;
      };
      coupon_usage: {
        Row: CouponUsageRow;
        Insert: Omit<CouponUsageRow, 'id' | 'used_at'>;
        Update: never;
      };
      addresses: {
        Row: AddressRow;
        Insert: Omit<AddressRow, 'id' | 'created_at'>;
        Update: Partial<Omit<AddressRow, 'id' | 'created_at'>>;
      };
      service_areas: {
        Row: ServiceAreaRow;
        Insert: Omit<ServiceAreaRow, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<ServiceAreaRow, 'id' | 'created_at'>>;
      };
      testimonials: {
        Row: TestimonialRow;
        Insert: Omit<TestimonialRow, 'id' | 'created_at'>;
        Update: Partial<Omit<TestimonialRow, 'id' | 'created_at'>>;
      };
      contact_messages: {
        Row: ContactMessageRow;
        Insert: Omit<ContactMessageRow, 'id' | 'created_at'>;
        Update: Partial<Omit<ContactMessageRow, 'id' | 'created_at'>>;
      };
      admin_activity_logs: {
        Row: AdminActivityLogRow;
        Insert: Omit<AdminActivityLogRow, 'id' | 'created_at'>;
        Update: never;
      };
      user_roles: {
        Row: UserRoleRow;
        Insert: Omit<UserRoleRow, 'id' | 'created_at'>;
        Update: Partial<Omit<UserRoleRow, 'id' | 'created_at'>>;
      };
    };
  };
}

export interface UserRow {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserRoleRow {
  id: string;
  user_id: string;
  role: UserRole;
  created_at: string;
}

export interface ServiceRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  process: string | null;
  turnaround_time: string | null;
  starting_price: number;
  image_url: string | null;
  icon: string | null;
  is_active: boolean;
  sort_order: number;
  category_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderRow {
  id: string;
  order_number: string;
  user_id: string;
  status: OrderStatus;
  delivery_type: DeliveryType;
  pickup_date: string;
  pickup_time: string;
  delivery_address: string;
  notes: string | null;
  subtotal: number;
  discount: number;
  total: number;
  coupon_id: string | null;
  coupon_code: string | null;
  assigned_delivery_staff: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItemRow {
  id: string;
  order_id: string;
  service_id: string;
  item_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}

export interface PricingRow {
  id: string;
  service_id: string;
  item_name: string;
  category: string;
  wash_fold_price: number | null;
  dry_clean_price: number | null;
  steam_iron_price: number | null;
  city: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CouponRow {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  min_order_value: number;
  max_uses: number | null;
  used_count: number;
  applicable_services: string[] | null;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CouponUsageRow {
  id: string;
  coupon_id: string;
  user_id: string;
  order_id: string;
  discount_amount: number;
  used_at: string;
}

export interface AddressRow {
  id: string;
  user_id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
  created_at: string;
}

export interface ServiceAreaRow {
  id: string;
  name: string;
  slug: string;
  city: string;
  state: string;
  pincode: string[];
  coverage_info: string | null;
  pickup_availability: string | null;
  delivery_timeline: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TestimonialRow {
  id: string;
  customer_name: string;
  customer_location: string | null;
  rating: number;
  review: string;
  avatar_url: string | null;
  is_featured: boolean;
  created_at: string;
}

export interface ContactMessageRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface AdminActivityLogRow {
  id: string;
  admin_id: string;
  action: string;
  resource_type: string;
  resource_id: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
}
