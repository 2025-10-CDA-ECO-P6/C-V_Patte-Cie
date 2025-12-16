-- database/script.sql

-- ============================================
-- NETTOYAGE
-- ============================================
DROP TABLE IF EXISTS vaccine CASCADE;
DROP TABLE IF EXISTS visit CASCADE;
DROP TABLE IF EXISTS animal CASCADE;
DROP TABLE IF EXISTS veterinarian CASCADE;
DROP TABLE IF EXISTS owner CASCADE;
DROP TABLE IF EXISTS "user" CASCADE;
DROP TYPE IF EXISTS vaccine_status CASCADE;
DROP TYPE IF EXISTS visit_status CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;

-- ============================================
-- TYPES ÉNUMÉRÉS
-- ============================================
CREATE TYPE user_role AS ENUM ('owner', 'veterinarian', 'admin');
CREATE TYPE visit_status AS ENUM ('scheduled', 'completed', 'cancelled');
CREATE TYPE vaccine_status AS ENUM ('pending', 'administered', 'expired');

-- ============================================
-- TABLE USER
-- ============================================
CREATE TABLE "user" (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_role user_role NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLE OWNER
-- ============================================
CREATE TABLE owner (
    owner_id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(25) NOT NULL,
    address VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_owner_user
        FOREIGN KEY (user_id) 
        REFERENCES "user"(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- ============================================
-- TABLE VETERINARIAN
-- ============================================
CREATE TABLE veterinarian (
    veterinarian_id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(25) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_veterinarian_user
        FOREIGN KEY (user_id) 
        REFERENCES "user"(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- ============================================
-- TABLE ANIMAL
-- ============================================
CREATE TABLE animal (
    animal_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    species VARCHAR(50) NOT NULL,
    breed VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    picture VARCHAR(255),
    weight NUMERIC(6,2) NOT NULL,
    gender CHAR(1) NOT NULL,
    owner_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_animal_owner
        FOREIGN KEY (owner_id) 
        REFERENCES owner(owner_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    
    CONSTRAINT chk_animal_gender 
        CHECK (gender IN ('M', 'F')),
    
    CONSTRAINT chk_animal_weight 
        CHECK (weight > 0),
    
    CONSTRAINT chk_animal_birth_date 
        CHECK (date_of_birth <= CURRENT_DATE)
);

CREATE INDEX idx_animal_owner ON animal(owner_id);
CREATE INDEX idx_animal_species ON animal(species);
CREATE INDEX idx_animal_name ON animal(name);

-- ============================================
-- TABLE VISIT
-- ============================================
CREATE TABLE visit (
    visit_id SERIAL PRIMARY KEY,
    date TIMESTAMP NOT NULL,
    reason TEXT NOT NULL,
    visit_status visit_status NOT NULL,
    observation TEXT,
    animal_id INTEGER NOT NULL,
    veterinarian_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_visit_animal
        FOREIGN KEY (animal_id) 
        REFERENCES animal(animal_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    
    CONSTRAINT fk_visit_veterinarian
        FOREIGN KEY (veterinarian_id) 
        REFERENCES veterinarian(veterinarian_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    
    CONSTRAINT chk_visit_date 
        CHECK (date <= CURRENT_TIMESTAMP + INTERVAL '1 year')
);

CREATE INDEX idx_visit_animal ON visit(animal_id);
CREATE INDEX idx_visit_veterinarian ON visit(veterinarian_id);
CREATE INDEX idx_visit_date ON visit(date DESC);
CREATE INDEX idx_visit_status ON visit(visit_status);

COMMENT ON TABLE visit IS 'Visites et consultations vétérinaires';
COMMENT ON COLUMN visit.observation IS 'Observations et diagnostic du vétérinaire';

-- ============================================
-- TABLE VACCINE
-- ============================================
CREATE TABLE vaccine (
    vaccine_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    administration_date DATE,
    vaccine_status vaccine_status NOT NULL,
    reminder_delays INTEGER[],
    veterinarian_id INTEGER,
    animal_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_vaccine_animal
        FOREIGN KEY (animal_id) 
        REFERENCES animal(animal_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    
    CONSTRAINT fk_vaccine_veterinarian
        FOREIGN KEY (veterinarian_id) 
        REFERENCES veterinarian(veterinarian_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    
    CONSTRAINT chk_vaccine_admin_date 
        CHECK (administration_date IS NULL OR administration_date <= CURRENT_DATE)
);

CREATE INDEX idx_vaccine_animal ON vaccine(animal_id);
CREATE INDEX idx_vaccine_veterinarian ON vaccine(veterinarian_id);
CREATE INDEX idx_vaccine_status ON vaccine(vaccine_status);

COMMENT ON TABLE vaccine IS 'Vaccinations administrées ou planifiées';
COMMENT ON COLUMN vaccine.reminder_delays IS 'Délais de rappel en jours (tableau d''entiers)';

-- ============================================
-- TRIGGERS pour updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_user_updated_at
    BEFORE UPDATE ON "user"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_owner_updated_at
    BEFORE UPDATE ON owner
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_veterinarian_updated_at
    BEFORE UPDATE ON veterinarian
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_animal_updated_at
    BEFORE UPDATE ON animal
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_visit_updated_at
    BEFORE UPDATE ON visit
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_vaccine_updated_at
    BEFORE UPDATE ON vaccine
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- JEU DE DONNÉES D'EXEMPLE
-- ============================================
-- Users (mot de passe: "password123" hashé avec bcrypt)
INSERT INTO "user" (email, password_hash, user_role) VALUES
('marie.dupont@email.fr', '$2b$10$rMW8YZJQqXVhYJWZvW8YZeZvW8YZJQqXVhYJWZvW8YZeZvW8YZJQq', 'owner'),
('pierre.martin@email.fr', '$2b$10$rMW8YZJQqXVhYJWZvW8YZeZvW8YZJQqXVhYJWZvW8YZeZvW8YZJQq', 'owner'),
('sophie.bernard@email.fr', '$2b$10$rMW8YZJQqXVhYJWZvW8YZeZvW8YZJQqXVhYJWZvW8YZeZvW8YZJQq', 'owner'),
('dr.leblanc@vetclinic.fr', '$2b$10$rMW8YZJQqXVhYJWZvW8YZeZvW8YZJQqXVhYJWZvW8YZeZvW8YZJQq', 'veterinarian'),
('dr.rousseau@vetclinic.fr', '$2b$10$rMW8YZJQqXVhYJWZvW8YZeZvW8YZJQqXVhYJWZvW8YZeZvW8YZJQq', 'veterinarian'),
('dr.moreau@vetclinic.fr', '$2b$10$rMW8YZJQqXVhYJWZvW8YZeZvW8YZJQqXVhYJWZvW8YZeZvW8YZJQq', 'veterinarian');

-- Owners
INSERT INTO owner (user_id, name, phone, address) VALUES
(1, 'Marie Dupont', '0601020304', '10 rue de Paris, 75001 Paris'),
(2, 'Pierre Martin', '0605060708', '25 avenue des Champs, 69001 Lyon'),
(3, 'Sophie Bernard', '0609101112', '8 boulevard Victor Hugo, 33000 Bordeaux');

-- Veterinarians
INSERT INTO veterinarian (user_id, name, phone) VALUES
(4, 'Dr. Jean Leblanc', '0612131415'),
(5, 'Dr. Claire Rousseau', '0616171819'),
(6, 'Dr. Thomas Moreau', '0620212223');

-- Animals
INSERT INTO animal (name, species, breed, date_of_birth, weight, gender, owner_id) VALUES
('Rex', 'Chien', 'Berger Allemand', '2019-05-15', 32.5, 'M', 1),
('Minou', 'Chat', 'Persan', '2020-08-20', 4.2, 'F', 1),
('Luna', 'Chien', 'Golden Retriever', '2021-03-10', 28.0, 'F', 2),
('Felix', 'Chat', 'Siamois', '2018-12-05', 3.8, 'M', 3),
('Bella', 'Chien', 'Labrador', '2022-01-18', 25.5, 'F', 2),
('Whiskers', 'Chat', 'Maine Coon', '2020-06-22', 6.8, 'M', 3);

-- Visits
INSERT INTO visit (date, reason, visit_status, observation, animal_id, veterinarian_id) VALUES
('2025-12-10 09:00:00', 'Contrôle annuel', 'completed', 'Animal en bonne santé générale.', 1, 1),
('2025-12-12 14:30:00', 'Problème de peau', 'completed', 'Dermatite allergique.', 4, 3),
('2025-12-18 10:00:00', 'Vaccination annuelle', 'scheduled', NULL, 3, 1),
('2025-12-20 15:00:00', 'Contrôle post-opératoire', 'scheduled', NULL, 5, 2);

-- Vaccines
INSERT INTO vaccine (name, administration_date, vaccine_status, reminder_delays, animal_id, veterinarian_id) VALUES
('Rage', '2025-01-15', 'administered', ARRAY[330, 350, 365], 1, 1),
('DHPP', '2025-01-15', 'administered', ARRAY[330, 350, 365], 1, 1),
('Leucose féline', '2025-03-20', 'administered', ARRAY[330, 350, 365], 2, 1),
('DHPP', NULL, 'pending', ARRAY[7, 14, 21], 5, NULL);

-- ============================================
-- VUES UTILES
-- ============================================
CREATE VIEW v_animal_full AS
SELECT 
    a.animal_id,
    a.name AS animal_name,
    a.species,
    a.breed,
    a.date_of_birth,
    a.weight,
    a.gender,
    EXTRACT(YEAR FROM AGE(CURRENT_DATE, a.date_of_birth))::INTEGER AS age_years,
    o.owner_id,
    o.name AS owner_name,
    o.phone AS owner_phone,
    o.address AS owner_address,
    u.email AS owner_email
FROM animal a
JOIN owner o ON a.owner_id = o.owner_id
JOIN "user" u ON o.user_id = u.user_id;

CREATE VIEW v_upcoming_visits AS
SELECT 
    v.visit_id,
    v.date,
    v.reason,
    a.name AS animal_name,
    a.species,
    o.name AS owner_name,
    o.phone AS owner_phone,
    vet.name AS veterinarian_name
FROM visit v
JOIN animal a ON v.animal_id = a.animal_id
JOIN owner o ON a.owner_id = o.owner_id
JOIN veterinarian vet ON v.veterinarian_id = vet.veterinarian_id
WHERE v.visit_status = 'scheduled'
  AND v.date >= CURRENT_TIMESTAMP
ORDER BY v.date;