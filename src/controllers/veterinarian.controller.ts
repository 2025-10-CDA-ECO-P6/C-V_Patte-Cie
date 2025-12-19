import { Request, Response } from "express";
import {
  fetchAllVets,
  fetchByIdVet,
  createNewVet,
  updateVetById,
  deleteVetById as deleteVetByIdService,
  fetchVetByUserId,
} from "../services/veterinarian.service";
import { CreateVeterinarianDTO, UpdateVeterinarianDTO } from "../types/veterinarian.type";
import ErrorException from "../types/errorException";
import { isValidUUID } from "../utils/uuid";

export const postVet = async (req: Request, res: Response) => {
  try {
    const vetData: CreateVeterinarianDTO = req.body;
    const newVet = await createNewVet(vetData);
    res.status(201).json({
      data: {
        id: newVet.veterinarianId,
        attributes: {
          userId: newVet.userId,
          name: newVet.name,
          phone: newVet.phone,
          createdAt: newVet.createdAt,
          updatedAt: newVet.updatedAt,
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
export const getVets = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 25;
    const { data: vets, total } = await fetchAllVets(page, pageSize);
    const pageCount = Math.ceil(total / pageSize);
    res.status(200).json({
      data: vets.map((vet) => ({
        id: vet.veterinarianId,
        attributes: {
          userId: vet.userId,
          name: vet.name,
          phone: vet.phone,
          createdAt: vet.createdAt,
          updatedAt: vet.updatedAt,
          user: vet.user,
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
export const getByIdVet = async (req: Request, res: Response) => {
  try {
    const vetId = req.params.id;
    if (!isValidUUID(vetId)) {
      throw new ErrorException(400, "Invalid vet ID");
    }
    const vet = await fetchByIdVet(vetId);
    res.status(200).json({
      data: {
        id: vet.veterinarianId,
        attributes: {
          userId: vet.userId,
          name: vet.name,
          phone: vet.phone,
          createdAt: vet.createdAt,
          updatedAt: vet.updatedAt,
          user: vet.user,
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
export const getVetByUserId = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    if (!isValidUUID(userId)) {
      throw new ErrorException(400, "Invalid user ID");
    }
    const vet = await fetchVetByUserId(userId);
    res.status(200).json({
      data: {
        id: vet.veterinarianId,
        attributes: {
          userId: vet.userId,
          name: vet.name,
          phone: vet.phone,
          createdAt: vet.createdAt,
          updatedAt: vet.updatedAt,
          user: vet.user,
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
export const patchVet = async (req: Request, res: Response) => {
  try {
    const vetId = req.params.id;
    if (!isValidUUID(vetId)) {
      throw new ErrorException(400, "Invalid vet ID");
    }
    const vetData: UpdateVeterinarianDTO = req.body;
    const updatedVet = await updateVetById(vetId, vetData);
    res.status(200).json({
      data: {
        id: updatedVet.veterinarianId,
        attributes: {
          userId: updatedVet.userId,
          name: updatedVet.name,
          phone: updatedVet.phone,
          createdAt: updatedVet.createdAt,
          updatedAt: updatedVet.updatedAt,
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
export const deleteVetById = async (req: Request, res: Response) => {
  try {
    const vetId = req.params.id;
    if (!isValidUUID(vetId)) {
      throw new ErrorException(400, "Invalid vet ID");
    }
    const vet = await fetchByIdVet(vetId);
    await deleteVetByIdService(vetId);
    res.status(200).json({
      data: {
        id: vet.veterinarianId,
        attributes: {
          userId: vet.userId,
          name: vet.name,
          phone: vet.phone,
          createdAt: vet.createdAt,
          updatedAt: vet.updatedAt,
          user: vet.user,
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
