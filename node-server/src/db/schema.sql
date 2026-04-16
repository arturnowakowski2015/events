CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Incidents
CREATE TABLE IF NOT EXISTS incidents (
    incident_id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date_time       TIMESTAMP NOT NULL,
    location_description TEXT,
    event_type      VARCHAR(50)
);

-- Telemetry
CREATE TABLE IF NOT EXISTS telemetry_data (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_id     UUID NOT NULL REFERENCES incidents(incident_id) ON DELETE CASCADE,
    telemetry_type  VARCHAR(20) NOT NULL,   -- 'CRASH' | 'VEHICLE'
    speed_at_impact DOUBLE PRECISION,
    g_force         DOUBLE PRECISION,
    latitude        DOUBLE PRECISION,
    longitude       DOUBLE PRECISION,
    precise_time    TIMESTAMP,
    -- VEHICLE-specific
    speed           DOUBLE PRECISION,
    rpm             DOUBLE PRECISION,
    fuel_level      DOUBLE PRECISION
);

-- Participants
CREATE TABLE IF NOT EXISTS participants (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name      VARCHAR(100) NOT NULL,
    last_name       VARCHAR(100) NOT NULL,
    personal_id     VARCHAR(50)
);

-- Vehicles
CREATE TABLE IF NOT EXISTS vehicles (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant_id          UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
    make                    VARCHAR(100),
    model                   VARCHAR(100),
    license_plate           VARCHAR(20),
    vin                     VARCHAR(50),
    insurance_policy_number VARCHAR(100)
);

-- Roles
CREATE TABLE IF NOT EXISTS roles (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_name   VARCHAR(100) NOT NULL,
    description TEXT
);

-- Participant <-> Incident (many-to-many) with roles
CREATE TABLE IF NOT EXISTS incident_participants (
    incident_id    UUID NOT NULL REFERENCES incidents(incident_id) ON DELETE CASCADE,
    participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
    PRIMARY KEY (incident_id, participant_id)
);

CREATE TABLE IF NOT EXISTS participant_roles (
    participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
    role_id        UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (participant_id, role_id)
);
