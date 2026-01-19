import { Prisma } from "@prisma/client";

export type Gender = "M" | "F";

export interface Animal {
  animalId: string;
  name: string;
  species: string;
  breed: string;
  dateOfBirth: Date;
  picture: string | null;
  weight: Prisma.Decimal;
  gender: Gender;
  ownerId: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export type AnimalWithRelations = Prisma.AnimalGetPayload<{
  include: {
    owner: true;
    vaccines: true;
    visits: true;
  };
}>;

export interface AnimalInput {
  name: string;
  species: string;
  breed: string;
  dateOfBirth: Date;
  picture?: string | null;
  weight: number | string | Prisma.Decimal;
  gender: Gender;
  ownerId: string;
}

export type AnimalUpdateInput = Partial<AnimalInput>;
