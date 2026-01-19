import { Request, Response } from "express";
import { VaccineWithRelations } from "../types/vaccine.types";
import { fetchAllVaccines, fetchByIdVaccine, createVaccineService, updateVaccineService, deleteVaccine } from "../services/vaccine.service";

const formatVaccineResponse = (vaccine: VaccineWithRelations) => ({
 id: vaccine.vaccineId,
  attributes: {
    name: vaccine.name,
    administrationDate: vaccine.administrationDate,
    vaccineStatus: vaccine.vaccineStatus,
    reminderDelays: vaccine.reminderDelays,
    animal: vaccine.animal,
    veterinarian: vaccine.veterinarian,
    createdAt: vaccine.createdAt,
    updatedAt: vaccine.updatedAt,
  },
});

export const getVaccines = async (req: Request, res: Response) => {
  try {

    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;

    if (page <= 0 || pageSize <= 0) {
      return res.status(400).json({ message: "Paramètres de pagination invalides" });
    }

    const { vaccines, total } = await fetchAllVaccines(page, pageSize);

    const pageCount = Math.ceil(total / pageSize);

    res.status(200).json({
      data: vaccines.map(formatVaccineResponse),
      meta: {
        pagination: {
          page,
          pageSize,
          pageCount,
          total,
        },
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const getByIdVaccine = async (req: Request, res: Response) => {
  try {
    const vaccineId = req.params.id;

    const vaccine = await fetchByIdVaccine(vaccineId);
    res.status(200).json(vaccine);
  } catch (error) {
    if ((error as Error).message === "Vaccin non trouvé") {
      return res.status(404).json({ message: "Vaccin non trouvé" });
    }

    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const createVaccineController = async (req: Request, res: Response) => {
  try {
    const {
      name,
      administrationDate,
      vaccineStatus,
      reminderDelays,
      animalId,
      veterinarianId,
    } = req.body;

    const vaccine = await createVaccineService({
      name,
      administrationDate: administrationDate
        ? new Date(administrationDate)
        : undefined,
      vaccineStatus,
      reminderDelays,
      animalId: animalId ? animalId : undefined,
      veterinarianId: veterinarianId ? veterinarianId : undefined,
    });

    res.status(201).json({
      data: {
        id: vaccine.vaccineId,
        attributes: {
          name: vaccine.name,
          administrationDate: vaccine.administrationDate,
          vaccineStatus: vaccine.vaccineStatus,
          reminderDelays: vaccine.reminderDelays,
          animal: vaccine.animal,
          veterinarian: vaccine.veterinarian,
          createdAt: vaccine.createdAt,
          updatedAt: vaccine.updatedAt,
        },
      },
    });
  } catch (error) {
    const message = (error as Error).message;

    if (message === "Animal non trouvé") {
      return res.status(404).json({ message });
    }

    if (message === "Véterinaire non trouvé") {
      return res.status(404).json({ message });
    }

    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const updateVaccineController = async (req: Request, res: Response) => {
  try {
    const vaccineId = req.params.id;

    const updatedVaccine = await updateVaccineService(vaccineId, req.body);

    res.status(200).json({
      data: formatVaccineResponse(updatedVaccine),
    });
  } catch (error) {
    const message = (error as Error).message;

    if (message === "Vaccin non trouvé") {
      return res.status(404).json({ message });
    }
    if (message === "Animal non trouvé" || message === "Véterinaire non trouvé") {
      return res.status(404).json({ message });
    }

    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const deleteVaccineController = async (req: Request, res: Response) => {
  try {
    const vaccineId = req.params.id;

    await deleteVaccine(vaccineId);
    res.status(204).send();
  } catch (error) {
    console.error(error);

    const message = (error as Error).message;

    if (message === "Vaccin non trouvé") {
      return res.status(404).json({ message });
    }

    res.status(500).json({ message: "Erreur serveur" });
  }
};