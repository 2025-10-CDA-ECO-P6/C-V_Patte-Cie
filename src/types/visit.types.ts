import { Prisma } from "@prisma/client";

export type VisitStatus = "scheduled" | "completed" | "cancelled";

export interface Visit {
  visitId: number;
  date: Date;
  reason: string;
  visitStatus: VisitStatus;
  observation: string | null;
  animalId: number;
  veterinarianId: number;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export type VisitWithRelations = Prisma.VisitGetPayload<{
  include: {
    animal: true;
    veterinarian: true;
  };
}>;

// Creat
export interface VisitInput {
  date: Date;
  reason: string;
  visitStatus: VisitStatus;
  observation?: string | null;
  animalId: number;
  veterinarianId: number;
}

// Update
export type VisitUpdateInput = Partial<VisitInput>;
