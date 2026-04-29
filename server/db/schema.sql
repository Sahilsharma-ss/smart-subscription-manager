CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(30),
  currency VARCHAR(10) DEFAULT 'INR',
  timezone VARCHAR(60),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
  category_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  risk_level VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS services (
  service_id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL UNIQUE,
  description TEXT,
  logo_url TEXT,
  website TEXT,
  category_id INT REFERENCES categories(category_id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS subscription_plans (
  plan_id SERIAL PRIMARY KEY,
  service_id INT REFERENCES services(service_id) ON DELETE CASCADE,
  plan_name VARCHAR(120) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  billing_cycle VARCHAR(20) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (service_id, plan_name)
);

CREATE TABLE IF NOT EXISTS subscriptions (
  subscription_id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  service_id INT REFERENCES services(service_id),
  plan_id INT REFERENCES subscription_plans(plan_id),
  category_id INT REFERENCES categories(category_id),
  start_date DATE,
  renewal_date DATE NOT NULL,
  billing_cycle VARCHAR(20) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'INR',
  status VARCHAR(20) DEFAULT 'active',
  auto_renew BOOLEAN DEFAULT true,
  importance_level VARCHAR(20) DEFAULT 'medium',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_status ON subscriptions(user_id, status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_renewal ON subscriptions(user_id, renewal_date);

CREATE TABLE IF NOT EXISTS alerts (
  alert_id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  subscription_id INT REFERENCES subscriptions(subscription_id) ON DELETE CASCADE,
  alert_type VARCHAR(50) NOT NULL,
  alert_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notifications (
  notification_id SERIAL PRIMARY KEY,
  alert_id INT REFERENCES alerts(alert_id) ON DELETE CASCADE,
  user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  channel VARCHAR(20) DEFAULT 'in-app',
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) DEFAULT 'unread'
);

CREATE TABLE IF NOT EXISTS usage_logs (
  usage_id SERIAL PRIMARY KEY,
  subscription_id INT REFERENCES subscriptions(subscription_id) ON DELETE CASCADE,
  usage_date DATE NOT NULL,
  usage_type VARCHAR(50) NOT NULL,
  usage_value VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_usage_logs_subscription_date ON usage_logs(subscription_id, usage_date DESC);
CREATE INDEX IF NOT EXISTS idx_usage_logs_survey_lookup ON usage_logs(subscription_id, usage_type, usage_value, usage_date DESC);

INSERT INTO categories (name, description, risk_level)
VALUES
  ('Entertainment', 'Streaming and media services', 'medium'),
  ('Cloud', 'Cloud infrastructure and storage', 'high'),
  ('Utilities', 'Utility and connectivity subscriptions', 'medium'),
  ('Productivity', 'Work and productivity tools', 'low'),
  ('Health', 'Wellness and fitness subscriptions', 'low'),
  ('Finance', 'Finance and banking services', 'high'),
  ('Education', 'Learning and courses', 'low'),
  ('Gaming', 'Games and gaming platforms', 'medium')
ON CONFLICT (name) DO NOTHING;

INSERT INTO services (name, description, website, category_id)
VALUES
  ('Netflix', 'Streaming movies and series', 'https://netflix.com', (SELECT category_id FROM categories WHERE name = 'Entertainment')),
  ('Spotify', 'Music streaming', 'https://spotify.com', (SELECT category_id FROM categories WHERE name = 'Entertainment')),
  ('Amazon Prime', 'Prime video and benefits', 'https://primevideo.com', (SELECT category_id FROM categories WHERE name = 'Entertainment')),
  ('YouTube Premium', 'Ad-free video streaming', 'https://youtube.com', (SELECT category_id FROM categories WHERE name = 'Entertainment')),
  ('AWS', 'Cloud infrastructure', 'https://aws.amazon.com', (SELECT category_id FROM categories WHERE name = 'Cloud')),
  ('Google Cloud', 'Cloud services', 'https://cloud.google.com', (SELECT category_id FROM categories WHERE name = 'Cloud')),
  ('Adobe', 'Creative suite', 'https://adobe.com', (SELECT category_id FROM categories WHERE name = 'Productivity')),
  ('GitHub', 'Developer collaboration', 'https://github.com', (SELECT category_id FROM categories WHERE name = 'Productivity')),
  ('Notion', 'Workspace for teams', 'https://notion.so', (SELECT category_id FROM categories WHERE name = 'Productivity')),
  ('Figma', 'Design collaboration', 'https://figma.com', (SELECT category_id FROM categories WHERE name = 'Productivity')),
  ('Disney+', 'Streaming service', 'https://disneyplus.com', (SELECT category_id FROM categories WHERE name = 'Entertainment')),
  ('Apple Music', 'Music streaming', 'https://music.apple.com', (SELECT category_id FROM categories WHERE name = 'Entertainment'))
ON CONFLICT (name) DO NOTHING;

INSERT INTO subscription_plans (service_id, plan_name, price, billing_cycle, description)
SELECT service_id, 'Basic', 199.00, 'monthly', 'Basic tier'
FROM services
ON CONFLICT DO NOTHING;

INSERT INTO subscription_plans (service_id, plan_name, price, billing_cycle, description)
SELECT service_id, 'Standard', 499.00, 'monthly', 'Standard tier'
FROM services
ON CONFLICT DO NOTHING;

INSERT INTO subscription_plans (service_id, plan_name, price, billing_cycle, description)
SELECT service_id, 'Premium', 899.00, 'monthly', 'Premium tier'
FROM services
ON CONFLICT DO NOTHING;
