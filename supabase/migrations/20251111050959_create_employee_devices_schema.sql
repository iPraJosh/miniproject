/*
  # Employee Test Device Management Schema

  1. New Tables
    - `employees`
      - `id` (uuid, primary key) - Unique employee identifier
      - `name` (text) - Employee full name
      - `email` (text, unique) - Employee email address
      - `department` (text) - Employee department
      - `created_at` (timestamp) - Record creation timestamp
    
    - `devices`
      - `id` (uuid, primary key) - Unique device identifier
      - `device_name` (text) - Name/model of the device
      - `device_type` (text) - Type of device (e.g., Phone, Tablet, Laptop)
      - `serial_number` (text, unique) - Device serial number
      - `employee_id` (uuid, foreign key) - Reference to employee currently assigned
      - `status` (text) - Device status (Available, Assigned, Maintenance)
      - `assigned_date` (timestamp) - Date when device was assigned
      - `notes` (text) - Additional notes about the device
      - `created_at` (timestamp) - Record creation timestamp
      - `updated_at` (timestamp) - Record update timestamp

  2. Security
    - Enable RLS on all tables
    - Add policies for public access (since no auth is specified)
    
  3. Important Notes
    - Tables use UUID primary keys for better scalability
    - Foreign key relationship ensures data integrity
    - Serial numbers are unique to prevent duplicates
    - Status field helps track device availability
*/

CREATE TABLE IF NOT EXISTS employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  department text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS devices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_name text NOT NULL,
  device_type text NOT NULL,
  serial_number text UNIQUE NOT NULL,
  employee_id uuid REFERENCES employees(id) ON DELETE SET NULL,
  status text DEFAULT 'Available',
  assigned_date timestamptz,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_devices_employee_id ON devices(employee_id);
CREATE INDEX IF NOT EXISTS idx_devices_status ON devices(status);

ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to employees"
  ON employees FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert access to employees"
  ON employees FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update access to employees"
  ON employees FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access to employees"
  ON employees FOR DELETE
  USING (true);

CREATE POLICY "Allow public read access to devices"
  ON devices FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert access to devices"
  ON devices FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update access to devices"
  ON devices FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access to devices"
  ON devices FOR DELETE
  USING (true);