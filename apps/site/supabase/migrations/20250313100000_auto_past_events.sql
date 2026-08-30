-- Auto-set is_upcoming = false when event date has passed
-- Trigger runs on INSERT and UPDATE so past events get correct tag

CREATE OR REPLACE FUNCTION events_auto_set_is_upcoming()
RETURNS TRIGGER AS $$
BEGIN
  -- If event date (at midnight UTC) is before today (at midnight UTC), mark as past
  IF (NEW.date AT TIME ZONE 'UTC')::date < (CURRENT_TIMESTAMP AT TIME ZONE 'UTC')::date THEN
    NEW.is_upcoming := false;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS events_auto_past_trigger ON events;
CREATE TRIGGER events_auto_past_trigger
  BEFORE INSERT OR UPDATE OF date, is_upcoming
  ON events
  FOR EACH ROW
  EXECUTE FUNCTION events_auto_set_is_upcoming();

-- One-time: fix existing events that have passed but still have is_upcoming = true
UPDATE events
SET is_upcoming = false
WHERE (date AT TIME ZONE 'UTC')::date < (CURRENT_TIMESTAMP AT TIME ZONE 'UTC')::date
  AND is_upcoming = true;

-- RPC for admin to sync past events (call on page load; no cron needed)
CREATE OR REPLACE FUNCTION sync_past_events()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  updated_count integer;
BEGIN
  UPDATE events
  SET is_upcoming = false
  WHERE (date AT TIME ZONE 'UTC')::date < (CURRENT_TIMESTAMP AT TIME ZONE 'UTC')::date
    AND is_upcoming = true;
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$;

-- Allow authenticated users to call (API route will verify admin)
GRANT EXECUTE ON FUNCTION sync_past_events() TO authenticated;
