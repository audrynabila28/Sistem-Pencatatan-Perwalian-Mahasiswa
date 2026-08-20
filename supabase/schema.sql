-- Enable pgcrypto for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Clean up existing tables and types if re-running this script
DROP TABLE IF EXISTS perwalian CASCADE;
DROP TABLE IF EXISTS dosen_wali CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;

-- Enum for roles
CREATE TYPE user_role AS ENUM ('admin', 'mahasiswa', 'dosen');

-- Profiles table extending auth.users
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    role user_role NOT NULL,
    nama TEXT NOT NULL,
    nim_nip TEXT UNIQUE NOT NULL,
    prodi TEXT,
    is_default_password BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Dosen Wali mapping
CREATE TABLE dosen_wali (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mahasiswa_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    dosen_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Perwalian records
CREATE TABLE perwalian (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mahasiswa_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    dosen_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    tanggal TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    tahun_akademik TEXT NOT NULL,
    semester TEXT NOT NULL CHECK (semester IN ('Ganjil', 'Genap', 'Pendek')),
    catatan_mahasiswa TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE dosen_wali ENABLE ROW LEVEL SECURITY;
ALTER TABLE perwalian ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Profiles are viewable by everyone" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "Admin can insert profiles" ON profiles
    FOR INSERT WITH CHECK (
        auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
    );

CREATE POLICY "Admin can update profiles" ON profiles
    FOR UPDATE USING (
        auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
    );

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Dosen Wali Policies
CREATE POLICY "Dosen Wali is viewable by everyone" ON dosen_wali
    FOR SELECT USING (true);

CREATE POLICY "Admin can manage dosen wali" ON dosen_wali
    FOR ALL USING (
        auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
    );

-- Perwalian Policies
CREATE POLICY "Admin can view all perwalian" ON perwalian
    FOR SELECT USING (
        auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
    );

CREATE POLICY "Mahasiswa can view own perwalian" ON perwalian
    FOR SELECT USING (auth.uid() = mahasiswa_id);

CREATE POLICY "Mahasiswa can insert own perwalian" ON perwalian
    FOR INSERT WITH CHECK (auth.uid() = mahasiswa_id);

CREATE POLICY "Dosen can view perwalian of their mahasiswa" ON perwalian
    FOR SELECT USING (auth.uid() = dosen_id);

-- Untuk Admin pertama, Anda harus mendaftar via Supabase Auth (misal email admin@stmik.edu, pass password123)
-- lalu insert profilnya:
/*
INSERT INTO profiles (id, username, role, nama, nim_nip, is_default_password) 
VALUES ('UID_DARI_SUPABASE_AUTH', 'admin', 'admin', 'Administrator Utama', 'ADM001', false);
*/
