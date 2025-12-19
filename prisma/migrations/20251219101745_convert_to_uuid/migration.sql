-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('owner', 'veterinarian', 'admin');

-- CreateEnum
CREATE TYPE "VisitStatus" AS ENUM ('scheduled', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "VaccineStatus" AS ENUM ('pending', 'administered', 'expired');

-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('owner', 'veterinarian', 'admin');

-- CreateEnum
CREATE TYPE "vaccine_status" AS ENUM ('pending', 'administered', 'expired');

-- CreateEnum
CREATE TYPE "visit_status" AS ENUM ('scheduled', 'completed', 'cancelled');

-- CreateTable
CREATE TABLE "user" (
    "user_id" UUID NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "user_role" "user_role" NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "owner" (
    "owner_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(25) NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "owner_pkey" PRIMARY KEY ("owner_id")
);

-- CreateTable
CREATE TABLE "veterinarian" (
    "veterinarian_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(25) NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "veterinarian_pkey" PRIMARY KEY ("veterinarian_id")
);

-- CreateTable
CREATE TABLE "animal" (
    "animal_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "species" VARCHAR(50) NOT NULL,
    "breed" VARCHAR(100) NOT NULL,
    "date_of_birth" DATE NOT NULL,
    "picture" VARCHAR(255),
    "weight" DECIMAL(6,2) NOT NULL,
    "gender" CHAR(1) NOT NULL,
    "owner_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "animal_pkey" PRIMARY KEY ("animal_id")
);

-- CreateTable
CREATE TABLE "visit" (
    "visit_id" UUID NOT NULL,
    "date" TIMESTAMP(6) NOT NULL,
    "reason" TEXT NOT NULL,
    "visit_status" "visit_status" NOT NULL,
    "observation" TEXT,
    "animal_id" UUID NOT NULL,
    "veterinarian_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "visit_pkey" PRIMARY KEY ("visit_id")
);

-- CreateTable
CREATE TABLE "vaccine" (
    "vaccine_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "administration_date" DATE,
    "vaccine_status" "vaccine_status" NOT NULL,
    "reminder_delays" INTEGER[],
    "veterinarian_id" UUID,
    "animal_id" UUID,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vaccine_pkey" PRIMARY KEY ("vaccine_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "owner_user_id_key" ON "owner"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "veterinarian_user_id_key" ON "veterinarian"("user_id");

-- CreateIndex
CREATE INDEX "idx_animal_owner" ON "animal"("owner_id");

-- CreateIndex
CREATE INDEX "idx_animal_species" ON "animal"("species");

-- CreateIndex
CREATE INDEX "idx_animal_name" ON "animal"("name");

-- CreateIndex
CREATE INDEX "idx_visit_animal" ON "visit"("animal_id");

-- CreateIndex
CREATE INDEX "idx_visit_veterinarian" ON "visit"("veterinarian_id");

-- CreateIndex
CREATE INDEX "idx_visit_date" ON "visit"("date" DESC);

-- CreateIndex
CREATE INDEX "idx_visit_status" ON "visit"("visit_status");

-- CreateIndex
CREATE INDEX "idx_vaccine_animal" ON "vaccine"("animal_id");

-- CreateIndex
CREATE INDEX "idx_vaccine_veterinarian" ON "vaccine"("veterinarian_id");

-- CreateIndex
CREATE INDEX "idx_vaccine_status" ON "vaccine"("vaccine_status");

-- AddForeignKey
ALTER TABLE "owner" ADD CONSTRAINT "fk_owner_user" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "veterinarian" ADD CONSTRAINT "fk_veterinarian_user" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "animal" ADD CONSTRAINT "fk_animal_owner" FOREIGN KEY ("owner_id") REFERENCES "owner"("owner_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visit" ADD CONSTRAINT "fk_visit_animal" FOREIGN KEY ("animal_id") REFERENCES "animal"("animal_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visit" ADD CONSTRAINT "fk_visit_veterinarian" FOREIGN KEY ("veterinarian_id") REFERENCES "veterinarian"("veterinarian_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vaccine" ADD CONSTRAINT "fk_vaccine_animal" FOREIGN KEY ("animal_id") REFERENCES "animal"("animal_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vaccine" ADD CONSTRAINT "fk_vaccine_veterinarian" FOREIGN KEY ("veterinarian_id") REFERENCES "veterinarian"("veterinarian_id") ON DELETE SET NULL ON UPDATE CASCADE;
