import { user_role } from "@prisma/client";

export interface CreateUserDTO {
  email: string;
  password: string;
  userRole: user_role;
}

// Interface pour UPDATE - tous les champs sont optionnels (partial update)
// Note: userRole n'est pas modifiable via PATCH pour le moment
export interface UpdateUserDTO {
  email?: string;
  password?: string;
}
