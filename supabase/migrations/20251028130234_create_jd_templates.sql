/*
  # Create JD Templates Schema

  1. New Tables
    - `jd_templates`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `name` (text, template name)
      - `content` (text, rich text content)
      - `description` (text, optional description)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `jd_templates` table
    - Add policy for authenticated users to read their own templates
    - Add policy for authenticated users to create templates
    - Add policy for authenticated users to update their own templates
    - Add policy for authenticated users to delete their own templates

  3. Indexes
    - Add index on user_id for faster queries
    - Add index on name for search functionality
*/

CREATE TABLE IF NOT EXISTS jd_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  content text DEFAULT '',
  description text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE jd_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own templates"
  ON jd_templates FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create templates"
  ON jd_templates FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own templates"
  ON jd_templates FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own templates"
  ON jd_templates FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS jd_templates_user_id_idx ON jd_templates(user_id);
CREATE INDEX IF NOT EXISTS jd_templates_name_idx ON jd_templates(name);