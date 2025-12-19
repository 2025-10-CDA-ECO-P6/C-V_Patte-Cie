import { Request, Response } from "express";
import { VaccineWithRelations } from "../types/vaccine.types";
import { fetchAllVaccines, fetchByIdVaccine, createVaccineService } from "../services/vaccine.service";

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
      return res.status(400).json({ message: "Invalid pagination parameters" });
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
    res.status(500).json({ message: "Server error" });
  }
};

export const getByIdVaccine = async (req: Request, res: Response) => {
  try {
    const vaccineId = Number(req.params.id);

    if (isNaN(vaccineId)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const vaccine = await fetchByIdVaccine(vaccineId);
    res.status(200).json(vaccine);
  } catch (error) {
    if ((error as Error).message === "Vaccine not found") {
      return res.status(404).json({ message: "Vaccine not found" });
    }

    console.error(error);
    res.status(500).json({ message: "Server error" });
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

    if (!name || !vaccineStatus || !reminderDelays) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const vaccine = await createVaccineService({
      name,
      administrationDate: administrationDate
        ? new Date(administrationDate)
        : undefined,
      vaccineStatus,
      reminderDelays,
      animalId: animalId ? Number(animalId) : undefined,
      veterinarianId: veterinarianId ? Number(veterinarianId) : undefined,
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

    if (message === "Animal not found") {
      return res.status(404).json({ message });
    }

    if (message === "Veterinarian not found") {
      return res.status(404).json({ message });
    }

    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};