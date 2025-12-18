import * as userRepo from "../repositories/user.repository";
import { CreateUserDTO, UpdateUserDTO } from "../types/user.types";
import { generateToken } from "../utils/jwt.utils";
import bcrypt from 'bcrypt';

// login
export const loginUser = async (email: string, password: string) => {
  try {
    const user = await userRepo.getUserByEmail(email);

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    return generateToken({
      userId: user.userId,
      email: user.email,
      userRole: user.userRole,
    });
  } catch (error) {
    throw new Error("Error during login: " + (error as Error).message);
  }
};

// create
export const createNewUser = async (userData: CreateUserDTO) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(userData.email)) {
    throw new Error("Invalid email format");
  }

  if (!userData.password || userData.password.length < 8) {
    throw new Error("Password must be at least 8 characters long");
  }

  const existingUser = await userRepo.getUserByEmail(userData.email);
  if (existingUser) {
    throw new Error("Email already exists");
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
    throw new Error("Error fetching users: " + (error as Error).message);
  }
};
// read by ID
export const fetchByIdUser = async (userId: number) => {
  const user = await userRepo.getByIdUser(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};


// update
export const updateUserById = async (userId: number, userData: UpdateUserDTO) => {
  try {
    const existingUser = await userRepo.getByIdUser(userId);
    if (!existingUser) {
      throw new Error("User not found");
    }

    const updateData: {
      email?: string;
      passwordHash?: string;
    } = {};

    if (userData.email !== undefined) {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(userData.email)) {
        throw new Error("Invalid email format");
      }

      const emailExists = await userRepo.getUserByEmail(userData.email);
      if (emailExists && emailExists.userId !== userId) {
        throw new Error("Email already exists");
      }

      updateData.email = userData.email;
    }

    if (userData.password && userData.password.trim() !== "") {
      if (userData.password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }

      // Hashing du nouveau mot de passe
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
      updateData.passwordHash = hashedPassword;
    }

    const updatedUser = await userRepo.updateUser(userId, updateData);

    return updatedUser;
  } catch (error) {
    throw new Error("Error updating user: " + (error as Error).message);
  }
};

// delete
export const deleteUserById = async (userId: number) => {
  try {
    const user = await userRepo.getByIdUser(userId);
    
    if (!user) {
      throw new Error("User not found");
    }
    
    await userRepo.deleteUser(userId);
    
    return { message: "User successfully deleted" };
  } catch (error) {
    throw new Error("Error deleting user: " + (error as Error).message);
  }
};
