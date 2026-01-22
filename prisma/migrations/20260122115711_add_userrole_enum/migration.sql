/*
  Warnings:

  - Changed the type of `user_role` on the `user` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `vaccine_status` on the `vaccine` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `visit_status` on the `visit` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('owner', 'veterinarian', 'admin');

-- CreateEnum
CREATE TYPE "VisitStatus" AS ENUM ('scheduled', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "VaccineStatus" AS ENUM ('pending', 'administered', 'expired');

-- DropIndex
DROP INDEX "idx_vaccine_status";

-- DropIndex
DROP INDEX "idx_visit_status";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "user_role",
ADD COLUMN     "user_role" "UserRole" NOT NULL;

-- AlterTable
ALTER TABLE "vaccine" DROP COLUMN "vaccine_status",
ADD COLUMN     "vaccine_status" "VaccineStatus" NOT NULL;

-- AlterTable
ALTER TABLE "visit" DROP COLUMN "visit_status",
ADD COLUMN     "visit_status" "VisitStatus" NOT NULL;

-- DropEnum
DROP TYPE "user_role";

-- DropEnum
DROP TYPE "vaccine_status";

-- DropEnum
DROP TYPE "visit_status";
