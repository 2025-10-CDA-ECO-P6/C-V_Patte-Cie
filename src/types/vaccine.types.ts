import { Prisma } from "@prisma/client";

export type VaccineStatus = "pending" | "administered" | "expired";

export interface Vaccine {
  vaccineId: number;
  name: String;
  administrationDate?: Date;
  vaccineStatus: VaccineStatus;
  reminderDelays: number[];
  veterinarianId: number;
  animalId?: number;
  updatedAt: Date | null;
  createdAt: Date | null;
}

export type VaccineWithRelations = Prisma.VisitGetPayload<{
  include: {
    animal: true;
    veterinarian: true;
  };
}>;

// Creat
export interface VaccineInput {
  name: String;
  administrationDate: Date;
  reason: string;
  vaccineStatus: VaccineStatus;
  reminderDelays: number[];
  animalId?: number;
  veterinarianId: number;
}

// Update
export type VaccineUpdateInput = Partial<VaccineInput>;
