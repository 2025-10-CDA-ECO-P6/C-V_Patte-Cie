import * as userRepo from "../repositories/user.repository";
import { CreateUserDTO, UpdateUserDTO } from "../types/user.types";
import { generateToken } from "../utils/jwt.utils";
import bcrypt from 'bcrypt';
import "../types/errorException";

// login
export const loginUser = async (email: string, password: string) => {
  const user = await userRepo.getUserByEmail(email);

  if (!user) {
    throw new ErrorException(401, "Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new ErrorException(401, "Invalid credentials");
  }

  return generateToken({
    userId: user.userId,
    email: user.email,
    userRole: user.userRole,
  });
};

// create
export const createNewUser = async (userData: CreateUserDTO) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(userData.email)) {
    throw new ErrorException(400, "Invalid email format");
  }

  if (!userData.password || userData.password.length < 8) {
    throw new ErrorException(400, "Password must be at least 8 characters long");
  }

  const existingUser = await userRepo.getUserByEmail(userData.email);
  if (existingUser) {
    throw new ErrorException(409, "Email already exists");
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

  const user = await userRepo.createUser({
    email: userData.email,
    passwordHash: hashedPassword,
    userRole: userData.userRole,
    createdAt: new Date(),
  });

  const { passwordHash, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// read
export const fetchAllUsers = async (page: number = 1, pageSize: number = 25) => {
  try {
    const result = await userRepo.getAllUsers(page, pageSize);
    return result;
  } catch (error) {
    throw new ErrorException(500, "Error fetching users: " + (error as Error).message);
  }
};
// read by ID
export const fetchByIdUser = async (userId: string) => {
  const user = await userRepo.getByIdUser(userId);

  if (!user) {
    throw new ErrorException(404, "User not found");
  }

  return user;
};


// update
export const updateUserById = async (userId: string, userData: UpdateUserDTO) => {
  const existingUser = await userRepo.getByIdUser(userId);
  if (!existingUser) {
    throw new ErrorException(404, "User not found");
  }

  const updateData: {
    email?: string;
    passwordHash?: string;
  } = {};

  if (userData.email !== undefined) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(userData.email)) {
      throw new ErrorException(400, "Invalid email format");
    }

    const emailExists = await userRepo.getUserByEmail(userData.email);
    if (emailExists && emailExists.userId !== userId) {
      throw new ErrorException(409, "Email already exists");
    }

    updateData.email = userData.email;
  }

  if (userData.password && userData.password.trim() !== "") {
    if (userData.password.length < 8) {
      throw new ErrorException(400, "Password must be at least 8 characters long");
    }

    // Hashing du nouveau mot de passe
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
    updateData.passwordHash = hashedPassword;
  }

  const updatedUser = await userRepo.updateUser(userId, updateData);

  return updatedUser;
};

// delete
export const deleteUserById = async (userId: string) => {
  const user = await userRepo.getByIdUser(userId);

  if (!user) {
    throw new ErrorException(404, "User not found");
  }

  await userRepo.deleteUser(userId);

  return { message: "User successfully deleted" };
};
