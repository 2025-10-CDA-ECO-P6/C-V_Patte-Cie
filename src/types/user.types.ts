import { user_role } from "@prisma/client";

export interface CreateUserDTO {
  email: string;
  password: string;
  userRole: user_role;
}
