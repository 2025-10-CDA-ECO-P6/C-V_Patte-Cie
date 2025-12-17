import { Request, Response } from "express";
import { fetchAllUsers, fetchByIdUser, createNewUser, loginUser } from "../services/user.service";
import { CreateUserDTO } from "../types/user.types";
import { generateToken } from "../utils/jwt.utils";


// create
export const postUser = async (req: Request, res: Response) => {
  try {
    const userData: CreateUserDTO = req.body;
    const newUser = await createNewUser(userData);
    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    const errorMessage = (err as Error).message;

    if (errorMessage.includes("Invalid email format")) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (errorMessage.includes("Password must be at least")) {
      return res.status(400).json({ message: errorMessage });
    }

    if (errorMessage.includes("Email already exists")) {
      return res.status(409).json({ message: "Email already exists" });
    }

    res.status(500).json({ message: "Erreur serveur" });
  }
};

// read
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await fetchAllUsers();
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

//read by ID
export const getByIdUser = async (req: Request, res: Response) => {
  try {
    const userId = Number.parseInt(req.params.id);

    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await fetchByIdUser(userId);
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    const errorMessage = (err as Error).message;

    if (errorMessage.includes("User not found")) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(500).json({ message: "Erreur serveur" });
  }
};

// login
export const postLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await loginUser(email, password);

    const token = generateToken({
      userId: user.userId,
      email: user.email,
      userRole: user.userRole,
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        userId: user.userId,
        email: user.email,
        userRole: user.userRole,
      },
    });
  } catch (err) {
    console.error(err);
    const errorMessage = (err as Error).message;

    if (errorMessage.includes("Invalid credentials")) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(500).json({ message: "Erreur serveur" });
  }
};

// update

// delete