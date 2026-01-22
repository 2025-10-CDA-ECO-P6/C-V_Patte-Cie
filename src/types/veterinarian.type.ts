import { Prisma } from "@prisma/client";

// DTO pour CREATE
export interface CreateVeterinarianDTO {
  userId: string; // UUID
  name: string;
  phone: string;
}

// DTO pour UPDATE 
export interface UpdateVeterinarianDTO {
  name?: string;
  phone?: string;
}

// Type avec relations pour les réponses
export type VeterinarianWithRelations = Prisma.VeterinarianGetPayload<{
  include: {
    user: true;
  };
}>;

// Pagination
export type PaginatedVets = {
  data: VeterinarianWithRelations[];
  total: number;
};
