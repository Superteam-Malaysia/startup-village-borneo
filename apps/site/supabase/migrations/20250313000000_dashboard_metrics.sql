-- Dashboard metrics for admin-editable values (GDP, grants, etc.)
CREATE TABLE IF NOT EXISTS dashboard_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_key TEXT NOT NULL,
  value NUMERIC NOT NULL DEFAULT 0,
  period TEXT NOT NULL DEFAULT 'overall', -- 'overall' | 'this_month'
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT dashboard_metrics_key_period_unique UNIQUE(metric_key, period)
);

-- Add attendee_count to events for manual entry
ALTER TABLE events ADD COLUMN IF NOT EXISTS attendee_count INTEGER;

-- Seed default dashboard metric keys (admins can update via UI later)
INSERT INTO dashboard_metrics (metric_key, value, period) VALUES
  ('gdp_brought_malaysia', 0, 'overall'),
  ('gdp_brought_malaysia', 0, 'this_month'),
  ('grants_awarded', 0, 'overall'),
  ('grants_awarded', 0, 'this_month'),
  ('bounties_awarded', 0, 'overall'),
  ('bounties_awarded', 0, 'this_month')
ON CONFLICT ON CONSTRAINT dashboard_metrics_key_period_unique DO NOTHING;

-- RLS
ALTER TABLE dashboard_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read dashboard_metrics" ON dashboard_metrics FOR SELECT USING (true);
CREATE POLICY "Admin write dashboard_metrics" ON dashboard_metrics FOR ALL USING (
  public.get_user_role() IN ('super_admin', 'admin')
);
