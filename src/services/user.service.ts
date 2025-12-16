import * as animalRepo from "../repositories/user.repository";

export const fetchAllUsers = async () => {
  try {
    const users = await animalRepo.getAllUsers();
    return users;
  } catch (error) {
    throw new Error("Error fetching users: " + (error as Error).message);
  }
};
