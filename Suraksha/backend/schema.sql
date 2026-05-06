-- Supabase Schema for Suraksha

CREATE TABLE devices (
    device_id TEXT PRIMARY KEY,
    owner_name TEXT,
    fcm_token TEXT,
    role TEXT CHECK (role IN ('tracked', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE location_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id TEXT REFERENCES devices(device_id),
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    accuracy DOUBLE PRECISION,
    mode TEXT CHECK (mode IN ('cell', 'gps', 'background')),
    battery_level INTEGER,
    is_moving BOOLEAN,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE geofences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id TEXT REFERENCES devices(device_id),
    center_lat DOUBLE PRECISION NOT NULL,
    center_lng DOUBLE PRECISION NOT NULL,
    radius_meters DOUBLE PRECISION NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id TEXT REFERENCES devices(device_id),
    type TEXT CHECK (type IN ('sos', 'geofence', 'fall', 'digest', 'checkin', 'not_safe', 'call_request', 'emergency')),
    payload JSONB,
    sent_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE checkins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id TEXT REFERENCES devices(device_id),
    status TEXT CHECK (status IN ('ok', 'missed')),
    date DATE DEFAULT CURRENT_DATE
);
