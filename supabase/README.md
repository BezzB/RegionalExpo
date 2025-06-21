# Supabase SQL Functions

These SQL functions need to be executed in the Supabase SQL Editor to fix the RLS (Row Level Security) issues with the admin dashboard.

## Problem

The application is encountering an "infinite recursion" error in the RLS policies, particularly when accessing the `admin_users` table. This is likely caused by circular references in the RLS policies.

## Solution

We're using SQL functions with `SECURITY DEFINER` to bypass RLS completely for admin operations. This approach is safer than disabling RLS entirely.

## Installation Instructions

1. Go to your [Supabase Dashboard](https://app.supabase.io)
2. Select your project
3. Go to the SQL Editor
4. Copy and paste each SQL function and execute them:

### 1. Function to get all events

```sql
CREATE OR REPLACE FUNCTION get_all_events()
RETURNS SETOF public.events
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY SELECT * FROM public.events ORDER BY start_date DESC;
END;
$$
LANGUAGE plpgsql;
```

### 2. Function to count rows in any table

```sql
CREATE OR REPLACE FUNCTION count_table_rows(table_name text) 
RETURNS json
SECURITY DEFINER
AS $$
DECLARE
  result integer;
  query text;
BEGIN
  -- Sanitize table name to prevent SQL injection
  IF table_name !~ '^[a-zA-Z0-9_]+$' THEN
    RAISE EXCEPTION 'Invalid table name';
  END IF;
  
  -- Construct and execute dynamic SQL
  query := 'SELECT COUNT(*) FROM public.' || quote_ident(table_name);
  EXECUTE query INTO result;
  
  -- Return as JSON with count key
  RETURN json_build_object('count', result);
END;
$$
LANGUAGE plpgsql;
```

### 3. Function to get paginated events

```sql
CREATE OR REPLACE FUNCTION get_paginated_events(
  page_size integer,
  page_number integer
)
RETURNS TABLE (
  id uuid,
  title text,
  description text,
  date date,
  time time,
  location text,
  capacity integer,
  category text,
  image_url text,
  created_at timestamptz
)
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    e.id,
    e.title,
    e.description,
    e.date,
    e.time,
    e.location,
    e.capacity,
    e.category,
    e.image_url,
    e.created_at
  FROM public.events e
  ORDER BY e.date ASC
  LIMIT page_size
  OFFSET (page_number - 1) * page_size;
END;
$$
LANGUAGE plpgsql;
```

### 4. Function to count total events

```sql
CREATE OR REPLACE FUNCTION count_events()
RETURNS integer
SECURITY DEFINER
AS $$
BEGIN
  RETURN (SELECT COUNT(*) FROM public.events);
END;
$$
LANGUAGE plpgsql;
```

### 5. Add Row Level Security Policies

```sql
-- Enable RLS for all tables
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON events;
DROP POLICY IF EXISTS "Allow read access for anonymous users" ON events;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON gallery;
DROP POLICY IF EXISTS "Allow read access for anonymous users" ON gallery;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON sponsors;
DROP POLICY IF EXISTS "Allow read access for anonymous users" ON sponsors;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON testimonials;
DROP POLICY IF EXISTS "Allow read access for anonymous users" ON testimonials;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON contacts;
DROP POLICY IF EXISTS "Allow read access for anonymous users" ON contacts;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON newsletter;
DROP POLICY IF EXISTS "Allow read access for anonymous users" ON newsletter;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON registrations;
DROP POLICY IF EXISTS "Allow read access for anonymous users" ON registrations;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON admin_users;
DROP POLICY IF EXISTS "Allow read access for anonymous users" ON admin_users;

-- Create policies for events
CREATE POLICY "Allow all operations for authenticated users" ON events
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow read access for anonymous users" ON events
    FOR SELECT
    TO anon
    USING (true);

-- Create policies for gallery
CREATE POLICY "Allow all operations for authenticated users" ON gallery
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow read access for anonymous users" ON gallery
    FOR SELECT
    TO anon
    USING (true);

-- Create policies for sponsors
CREATE POLICY "Allow all operations for authenticated users" ON sponsors
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow read access for anonymous users" ON sponsors
    FOR SELECT
    TO anon
    USING (true);

-- Create policies for testimonials
CREATE POLICY "Allow all operations for authenticated users" ON testimonials
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow read access for anonymous users" ON testimonials
    FOR SELECT
    TO anon
    USING (is_approved = true);

-- Create policies for contacts
CREATE POLICY "Allow all operations for authenticated users" ON contacts
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow insert for anonymous users" ON contacts
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Create policies for newsletter
CREATE POLICY "Allow all operations for authenticated users" ON newsletter
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow insert for anonymous users" ON newsletter
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Create policies for registrations
CREATE POLICY "Allow all operations for authenticated users" ON registrations
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow insert for anonymous users" ON registrations
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Create policies for admin_users
CREATE POLICY "Allow all operations for authenticated users" ON admin_users
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
```

## Security Note

These functions use `SECURITY DEFINER` which means they execute with the permissions of the database owner/creator, bypassing RLS. This is secure as long as:

1. The functions are carefully written to prevent SQL injection
2. The application code properly authenticates users before allowing them to call these functions

## Alternative Approach

If you prefer to fix the RLS policies directly instead of using these functions, you'll need to:

1. Check `admin_users` table for any policies that could create circular references
2. Drop and recreate problematic policies
3. Ensure `admin_users` has a simple RLS policy that doesn't cause infinite recursion 