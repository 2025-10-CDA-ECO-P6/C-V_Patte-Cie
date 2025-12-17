import * as userRepo from "../repositories/user.repository";
import { CreateUserDTO } from "../types/user.types";

// create
export const createNewUser = async (userData: CreateUserDTO) => {
  try {
    const user = await userRepo.createUser(userData);
    return user;
  } catch (error) {
    throw new Error("Error creating user: " + (error as Error).message);
  }
};

// read
export const fetchAllUsers = async () => {
  try {
    const users = await userRepo.getAllUsers();
    return users;
  } catch (error) {
    throw new Error("Error fetching users: " + (error as Error).message);
  }
};
// read by ID
export const fetchByIdUser = async (userId: number) => {
  try {
    const user = await userRepo.getByIdUser(userId);
    return user;
  } catch (error) {
    throw new Error("Error fetching users: " + (error as Error).message);
  }
};

// update

// delete