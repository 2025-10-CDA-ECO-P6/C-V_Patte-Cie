import { Prisma } from "@prisma/client";

export interface CreateOwnerDTO {
  userId: string;
  name: string;
  phone: string;
  address: string;
}

export interface UpdateOwnerDTO {
  name?: string;
  phone?: string;
  address?: string;
}

export type OwnerWithRelations = Prisma.OwnerGetPayload<{
  include: {
    user: true;
    animals: true;
  };
}>;