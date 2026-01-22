import { Prisma, UserRole } from "@prisma/client";

// DTO pour créer un utilisateur
export interface CreateUserDTO {
  email: string;
  password: string;
  userRole: UserRole;
}

// DTO pour mettre à jour un utilisateur
export interface UpdateUserDTO {
  email?: string;
  password?: string;
}

// Type avec relations Prisma (owner + veterinarian)
export type UserWithRelations = Prisma.UserGetPayload<{
  include: { owner: true; veterinarian: true };
}>;

// Type pour pagination
export type PaginatedUsers = {
  data: UserWithRelations[];
  total: number;
};
