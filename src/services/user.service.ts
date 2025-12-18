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
    // 1. Vérifier que l'utilisateur existe
    const existingUser = await userRepo.getByIdUser(userId);
    if (!existingUser) {
      throw new Error("User not found");
    }

    // 2. Préparer les données à mettre à jour
    const updateData: {
      email: string;
      passwordHash?: string | undefined;
      userRole: typeof userData.userRole;
    } = {
      email: existingUser.email,
      userRole: existingUser.userRole,
    };

    // 3. Validation et gestion de l'email
    if (userData.email !== undefined) {
      // Si l'email est fourni, on le valide
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(userData.email)) {
        throw new Error("Invalid email format");
      }

      // Vérifier que l'email n'est pas déjà utilisé par un autre utilisateur
      const emailExists = await userRepo.getUserByEmail(userData.email);
      if (emailExists && emailExists.userId !== userId) {
        throw new Error("Email already exists");
      }

      updateData.email = userData.email;
    }

    // 4. Gestion du mot de passe (IMPORTANT : ne change que s'il est fourni ET non vide)
    if (userData.password && userData.password.trim() !== "") {
      // Validation : minimum 8 caractères
      if (userData.password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }

      // Hashing du nouveau mot de passe
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
      updateData.passwordHash = hashedPassword;
    }
    // Si password est absent, null, undefined ou vide → on ne touche PAS au password existant

    // 5. Gestion du userRole
    if (userData.userRole !== undefined) {
      updateData.userRole = userData.userRole;
    }

    // 6. Mise à jour dans la base de données
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
