import { Request, Response } from "express";
import { isValidUUID } from "../utils/uuid";
import {
  fetchAllOwners,
  fetchByIdOwner,
  createNewOwner,
  updateOwnerById,
  deleteOwnerById,
  fetchOwnerByUserId,
} from "../services/owner.service";
import { CreateOwnerDTO, UpdateOwnerDTO } from "../types/owner.types";
import ErrorException from "../types/errorException";

export const postOwner = async (req: Request, res: Response) => {
  try {
    const ownerData: CreateOwnerDTO = req.body;
    const newOwner = await createNewOwner(ownerData);

    res.status(201).json({
      data: {
        id: newOwner.ownerId,
        attributes: {
          userId: newOwner.userId,
          name: newOwner.name,
          phone: newOwner.phone,
          address: newOwner.address,
          createdAt: newOwner.createdAt,
          updatedAt: newOwner.updatedAt,
        },
      },
    });
  } catch (err: any) {
    if (err instanceof ErrorException) {
      return res.status(err.status).json({ message: err.message });
    }

    res.status(500).json({ message: err.message });
  }
};

export const getOwners = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 25;

    const { data: owners, total } = await fetchAllOwners(page, pageSize);

    const pageCount = Math.ceil(total / pageSize);

    res.status(200).json({
      data: owners.map((owner) => ({
        id: owner.ownerId,
        attributes: {
          userId: owner.userId,
          name: owner.name,
          phone: owner.phone,
          address: owner.address,
          createdAt: owner.createdAt,
          updatedAt: owner.updatedAt,
          user: owner.user,
          animals: owner.animals,
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

export const getByIdOwner = async (req: Request, res: Response) => {
  try {
    const ownerId = req.params.id;

    if (!isValidUUID(ownerId)) {
      throw new ErrorException(400, "Invalid owner ID");
    }

    const owner = await fetchByIdOwner(ownerId);

    res.status(200).json({
      data: {
        id: owner.ownerId,
        attributes: {
          userId: owner.userId,
          name: owner.name,
          phone: owner.phone,
          address: owner.address,
          createdAt: owner.createdAt,
          updatedAt: owner.updatedAt,
          animals: owner.animals,
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

export const getOwnerByUserId = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    if (!isValidUUID(userId)) {
      throw new ErrorException(400, "Invalid user ID");
    }

    const owner = await fetchOwnerByUserId(userId);

    res.status(200).json({
      data: {
        id: owner.ownerId,
        attributes: {
          userId: owner.userId,
          name: owner.name,
          phone: owner.phone,
          address: owner.address,
          createdAt: owner.createdAt,
          updatedAt: owner.updatedAt,
          user: owner.user,
          animals: owner.animals,
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

export const patchOwner = async (req: Request, res: Response) => {
  try {
    const ownerId = req.params.id;

    if (!isValidUUID(ownerId)) {
      throw new ErrorException(400, "Invalid owner ID");
    }

    const ownerData: UpdateOwnerDTO = req.body;

    const updatedOwner = await updateOwnerById(ownerId, ownerData);

    res.status(200).json({
      data: {
        id: updatedOwner.ownerId,
        attributes: {
          userId: updatedOwner.userId,
          name: updatedOwner.name,
          phone: updatedOwner.phone,
          address: updatedOwner.address,
          createdAt: updatedOwner.createdAt,
          updatedAt: updatedOwner.updatedAt,
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

export const deleteOwner = async (req: Request, res: Response) => {
  try {
    const ownerId = req.params.id;

    if (!isValidUUID(ownerId)) {
      throw new ErrorException(400, "Invalid owner ID");
    }

    const owner = await fetchByIdOwner(ownerId);

    await deleteOwnerById(ownerId);

    res.status(200).json({
      data: {
        id: owner.ownerId,
        attributes: {
          userId: owner.userId,
          name: owner.name,
          phone: owner.phone,
          address: owner.address,
          createdAt: owner.createdAt,
          updatedAt: owner.updatedAt,
          user: owner.user,
          animals: owner.animals,
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
