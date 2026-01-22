import * as userRepo from "../repositories/user.repository";
import { CreateUserDTO, PaginatedUsers, UpdateUserDTO, UserWithRelations } from "../types/user.types";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt.utils";
import ErrorException from "../types/errorException";

// CREATE
export const createNewUser = async (userData: CreateUserDTO) => {
  if (!/^[\w.-]+@[\w.-]+\.\w{2,}$/.test(userData.email)) {
    throw new ErrorException(400, "Invalid email format");
  }

  if (!userData.password || userData.password.length < 8) {
    throw new ErrorException(400, "Password must be at least 8 characters");
  }

  const existingUser = await userRepo.getUserByEmail(userData.email);
  if (existingUser) throw new ErrorException(409, "Email already exists");

  const hashedPassword = await bcrypt.hash(userData.password, 10);

  const user = await userRepo.createUser({
    email: userData.email,
    passwordHash: hashedPassword,
    userRole: userData.userRole,
    createdAt: new Date(),
  });

  const { passwordHash, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// LOGIN
export const loginUser = async (email: string, password: string) => {
  const user = await userRepo.getUserByEmail(email);
  if (!user) throw new ErrorException(401, "Invalid credentials");

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) throw new ErrorException(401, "Invalid credentials");

  return generateToken({ userId: user.userId, email: user.email, userRole: user.userRole });
};

// READ ALL (pagination)
export const fetchAllUsers = async (page = 1, pageSize = 25): Promise<PaginatedUsers> => {
  const users = await userRepo.getAllUsers(page, pageSize);
  const total = await userRepo.countUsers();
  return { data: users, total };
};

// READ BY ID
export const fetchByIdUser = async (userId: string): Promise<UserWithRelations> => {
  const user = await userRepo.getByIdUser(userId);
  if (!user) throw new ErrorException(404, "User not found");
  return user;
};

// UPDATE
export const updateUserById = async (userId: string, userData: UpdateUserDTO) => {
  const existingUser = await userRepo.getByIdUser(userId);
  if (!existingUser) throw new ErrorException(404, "User not found");

  const updateData: { email?: string; passwordHash?: string } = {};

  if (userData.email) {
    if (!/^[\w.-]+@[\w.-]+\.\w{2,}$/.test(userData.email)) {
      throw new ErrorException(400, "Invalid email format");
    }
    const emailExists = await userRepo.getUserByEmail(userData.email);
    if (emailExists && emailExists.userId !== userId) {
      throw new ErrorException(409, "Email already exists");
    }
    updateData.email = userData.email;
  }

  if (userData.password) {
    if (userData.password.length < 8) throw new ErrorException(400, "Password too short");
    updateData.passwordHash = await bcrypt.hash(userData.password, 10);
  }

  return userRepo.updateUser(userId, updateData);
};

// DELETE
export const deleteUserById = async (userId: string) => {
  const user = await userRepo.getByIdUser(userId);
  if (!user) throw new ErrorException(404, "User not found");

  await userRepo.deleteUser(userId);
  return { message: "User successfully deleted" };
};
