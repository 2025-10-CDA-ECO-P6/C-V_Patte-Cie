import { Prisma } from "@prisma/client";

export type VisitStatus = "scheduled" | "completed" | "cancelled";

export interface Visit {
  visitId: string;
  date: Date;
  reason: string;
  visitStatus: VisitStatus;
  observation: string | null;
  animalId: string;
  veterinarianId: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export type VisitWithRelations = Prisma.VisitGetPayload<{
  include: {
    animal: true;
    veterinarian: true;
  };
}>;

// Create
export interface VisitInput {
  date: Date;
  reason: string;
  visitStatus: VisitStatus;
  observation?: string | null;
  animalId: string;
  veterinarianId: string;
}

// Update
export type VisitUpdateInput = Partial<VisitInput>;
