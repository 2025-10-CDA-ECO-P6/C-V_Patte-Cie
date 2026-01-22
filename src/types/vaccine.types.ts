import { Prisma } from "@prisma/client";

export type VaccineStatus = "pending" | "administered" | "expired";

export interface Vaccine {
  vaccineId: string;
  name: string;
  administrationDate?: Date |null;
  vaccineStatus: VaccineStatus;
  reminderDelays: number[];
  veterinarianId?: number | null;
  animalId?: string | null;
  updatedAt: Date | null;
  createdAt: Date | null;
}

export type VaccineWithRelations = Prisma.VaccineGetPayload<{
  include: {
    animal: true;
    veterinarian: true;
  };
}>;

// Creat
export interface VaccineInput {
  name: string;
  administrationDate?: Date;
  vaccineStatus: VaccineStatus;
  reminderDelays: number[];
  animalId?: string | null;
  veterinarianId?: string | null;
}

// Update
export type VaccineUpdateInput = Partial<VaccineInput>;
