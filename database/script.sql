-- ============================================
-- EXTENSION
-- ============================================
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================
-- NETTOYAGE
-- ============================================
DROP TABLE IF EXISTS vaccine CASCADE;
DROP TABLE IF EXISTS visit CASCADE;
DROP TABLE IF EXISTS animal CASCADE;
DROP TABLE IF EXISTS veterinarian CASCADE;
DROP TABLE IF EXISTS owner CASCADE;
DROP TABLE IF EXISTS "user" CASCADE;

DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS visit_status CASCADE;
DROP TYPE IF EXISTS vaccine_status CASCADE;

-- ============================================
-- ENUMS
-- ============================================
CREATE TYPE user_role AS ENUM ('owner', 'veterinarian', 'admin');
CREATE TYPE visit_status AS ENUM ('scheduled', 'completed', 'cancelled');
CREATE TYPE vaccine_status AS ENUM ('pending', 'administered', 'expired');

-- ============================================
-- USER
-- ============================================
CREATE TABLE "user" (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  user_role user_role NOT NULL,
  created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- OWNER
-- ============================================
CREATE TABLE owner (
  owner_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(25) NOT NULL,
  address VARCHAR(255) NOT NULL,
  created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_owner_user
    FOREIGN KEY (user_id)
    REFERENCES "user"(user_id)
    ON DELETE CASCADE
);

-- ============================================
-- VETERINARIAN
-- ============================================
CREATE TABLE veterinarian (
  veterinarian_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(25) NOT NULL,
  created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_veterinarian_user
    FOREIGN KEY (user_id)
    REFERENCES "user"(user_id)
    ON DELETE CASCADE
);

-- ============================================
-- ANIMAL
-- ============================================
CREATE TABLE animal (
  animal_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  species VARCHAR(50) NOT NULL,
  breed VARCHAR(100) NOT NULL,
  date_of_birth DATE NOT NULL,
  picture VARCHAR(255),
  weight DECIMAL(6,2) NOT NULL,
  gender CHAR(1) NOT NULL,
  owner_id UUID NOT NULL,
  created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_animal_owner
    FOREIGN KEY (owner_id)
    REFERENCES owner(owner_id)
    ON DELETE CASCADE,

  CONSTRAINT chk_animal_gender CHECK (gender IN ('M', 'F')),
  CONSTRAINT chk_animal_weight CHECK (weight > 0),
  CONSTRAINT chk_animal_birth_date CHECK (date_of_birth <= CURRENT_DATE)
);

CREATE INDEX idx_animal_owner ON animal(owner_id);
CREATE INDEX idx_animal_species ON animal(species);
CREATE INDEX idx_animal_name ON animal(name);

-- ============================================
-- VISIT
-- ============================================
CREATE TABLE visit (
  visit_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date TIMESTAMP(6) NOT NULL,
  reason TEXT NOT NULL,
  visit_status visit_status NOT NULL,
  observation TEXT,
  animal_id UUID NOT NULL,
  veterinarian_id UUID NOT NULL,
  created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_visit_animal
    FOREIGN KEY (animal_id)
    REFERENCES animal(animal_id)
    ON DELETE CASCADE,

  CONSTRAINT fk_visit_veterinarian
    FOREIGN KEY (veterinarian_id)
    REFERENCES veterinarian(veterinarian_id)
);

CREATE INDEX idx_visit_animal ON visit(animal_id);
CREATE INDEX idx_visit_veterinarian ON visit(veterinarian_id);
CREATE INDEX idx_visit_date ON visit(date DESC);
CREATE INDEX idx_visit_status ON visit(visit_status);

-- ============================================
-- VACCINE
-- ============================================
CREATE TABLE vaccine (
  vaccine_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  administration_date DATE,
  vaccine_status vaccine_status NOT NULL,
  reminder_delays INTEGER[] NOT NULL,
  veterinarian_id UUID,
  animal_id UUID,
  created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_vaccine_animal
    FOREIGN KEY (animal_id)
    REFERENCES animal(animal_id)
    ON DELETE SET NULL,

  CONSTRAINT fk_vaccine_veterinarian
    FOREIGN KEY (veterinarian_id)
    REFERENCES veterinarian(veterinarian_id)
    ON DELETE SET NULL,

  CONSTRAINT chk_vaccine_admin_date
    CHECK (administration_date IS NULL OR administration_date <= CURRENT_DATE)
);

CREATE INDEX idx_vaccine_animal ON vaccine(animal_id);
CREATE INDEX idx_vaccine_veterinarian ON vaccine(veterinarian_id);
CREATE INDEX idx_vaccine_status ON vaccine(vaccine_status);
