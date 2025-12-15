-- =========================
-- USER
-- =========================
CREATE TABLE "user" (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL
);

-- =========================
-- OWNER
-- =========================
CREATE TABLE owner (
    owner_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(25) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    address VARCHAR(255) NOT NULL,
    user_id INTEGER NOT NULL,
    CONSTRAINT fk_owner_user
        FOREIGN KEY (user_id)
        REFERENCES "user"(user_id)
        ON DELETE CASCADE
);

-- =========================
-- VETERINARIAN
-- =========================
CREATE TABLE veterinarian (
    veterinarian_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    user_id INTEGER NOT NULL,
    CONSTRAINT fk_veterinarian_user
        FOREIGN KEY (user_id)
        REFERENCES "user"(user_id)
        ON DELETE CASCADE
);

-- =========================
-- ANIMAL
-- =========================
CREATE TABLE animal (
    animal_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    species VARCHAR(50) NOT NULL,
    breed VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    picture VARCHAR(255),
    weight NUMERIC(5,2) NOT NULL,
    gender CHAR(1) NOT NULL CHECK (gender IN ('M', 'F')),
    owner_id INTEGER NOT NULL,
    CONSTRAINT fk_animal_owner
        FOREIGN KEY (owner_id)
        REFERENCES owner(owner_id)
        ON DELETE CASCADE
);

-- =========================
-- VACCINE
-- =========================
CREATE TABLE vaccine (
    vaccine_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    administration_date DATE,
    status VARCHAR(50) NOT NULL,
    reminder_delays INT[],
    veterinarian_id INTEGER,
    animal_id INTEGER,
    CONSTRAINT fk_vaccine_veterinarian
        FOREIGN KEY (veterinarian_id)
        REFERENCES veterinarian(veterinarian_id)
        ON DELETE SET NULL,
    CONSTRAINT fk_vaccine_animal
        FOREIGN KEY (animal_id)
        REFERENCES animal(animal_id)
        ON DELETE CASCADE
);

-- =========================
-- VISIT
-- =========================
CREATE TABLE visit (
    visit_id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(50) NOT NULL,
    observation TEXT,
    veterinarian_id INTEGER NOT NULL,
    animal_id INTEGER NOT NULL,
    CONSTRAINT fk_visit_veterinarian
        FOREIGN KEY (veterinarian_id)
        REFERENCES veterinarian(veterinarian_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_visit_animal
        FOREIGN KEY (animal_id)
        REFERENCES animal(animal_id)
        ON DELETE CASCADE
);
