import * as userRepo from "../repositories/user.repository";

export const fetchAllUsers = async () => {
  try {
    const users = await userRepo.getAllUsers();
    return users;
  } catch (error) {
    throw new Error("Error fetching users: " + (error as Error).message);
  }
};

export const fetchByIdUser = async (userId: number) => {
  try {
    const user = await userRepo.getByIdUser(userId);
    return user;
  } catch (error) {
    throw new Error("Error fetching users: " + (error as Error).message);
  }
};