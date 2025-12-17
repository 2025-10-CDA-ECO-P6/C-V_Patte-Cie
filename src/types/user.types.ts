import { user_role } from "@prisma/client";

export interface CreateUserDTO {
  email: string;
  passwordHash: string;
  userRole: user_role;
}
