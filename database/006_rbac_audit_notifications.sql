-- Canonical role system + audit + notifications
-- Roles in public.users.role: hr | manager | staff
-- Global platform admins are represented by users.is_super_admin = true.

BEGIN;

-- 1) Normalize legacy roles
UPDATE public.users
SET role = 'hr'
WHERE role IN ('admin', 'supervisor');

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'staff_users'
  ) THEN
    EXECUTE $$UPDATE public.staff_users SET role = 'hr' WHERE role IN ('admin', 'supervisor')$$;
  END IF;
END $$;

-- 2) Enforce canonical role check on public.users
ALTER TABLE public.users
  DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE public.users
  ADD CONSTRAINT users_role_check
  CHECK (role IN ('hr', 'manager', 'staff'));

-- 3) RBAC helper functions for RLS/policies
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT u.role
  FROM public.users u
  WHERE u.user_id = auth.uid()
  LIMIT 1
$$;

CREATE OR REPLACE FUNCTION public.current_user_is_super_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE((
    SELECT u.is_super_admin
    FROM public.users u
    WHERE u.user_id = auth.uid()
    LIMIT 1
  ), false)
$$;

-- 4) Professional audit log table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  audit_log_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id text NULL,
  actor_user_id uuid NULL,
  action text NOT NULL,
  target_type text NULL,
  target_id text NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_organization_id ON public.audit_logs(organization_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS audit_logs_select_policy ON public.audit_logs;
CREATE POLICY audit_logs_select_policy
ON public.audit_logs
FOR SELECT
USING (
  public.current_user_is_super_admin()
  OR (
    organization_id IN (
      SELECT u.organization_id
      FROM public.users u
      WHERE u.user_id = auth.uid()
      LIMIT 1
    )
    AND public.current_user_role() = 'hr'
  )
);

DROP POLICY IF EXISTS audit_logs_insert_policy ON public.audit_logs;
CREATE POLICY audit_logs_insert_policy
ON public.audit_logs
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- 5) Notification outbox table for in-app + email fanout
CREATE TABLE IF NOT EXISTS public.notification_outbox (
  notification_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id text NULL,
  recipient_user_id uuid NULL,
  recipient_email text NULL,
  type text NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  channels text[] NOT NULL DEFAULT ARRAY['in_app']::text[],
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  sent_at timestamptz NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notification_outbox_created_at ON public.notification_outbox(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notification_outbox_recipient_user_id ON public.notification_outbox(recipient_user_id);
CREATE INDEX IF NOT EXISTS idx_notification_outbox_recipient_email ON public.notification_outbox(recipient_email);
CREATE INDEX IF NOT EXISTS idx_notification_outbox_status ON public.notification_outbox(status);

ALTER TABLE public.notification_outbox ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS notification_outbox_select_policy ON public.notification_outbox;
CREATE POLICY notification_outbox_select_policy
ON public.notification_outbox
FOR SELECT
USING (
  public.current_user_is_super_admin()
  OR recipient_user_id = auth.uid()
  OR organization_id IN (
    SELECT u.organization_id
    FROM public.users u
    WHERE u.user_id = auth.uid()
    LIMIT 1
  )
);

DROP POLICY IF EXISTS notification_outbox_insert_policy ON public.notification_outbox;
CREATE POLICY notification_outbox_insert_policy
ON public.notification_outbox
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- 6) Domain events queue (event-driven processing)
CREATE TABLE IF NOT EXISTS public.domain_events (
  event_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id text NULL,
  actor_user_id uuid NULL,
  event_type text NOT NULL,
  aggregate_type text NULL,
  aggregate_id text NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'failed')),
  processed_at timestamptz NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_domain_events_status ON public.domain_events(status);
CREATE INDEX IF NOT EXISTS idx_domain_events_created_at ON public.domain_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_domain_events_org ON public.domain_events(organization_id);

ALTER TABLE public.domain_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS domain_events_select_policy ON public.domain_events;
CREATE POLICY domain_events_select_policy
ON public.domain_events
FOR SELECT
USING (public.current_user_is_super_admin());

DROP POLICY IF EXISTS domain_events_insert_policy ON public.domain_events;
CREATE POLICY domain_events_insert_policy
ON public.domain_events
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS domain_events_update_policy ON public.domain_events;
CREATE POLICY domain_events_update_policy
ON public.domain_events
FOR UPDATE
USING (public.current_user_is_super_admin())
WITH CHECK (public.current_user_is_super_admin());

COMMIT;
