import { Request, Response } from "express";
import { fetchAllVisits, fetchByIdVisit, createVisit, updateVisit, deleteVisit } from "../services/visit.service";
import { VisitInput, VisitUpdateInput, VisitStatus, VisitWithRelations } from "../types";
import { fetchByIdAnimal } from "../services/animal.service";

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

export const getByIdVisit = async (req: Request, res: Response) => {
  try {
    const visitId = Number(req.params.id);

    if (isNaN(visitId)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const visit = await fetchByIdVisit(visitId);
    res.status(200).json(visit);
  } catch (error) {
    if ((error as Error).message === "Visit not found") {
      return res.status(404).json({ message: "Visit not found" });
    }

    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createVisitController = async (req: Request, res: Response) => {
  try {
    const { date, reason, visitStatus, observation, animalId, veterinarianId } = req.body;

    if (!date || !reason || !visitStatus || !animalId || !veterinarianId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const animal = await fetchByIdAnimal(Number(animalId));
    if (!animal) {
      return res.status(404).json({ message: `Animal with id ${animalId} not found` });
    }

    // Vérifier que le vétérinaire existe -> quand crud sera fait
    // const vet = await fetchByIdVeterinarian(Number(veterinarianId));
    // if (!vet) {
    //   return res.status(404).json({ message: `Veterinarian with id ${veterinarianId} not found` });
    // }

    const visitData: VisitInput = {
      date: new Date(date),
      reason,
      visitStatus,
      observation: observation ?? null,
      animalId: Number(animalId),
      veterinarianId: Number(veterinarianId),
    };

    const visit = await createVisit(visitData);

    res.status(201).json({
      data: {
        id: visit.visitId,
        attributes: {
          date: visit.date,
          reason: visit.reason,
          visitStatus: visit.visitStatus,
          observation: visit.observation,
          animal: visit.animal,
          veterinarian: visit.veterinarian,
        },
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
export const updateVisitController = async (req: Request, res: Response) => {
  try {
    const visitId = Number(req.params.id);

    if (Number.isNaN(visitId)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const existingVisit = await fetchByIdVisit(visitId);
    if (!existingVisit) {
      return res.status(404).json({ message: "Visit not found" });
    }

    const {
      date,
      reason,
      visitStatus,
      observation,
      animalId,
      veterinarianId,
    } = req.body;

    const visitData: VisitUpdateInput = {
      ...(date && { date: new Date(date) }),
      ...(reason && { reason }),
      ...(visitStatus && { visitStatus: visitStatus as VisitStatus }),
      ...(observation !== undefined && { observation }),
      ...(animalId && { animalId: Number(animalId) }),
      ...(veterinarianId && { veterinarianId: Number(veterinarianId) }),
    };

    const updatedVisit = await updateVisit(visitId, visitData);

    res.status(200).json(updatedVisit);
  } catch (error) {
    console.error(error);

    if ((error as Error).message.includes("Foreign key constraint")) {
      return res
        .status(400)
        .json({ message: "Invalid animalId or veterinarianId" });
    }

    res.status(500).json({ message: "Server error" });
  }
};

export const deleteVisitController = async (req: Request, res: Response) => {
  try {
    const visitId = Number(req.params.id);

    if (Number.isNaN(visitId)) {
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