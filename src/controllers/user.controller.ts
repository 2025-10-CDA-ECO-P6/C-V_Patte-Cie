import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import ErrorException from "../types/errorException";
import { isValidUUID } from "../utils/uuid";
import {
  fetchAllUsers,
  fetchByIdUser,
  createNewUser,
  loginUser,
  updateUserById,
  deleteUserById,
} from "../services/user.service";
import { CreateUserDTO, UpdateUserDTO, UserWithRelations } from "../types/user.types";

// CREATE
export const postUser = async (req: Request, res: Response) => {
  try {
    const userData: CreateUserDTO = req.body;
    const newUser = await createNewUser(userData);

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
    res.status(err instanceof ErrorException ? err.status : 500).json({ message: err.message });
  }
};

// READ ALL
export const getUsers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 25;

    const { data: users, total } = await fetchAllUsers(page, pageSize);

    res.status(200).json({
      data: users.map((user: UserWithRelations) => ({
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
          pageCount: Math.ceil(total / pageSize),
          total,
        },
      },
    });
  } catch (err: any) {
    res.status(err instanceof ErrorException ? err.status : 500).json({ message: err.message });
  }
};

// READ BY ID
export const getByIdUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    if (!isValidUUID(userId)) throw new ErrorException(400, "Invalid user ID");

    const user = await fetchByIdUser(userId);
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
    res.status(err instanceof ErrorException ? err.status : 500).json({ message: err.message });
  }
};

// LOGIN
export const postLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw new ErrorException(400, "Email and password required");

    const token = await loginUser(email, password);
    res.status(200).json({ accessToken: token });
  } catch (err: any) {
    res.status(err instanceof ErrorException ? err.status : 500).json({ message: err.message });
  }
};

// UPDATE
export const patchUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    if (!isValidUUID(userId)) throw new ErrorException(400, "Invalid user ID");

    const userData: UpdateUserDTO = req.body;
    const updatedUser = await updateUserById(userId, userData);

    res.status(200).json({
      data: {
        id: updatedUser.userId,
        attributes: {
          email: updatedUser.email,
          userRole: updatedUser.userRole,
          createdAt: updatedUser.createdAt,
          updatedAt: updatedUser.updatedAt,
          owner: updatedUser.owner,
          veterinarian: updatedUser.veterinarian,
        },
      },
    });
  } catch (err: any) {
    res.status(err instanceof ErrorException ? err.status : 500).json({ message: err.message });
  }
};

// DELETE
export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.params.id;
    if (!isValidUUID(userId)) throw new ErrorException(400, "Invalid user ID");

    await deleteUserById(userId);
    res.status(200).json({ message: "User successfully deleted" });
  } catch (err: any) {
    res.status(err instanceof ErrorException ? err.status : 500).json({ message: err.message });
  }
};
