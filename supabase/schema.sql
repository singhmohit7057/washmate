-- ============================================================
-- WashMate Database Schema
-- Supabase PostgreSQL
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.users (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL UNIQUE,
  full_name   TEXT,
  phone       TEXT,
  avatar_url  TEXT,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_is_active ON public.users(is_active);

-- ============================================================
-- ROLES
-- ============================================================
CREATE TYPE public.user_role AS ENUM ('customer', 'admin', 'super_admin');

CREATE TABLE IF NOT EXISTS public.user_roles (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role       public.user_role NOT NULL DEFAULT 'customer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_role ON public.user_roles(role);

-- ============================================================
-- SERVICE CATEGORIES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.service_categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  sort_order  INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- SERVICES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.services (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name             TEXT NOT NULL,
  slug             TEXT NOT NULL UNIQUE,
  description      TEXT,
  process          TEXT,
  turnaround_time  TEXT,
  starting_price   NUMERIC(10,2) NOT NULL DEFAULT 0,
  image_url        TEXT,
  icon             TEXT,
  is_active        BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order       INT NOT NULL DEFAULT 0,
  category_id      UUID REFERENCES public.service_categories(id) ON DELETE SET NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_services_slug ON public.services(slug);
CREATE INDEX idx_services_is_active ON public.services(is_active);
CREATE INDEX idx_services_sort_order ON public.services(sort_order);

-- ============================================================
-- PRICING
-- ============================================================
CREATE TABLE IF NOT EXISTS public.pricing (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_id        UUID REFERENCES public.services(id) ON DELETE SET NULL,
  item_name         TEXT NOT NULL,
  category          TEXT NOT NULL,
  wash_fold_price   NUMERIC(10,2),
  dry_clean_price   NUMERIC(10,2),
  steam_iron_price  NUMERIC(10,2),
  city              TEXT,
  is_active         BOOLEAN NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pricing_category ON public.pricing(category);
CREATE INDEX idx_pricing_is_active ON public.pricing(is_active);
CREATE INDEX idx_pricing_city ON public.pricing(city);

-- ============================================================
-- SERVICE AREAS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.service_areas (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name                 TEXT NOT NULL,
  slug                 TEXT NOT NULL UNIQUE,
  city                 TEXT NOT NULL,
  state                TEXT NOT NULL DEFAULT 'West Bengal',
  pincode              TEXT[] NOT NULL DEFAULT '{}',
  coverage_info        TEXT,
  pickup_availability  TEXT,
  delivery_timeline    TEXT,
  is_active            BOOLEAN NOT NULL DEFAULT TRUE,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_service_areas_slug ON public.service_areas(slug);
CREATE INDEX idx_service_areas_is_active ON public.service_areas(is_active);

-- ============================================================
-- ADDRESSES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.addresses (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  label       TEXT NOT NULL DEFAULT 'Home',
  street      TEXT NOT NULL,
  city        TEXT NOT NULL,
  state       TEXT NOT NULL DEFAULT 'West Bengal',
  pincode     TEXT NOT NULL,
  is_default  BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_addresses_user_id ON public.addresses(user_id);

-- ============================================================
-- COUPONS
-- ============================================================
CREATE TYPE public.coupon_type AS ENUM ('percentage', 'fixed', 'free_pickup', 'free_delivery');

CREATE TABLE IF NOT EXISTS public.coupons (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code                 TEXT NOT NULL UNIQUE,
  type                 public.coupon_type NOT NULL DEFAULT 'percentage',
  value                NUMERIC(10,2) NOT NULL DEFAULT 0,
  min_order_value      NUMERIC(10,2) NOT NULL DEFAULT 0,
  max_uses             INT,
  used_count           INT NOT NULL DEFAULT 0,
  applicable_services  UUID[],
  expires_at           TIMESTAMPTZ,
  is_active            BOOLEAN NOT NULL DEFAULT TRUE,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_coupons_code ON public.coupons(code);
CREATE INDEX idx_coupons_is_active ON public.coupons(is_active);

-- ============================================================
-- ORDERS
-- ============================================================
CREATE TYPE public.order_status AS ENUM (
  'pickup_scheduled',
  'picked_up',
  'processing',
  'washing',
  'quality_check',
  'out_for_delivery',
  'delivered',
  'cancelled'
);

CREATE TYPE public.delivery_type AS ENUM ('regular', 'express');

CREATE TABLE IF NOT EXISTS public.orders (
  id                        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number              TEXT NOT NULL UNIQUE,
  user_id                   UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  status                    public.order_status NOT NULL DEFAULT 'pickup_scheduled',
  delivery_type             public.delivery_type NOT NULL DEFAULT 'regular',
  pickup_date               DATE NOT NULL,
  pickup_time               TEXT NOT NULL,
  delivery_address          TEXT NOT NULL,
  notes                     TEXT,
  subtotal                  NUMERIC(10,2) NOT NULL DEFAULT 0,
  discount                  NUMERIC(10,2) NOT NULL DEFAULT 0,
  total                     NUMERIC(10,2) NOT NULL DEFAULT 0,
  coupon_id                 UUID REFERENCES public.coupons(id) ON DELETE SET NULL,
  coupon_code               TEXT,
  assigned_delivery_staff   TEXT,
  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_order_number ON public.orders(order_number);
CREATE INDEX idx_orders_pickup_date ON public.orders(pickup_date);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);

-- ============================================================
-- ORDER ITEMS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.order_items (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id    UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  service_id  UUID REFERENCES public.services(id) ON DELETE SET NULL,
  item_name   TEXT NOT NULL,
  quantity    INT NOT NULL DEFAULT 1,
  unit_price  NUMERIC(10,2) NOT NULL,
  total_price NUMERIC(10,2) NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);

-- ============================================================
-- COUPON USAGE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.coupon_usage (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coupon_id        UUID NOT NULL REFERENCES public.coupons(id) ON DELETE CASCADE,
  user_id          UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  order_id         UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  discount_amount  NUMERIC(10,2) NOT NULL,
  used_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(coupon_id, order_id)
);

CREATE INDEX idx_coupon_usage_coupon_id ON public.coupon_usage(coupon_id);
CREATE INDEX idx_coupon_usage_user_id ON public.coupon_usage(user_id);

-- ============================================================
-- TESTIMONIALS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.testimonials (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name     TEXT NOT NULL,
  customer_location TEXT,
  rating            INT NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  review            TEXT NOT NULL,
  avatar_url        TEXT,
  is_featured       BOOLEAN NOT NULL DEFAULT FALSE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_testimonials_is_featured ON public.testimonials(is_featured);

-- ============================================================
-- CONTACT MESSAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  phone      TEXT,
  subject    TEXT NOT NULL DEFAULT 'General Inquiry',
  message    TEXT NOT NULL,
  is_read    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_contact_messages_is_read ON public.contact_messages(is_read);
CREATE INDEX idx_contact_messages_created_at ON public.contact_messages(created_at DESC);

-- ============================================================
-- ADMIN ACTIVITY LOGS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.admin_activity_logs (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id       UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  action         TEXT NOT NULL,
  resource_type  TEXT NOT NULL,
  resource_id    UUID,
  details        JSONB,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_admin_logs_admin_id ON public.admin_activity_logs(admin_id);
CREATE INDEX idx_admin_logs_created_at ON public.admin_activity_logs(created_at DESC);

-- ============================================================
-- TRIGGERS: Auto-update updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at         BEFORE UPDATE ON public.users         FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_services_updated_at      BEFORE UPDATE ON public.services      FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_pricing_updated_at       BEFORE UPDATE ON public.pricing       FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_orders_updated_at        BEFORE UPDATE ON public.orders        FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_coupons_updated_at       BEFORE UPDATE ON public.coupons       FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_service_areas_updated_at BEFORE UPDATE ON public.service_areas FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- TRIGGER: Auto-insert user profile on signup
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'customer')
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_new_user
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- TRIGGER: Increment coupon used_count on usage insert
-- ============================================================
CREATE OR REPLACE FUNCTION public.increment_coupon_used_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.coupons
  SET used_count = used_count + 1,
      updated_at = NOW()
  WHERE id = NEW.coupon_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_coupon_usage_insert
  AFTER INSERT ON public.coupon_usage
  FOR EACH ROW EXECUTE FUNCTION public.increment_coupon_used_count();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE public.users              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_usage       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_areas      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages   ENABLE ROW LEVEL SECURITY;

-- Helper: check if caller is admin or super_admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role IN ('admin', 'super_admin')
  );
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role = 'super_admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Users: can read/update their own profile; admins can read all
CREATE POLICY "users_select_own"    ON public.users FOR SELECT USING (id = auth.uid() OR public.is_admin());
CREATE POLICY "users_update_own"    ON public.users FOR UPDATE USING (id = auth.uid());
CREATE POLICY "users_insert_own"    ON public.users FOR INSERT WITH CHECK (id = auth.uid());
CREATE POLICY "users_delete_admin"  ON public.users FOR DELETE USING (public.is_super_admin());

-- User roles: read own; admin can read all; super admin can write
CREATE POLICY "user_roles_select"   ON public.user_roles FOR SELECT USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "user_roles_insert"   ON public.user_roles FOR INSERT WITH CHECK (public.is_super_admin());
CREATE POLICY "user_roles_update"   ON public.user_roles FOR UPDATE USING (public.is_super_admin());
CREATE POLICY "user_roles_delete"   ON public.user_roles FOR DELETE USING (public.is_super_admin());

-- Orders: customers see own; admins see all
CREATE POLICY "orders_select"       ON public.orders FOR SELECT USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "orders_insert"       ON public.orders FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "orders_update_admin" ON public.orders FOR UPDATE USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "orders_delete_admin" ON public.orders FOR DELETE USING (public.is_super_admin());

-- Order items: same as orders
CREATE POLICY "order_items_select"  ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND (orders.user_id = auth.uid() OR public.is_admin()))
);
CREATE POLICY "order_items_insert"  ON public.order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

-- Addresses: customers see own
CREATE POLICY "addresses_select"    ON public.addresses FOR SELECT USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "addresses_insert"    ON public.addresses FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "addresses_update"    ON public.addresses FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "addresses_delete"    ON public.addresses FOR DELETE USING (user_id = auth.uid());

-- Services: everyone can read active; only super_admin can write
CREATE POLICY "services_select"     ON public.services FOR SELECT USING (is_active = TRUE OR public.is_admin());
CREATE POLICY "services_insert"     ON public.services FOR INSERT WITH CHECK (public.is_super_admin());
CREATE POLICY "services_update"     ON public.services FOR UPDATE USING (public.is_super_admin());
CREATE POLICY "services_delete"     ON public.services FOR DELETE USING (public.is_super_admin());

-- Pricing: everyone can read active; only super_admin can write
CREATE POLICY "pricing_select"      ON public.pricing FOR SELECT USING (is_active = TRUE OR public.is_admin());
CREATE POLICY "pricing_insert"      ON public.pricing FOR INSERT WITH CHECK (public.is_super_admin());
CREATE POLICY "pricing_update"      ON public.pricing FOR UPDATE USING (public.is_super_admin());
CREATE POLICY "pricing_delete"      ON public.pricing FOR DELETE USING (public.is_super_admin());

-- Coupons: everyone can read active; only super_admin can write
CREATE POLICY "coupons_select"      ON public.coupons FOR SELECT USING (is_active = TRUE OR public.is_admin());
CREATE POLICY "coupons_insert"      ON public.coupons FOR INSERT WITH CHECK (public.is_super_admin());
CREATE POLICY "coupons_update"      ON public.coupons FOR UPDATE USING (public.is_super_admin());
CREATE POLICY "coupons_delete"      ON public.coupons FOR DELETE USING (public.is_super_admin());

-- Coupon usage: customers see own
CREATE POLICY "coupon_usage_select" ON public.coupon_usage FOR SELECT USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "coupon_usage_insert" ON public.coupon_usage FOR INSERT WITH CHECK (user_id = auth.uid());

-- Service areas: public read
CREATE POLICY "service_areas_select" ON public.service_areas FOR SELECT USING (is_active = TRUE OR public.is_admin());
CREATE POLICY "service_areas_write"  ON public.service_areas FOR ALL USING (public.is_super_admin());

-- Testimonials: public read
CREATE POLICY "testimonials_select"  ON public.testimonials FOR SELECT USING (TRUE);
CREATE POLICY "testimonials_write"   ON public.testimonials FOR ALL USING (public.is_super_admin());

-- Contact messages: insert by anyone; read/update by admins
CREATE POLICY "contact_insert"       ON public.contact_messages FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "contact_select_admin" ON public.contact_messages FOR SELECT USING (public.is_admin());
CREATE POLICY "contact_update_admin" ON public.contact_messages FOR UPDATE USING (public.is_admin());

-- Admin logs: admins see all; only admins insert
CREATE POLICY "admin_logs_select"    ON public.admin_activity_logs FOR SELECT USING (public.is_admin());
CREATE POLICY "admin_logs_insert"    ON public.admin_activity_logs FOR INSERT WITH CHECK (public.is_admin());

-- ============================================================
-- SEED DATA
-- ============================================================

-- Service categories
INSERT INTO public.service_categories (name, slug, sort_order) VALUES
  ('Clothing', 'clothing', 1),
  ('Home Textiles', 'home-textiles', 2),
  ('Footwear', 'footwear', 3)
ON CONFLICT (slug) DO NOTHING;

-- Services
INSERT INTO public.services (name, slug, description, turnaround_time, starting_price, icon, is_active, sort_order) VALUES
  ('Wash & Fold',       'wash-fold',        'Machine wash, dry, and neatly fold.',                                '48 Hours',  49,  'Shirt',     TRUE, 1),
  ('Dry Cleaning',      'dry-cleaning',     'Chemical-free solvent cleaning for delicate fabrics.',              '72 Hours',  149, 'Wind',      TRUE, 2),
  ('Steam Ironing',     'steam-ironing',    'Professional steam ironing for crisp, wrinkle-free garments.',     '24 Hours',  29,  'Zap',       TRUE, 3),
  ('Shoe Cleaning',     'shoe-cleaning',    'Expert cleaning and restoration for all footwear types.',          '3-5 Days',  199, 'Footprints',TRUE, 4),
  ('Curtain Cleaning',  'curtain-cleaning', 'Deep clean and freshening for all curtain fabrics.',               '3-4 Days',  99,  'Blinds',    TRUE, 5),
  ('Blanket Cleaning',  'blanket-cleaning', 'Thorough wash for blankets, quilts, and heavy bedding.',           '3-4 Days',  149, 'BedDouble', TRUE, 6)
ON CONFLICT (slug) DO NOTHING;

-- Pricing
INSERT INTO public.pricing (item_name, category, wash_fold_price, dry_clean_price, steam_iron_price, is_active) VALUES
  ('Shirt',              'Tops',          49,   149, 29,  TRUE),
  ('T-Shirt',            'Tops',          35,   99,  20,  TRUE),
  ('Jeans',              'Bottoms',       79,   199, 39,  TRUE),
  ('Trousers',           'Bottoms',       69,   179, 35,  TRUE),
  ('Saree (Cotton)',     'Ethnic Wear',   99,   249, 59,  TRUE),
  ('Saree (Silk)',       'Ethnic Wear',   NULL, 399, 79,  TRUE),
  ('Suit (2 Piece)',     'Formal',        NULL, 499, 99,  TRUE),
  ('Blazer',             'Formal',        NULL, 299, 79,  TRUE),
  ('Lehenga',            'Ethnic Wear',   NULL, 599, 149, TRUE),
  ('Kurta',              'Ethnic Wear',   79,   199, 49,  TRUE),
  ('Curtain (per panel)','Home Textiles', 99,   249, 49,  TRUE),
  ('Single Blanket',     'Home Textiles', 149,  299, NULL,TRUE),
  ('Double Blanket',     'Home Textiles', 199,  399, NULL,TRUE),
  ('Bed Sheet',          'Home Textiles', 99,   NULL,39,  TRUE),
  ('Sneakers (pair)',    'Footwear',      NULL, NULL,NULL, TRUE),
  ('Leather Shoes (pair)','Footwear',     NULL, NULL,NULL, TRUE)
ON CONFLICT DO NOTHING;

-- Service Areas
INSERT INTO public.service_areas (name, slug, city, state, pincode, coverage_info, pickup_availability, delivery_timeline, is_active) VALUES
  ('Kolkata',     'kolkata',     'Kolkata',     'West Bengal', ARRAY['700001','700002','700003'], 'Full city coverage including North, South, East, and Central Kolkata.', 'Daily: 8 AM–12 PM, 12 PM–4 PM, 4 PM–8 PM', 'Regular: 48 hrs | Dry Clean: 72 hrs | Express: Same-day', TRUE),
  ('Barrackpore', 'barrackpore', 'Barrackpore', 'West Bengal', ARRAY['700120','700121'],         'Complete Barrackpore municipality coverage.',                            'Daily: 9 AM–1 PM, 2 PM–6 PM',               'Regular: 48 hrs | Dry Clean: 72 hrs',                    TRUE),
  ('Kankinara',   'kankinara',   'Kankinara',   'West Bengal', ARRAY['743126'],                  'Covering Kankinara and adjacent areas including Jagaddal.',             'Daily: 9 AM–1 PM, 2 PM–6 PM',               'Regular: 48 hrs | Dry Clean: 72 hrs',                    TRUE),
  ('Naihati',     'naihati',     'Naihati',     'West Bengal', ARRAY['743165'],                  'Serving Naihati municipality and nearby localities.',                   'Daily: 9 AM–1 PM, 2 PM–6 PM',               'Regular: 48 hrs | Dry Clean: 72 hrs',                    TRUE),
  ('Titagarh',    'titagarh',    'Titagarh',    'West Bengal', ARRAY['700119'],                  'Complete Titagarh municipality coverage.',                              'Daily: 9 AM–1 PM, 2 PM–6 PM',               'Regular: 48 hrs | Dry Clean: 72 hrs',                    TRUE),
  ('Kalyani',     'kalyani',     'Kalyani',     'West Bengal', ARRAY['741235','741236'],         'Covering Kalyani township and all surrounding blocks.',                 'Daily: 9 AM–1 PM, 2 PM–6 PM',               'Regular: 48 hrs | Dry Clean: 72 hrs',                    TRUE)
ON CONFLICT (slug) DO NOTHING;

-- Testimonials
INSERT INTO public.testimonials (customer_name, customer_location, rating, review, is_featured) VALUES
  ('Priya Sharma',      'Kolkata, WB',     5, 'WashMate has completely changed how I manage laundry. The pickup is always on time and my sarees come back perfectly pressed.', TRUE),
  ('Rahul Bose',        'Barrackpore, WB', 5, 'I''ve tried many laundry services but WashMate is a cut above. The dry cleaning is exceptional — my suits look brand new.', TRUE),
  ('Ananya Das',        'Kalyani, WB',     5, 'Quick, reliable, and affordable. The tracking feature is great — I always know where my order is.', TRUE),
  ('Subir Ghosh',       'Naihati, WB',     5, 'The blanket cleaning service is worth every rupee. The WhatsApp support is also very responsive.', TRUE),
  ('Meena Chatterjee',  'Titagarh, WB',    5, 'I ordered shoe cleaning and was amazed. My old sneakers look almost new! The free delivery is a huge bonus.', TRUE),
  ('Amit Roy',          'Kankinara, WB',   5, 'Running a small office, I use WashMate for all formal wear. The express delivery is a lifesaver before meetings.', TRUE)
ON CONFLICT DO NOTHING;

-- Sample coupons
INSERT INTO public.coupons (code, type, value, min_order_value, max_uses, is_active) VALUES
  ('WELCOME10',   'percentage', 10,  0,   NULL, TRUE),
  ('FLAT100',     'fixed',      100, 500, 50,   TRUE),
  ('FIRSTORDER',  'percentage', 15,  0,   1,    TRUE),
  ('FREESHIP',    'free_delivery', 0, 200, NULL, TRUE)
ON CONFLICT (code) DO NOTHING;
