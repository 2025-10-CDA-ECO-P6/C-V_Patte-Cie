import { Request, Response } from "express";
import {
  fetchAllVets,
  fetchByIdVet,
  createNewVet,
  updateVetById,
  deleteVetById,
  fetchVetByUserId,
} from "../services/owner.service";
import { CreateOwnerDTO, UpdateOwnerDTO } from "../types/owner.types";
import "../types/errorException";

export const postVet = async (req: Request, res: Response) => {
  try {
    const vetData: CreateVetDTO = req.body;
    const newVet = await createNewVet(vetData);

    res.status(201).json({
      data: {
        id: newVet.vetId,
        attributes: {
          userId: newVet.userId,
          name: newVet.name,
          phone: newVet.phone,
          address: newVet.address,
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
        id: vet.vetId,
        attributes: {
          userId: vet.userId,
          name: vet.name,
          phone: vet.phone,
          address: vet.address,
          createdAt: vet.createdAt,
          updatedAt: vet.updatedAt,
          user: vet.user,
          animals: vet.animals,
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
    const vetId = Number.parseInt(req.params.id);

    if (isNaN(vetId)) {
      throw new ErrorException(400, "Invalid vet ID");
    }

    const vet = await fetchByIdVet(vetId);

    res.status(200).json({
      data: {
        id: vet.vetId,
        attributes: {
          userId: vet.userId,
          name: vet.name,
          phone: vet.phone,
          address: vet.address,
          createdAt: vet.createdAt,
          updatedAt: vet.updatedAt,
          user: vet.user,
          animals: vet.animals,
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
    const userId = Number.parseInt(req.params.userId);

    if (isNaN(userId)) {
      throw new ErrorException(400, "Invalid user ID");
    }

    const vet = await fetchVetByUserId(userId);

    res.status(200).json({
      data: {
        id: vet.vetId,
        attributes: {
          userId: vet.userId,
          name: vet.name,
          phone: vet.phone,
          address: vet.address,
          createdAt: vet.createdAt,
          updatedAt: vet.updatedAt,
          user: vet.user,
          animals: vet.animals,
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
    const vetId = Number.parseInt(req.params.id);

    if (isNaN(vetId)) {
      throw new ErrorException(400, "Invalid vet ID");
    }

    const vetData: UpdateVetDTO = req.body;

    const updatedVet = await updateVetById(vetId, vetData);

    res.status(200).json({
      data: {
        id: updatedVet.vetId,
        attributes: {
          userId: updatedVet.userId,
          name: updatedVet.name,
          phone: updatedVet.phone,
          address: updatedVet.address,
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
    const vetId = Number.parseInt(req.params.id);

    if (isNaN(vetId)) {
      throw new ErrorException(400, "Invalid vet ID");
    }

    const vet = await fetchByIdVet(vetId);

    await deleteVetById(vetId);

    res.status(200).json({
      data: {
        id: vet.vetId,
        attributes: {
          userId: vet.userId,
          name: vet.name,
          phone: vet.phone,
          address: vet.address,
          createdAt: vet.createdAt,
          updatedAt: vet.updatedAt,
          user: vet.user,
          animals: vet.animals,
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
