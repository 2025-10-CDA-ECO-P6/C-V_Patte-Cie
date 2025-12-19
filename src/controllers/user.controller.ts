import { Request, Response } from "express";
import { fetchAllUsers, fetchByIdUser, createNewUser, loginUser, updateUserById, deleteUserById } from "../services/user.service";
import { CreateUserDTO, UpdateUserDTO } from "../types/user.types";
import { AuthRequest } from "../middlewares/auth.middleware";
import "../types/errorException";


// create
export const postUser = async (req: Request, res: Response) => {
  try {
    const userData: CreateUserDTO = req.body;
    const newUser = await createNewUser(userData);

    // Format de réponse Strapi
    res.status(201).json({
      data: {
        id: newUser.userId,
        attributes: {
          email: newUser.email,
          userRole: newUser.userRole,
          createdAt: newUser.createdAt,
          updatedAt: newUser.updatedAt,
        },
      },
    });
  } catch (err: any) {
    if (err instanceof ErrorException) {
      return res.status(err.status).json({ message: err.message });
    }

    res.status(500).json({ message: "Erreur serveur" });
  }
};

// read
export const getUsers = async (req: Request, res: Response) => {
  try {
    // Récupérer les paramètres de pagination (convention Strapi)
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 25;

    const { data: users, total } = await fetchAllUsers(page, pageSize);

    // Format de réponse Strapi avec pagination
    const pageCount = Math.ceil(total / pageSize);

    res.status(200).json({
      data: users.map(user => ({
        id: user.userId,
        attributes: {
          email: user.email,
          userRole: user.userRole,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          owner: user.owner,
          veterinarian: user.veterinarian,
        },
      })),
      meta: {
        pagination: {
          page,
          pageSize,
          pageCount,
          total,
        },
      },
    });
  } catch (err: any) {
    if (err instanceof ErrorException) {
      return res.status(err.status).json({ message: err.message });
    }

    res.status(500).json({ message: "Erreur serveur" });
  }
};

//read by ID
export const getByIdUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    const user = await fetchByIdUser(userId);

    // Format de réponse Strapi
    res.status(200).json({
      data: {
        id: user.userId,
        attributes: {
          email: user.email,
          userRole: user.userRole,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
    });
  } catch (err: any) {
    if (err instanceof ErrorException) {
      return res.status(err.status).json({ message: err.message });
    }

    res.status(500).json({ message: "Erreur serveur" });
  }
};

// login
export const postLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ErrorException(400, "Email and password are required");
    }

    const token = await loginUser(email, password);
    res.status(200).json({
      accessToken: token
    });
  } catch (err: any) {
    if (err instanceof ErrorException) {
      return res.status(err.status).json({ message: err.message });
    }

    res.status(500).json({ message: "Erreur serveur" });
  }
};

// update
export const patchUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    const userData: UpdateUserDTO = req.body;

    // Appel du service pour mettre à jour l'utilisateur
    const updatedUser = await updateUserById(userId, userData);

    // Format de réponse Strapi
    res.status(200).json({
      data: {
        id: updatedUser.userId,
        attributes: {
          email: updatedUser.email,
          createdAt: updatedUser.createdAt,
          updatedAt: updatedUser.updatedAt
        },
      },
    });
  } catch (err: any) {
    if (err instanceof ErrorException) {
      return res.status(err.status).json({ message: err.message });
    }

    res.status(500).json({ message: "Erreur serveur" });
  }
};

// delete
export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.params.id;

    // Récupérer l'utilisateur avant suppression pour le retourner (convention Strapi)
    const user = await fetchByIdUser(userId);

    await deleteUserById(userId);

    // Retourner 200 OK avec le corps de la ressource supprimée (convention Strapi)
    res.status(200).json({
      data: {
        id: user.userId,
        attributes: {
          email: user.email,
          userRole: user.userRole,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          owner: user.owner,
          veterinarian: user.veterinarian,
        },
      },
    });
  } catch (err: any) {
    if (err instanceof ErrorException) {
      return res.status(err.status).json({ message: err.message });
    }

    res.status(500).json({ message: "Erreur serveur" });
  }
};
