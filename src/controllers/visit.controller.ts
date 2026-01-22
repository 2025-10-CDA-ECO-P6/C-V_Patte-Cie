import { Request, Response } from "express";
import { isValidUUID } from "../utils/uuid";
import {
  fetchAllVisits,
  fetchByIdVisit,
  createVisit,
  updateVisit,
  deleteVisit,
} from "../services/visit.service";
import { VisitInput, VisitUpdateInput, VisitWithRelations } from "../types";
import { VisitStatus } from "@prisma/client";
import { fetchByIdAnimal } from "../services/animal.service";

/**
 * Helper pour formater la réponse d'une visite
 */
const formatVisitResponse = (visit: VisitWithRelations) => ({
  id: visit.visitId,
  attributes: {
    date: visit.date,
    reason: visit.reason,
    visitStatus: visit.visitStatus,
    observation: visit.observation,
    animal: visit.animal,
    veterinarian: visit.veterinarian,
    createdAt: visit.createdAt,
    updatedAt: visit.updatedAt,
  },
});

/**
 * GET /visits?page=1&pageSize=10
 */
export const getVisits = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;

    if (page <= 0 || pageSize <= 0) {
      return res.status(400).json({ message: "Invalid pagination parameters" });
    }

    const { visits, total } = await fetchAllVisits(page, pageSize);
    const pageCount = Math.ceil(total / pageSize);

    res.status(200).json({
      data: visits.map(formatVisitResponse),
      meta: { pagination: { page, pageSize, pageCount, total } },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /visits/:id
 */
export const getVisitByIdController = async (req: Request, res: Response) => {
  try {
    const visitId = req.params.id;

    if (!isValidUUID(visitId)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const visit = await fetchByIdVisit(visitId);
    if (!visit) {
      return res.status(404).json({ message: "Visit not found" });
    }

    res.status(200).json(formatVisitResponse(visit));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * POST /visits
 */
export const createVisitController = async (req: Request, res: Response) => {
  try {
    const { date, reason, visitStatus, observation, animalId, veterinarianId } =
      req.body;

    if (!date || !reason || !visitStatus || !animalId || !veterinarianId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!isValidUUID(animalId) || !isValidUUID(veterinarianId)) {
      return res.status(400).json({ message: "Invalid UUID for animal or veterinarian" });
    }

    const animal = await fetchByIdAnimal(animalId);
    if (!animal) {
      return res.status(404).json({ message: `Animal with id ${animalId} not found` });
    }

    const visitData: VisitInput = {
      date: new Date(date),
      reason,
      visitStatus: visitStatus as VisitStatus,
      observation: observation ?? null,
      animalId,
      veterinarianId,
    };

    const visit = await createVisit(visitData);

    res.status(201).json(formatVisitResponse(visit));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * PATCH /visits/:id
 */
export const updateVisitController = async (req: Request, res: Response) => {
  try {
    const visitId = req.params.id;

    if (!isValidUUID(visitId)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const existingVisit = await fetchByIdVisit(visitId);
    if (!existingVisit) {
      return res.status(404).json({ message: "Visit not found" });
    }

    const { date, reason, visitStatus, observation, animalId, veterinarianId } =
      req.body;

    const visitData: VisitUpdateInput = {
      ...(date && { date: new Date(date) }),
      ...(reason && { reason }),
      ...(visitStatus && { visitStatus: visitStatus as VisitStatus }),
      ...(observation !== undefined && { observation }),
      ...(animalId && isValidUUID(animalId) && { animalId }),
      ...(veterinarianId && isValidUUID(veterinarianId) && { veterinarianId }),
    };

    const updatedVisit = await updateVisit(visitId, visitData);
    res.status(200).json(formatVisitResponse(updatedVisit));
  } catch (error) {
    console.error(error);

    if ((error as Error).message.includes("Foreign key constraint")) {
      return res.status(400).json({ message: "Invalid animalId or veterinarianId" });
    }

    res.status(500).json({ message: "Server error" });
  }
};

/**
 * DELETE /visits/:id
 */
export const deleteVisitController = async (req: Request, res: Response) => {
  try {
    const visitId = req.params.id;

    if (!isValidUUID(visitId)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    await deleteVisit(visitId);
    res.status(204).send();
  } catch (error) {
    console.error(error);

    if ((error as Error).message.includes("Record to delete does not exist")) {
      return res.status(404).json({ message: "Visit not found" });
    }

    res.status(500).json({ message: "Server error" });
  }
};
