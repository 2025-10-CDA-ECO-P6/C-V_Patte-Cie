import { Request, Response } from "express";
import { fetchAllVisits, fetchByIdVisit } from "../services/visit.service";
// import { fetchAllVisits, fetchByIdVisit, createVisit, updateVisit, deleteVisit, VisitInput } from "../services/Visit.service";
import { Prisma } from "@prisma/client";

export const getVisits = async (req: Request, res: Response) => {
  try {
    const visits = await fetchAllVisits();
    res.status(200).json(visits);
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

export const createVisit = async (data: {
  date: Date;
  reason: string;
  visitStatus: string; 
  observation?: string | null;
  animalId: number;
  veterinarianId: number;
}) => {
  return Prisma.visit.create({
    data: {
      date: data.date,
      reason: data.reason,
      visitStatus: data.visitStatus,
      observation: data.observation ?? null,
      animal: { connect: { animalId: data.animalId } },
      veterinarian: { connect: { veterinarianId: data.veterinarianId } },
    },
    include: {
      animal: true,
      veterinarian: true,
    },
  });
};

export const createVisitController = async (req: Request, res: Response) => {
  try {
    const { date, reason, visitStatus, observation, animalId, veterinarianId } = req.body;

    if (!date || !reason || !visitStatus || !animalId || !veterinarianId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const visitData = {
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// export const updateVisitController = async (req: Request, res: Response) => {
//   try {
//     const visitId = Number(req.params.id);
//     if (isNaN(visitId)) {
//       return res.status(400).json({ message: "Invalid ID" });
//     }

//     const existingVisit = await fetchByIdVisit(visitId);
//     if (!existingVisit) {
//       return res.status(404).json({ message: "Visit not found" });
//     }

//     const { date, reason, visitStatus, observation, animalId, veterinarianId } = req.body;

//     if (!date || !reason || !visitStatus || !animalId || !veterinarianId) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     const visitData = {
//       date: new Date(date),
//       reason,
//       visitStatus,
//       observation: observation ?? null,
//       animalId: Number(animalId),
//       veterinarianId: Number(veterinarianId),
//     };

//     const updatedVisit = await updateVisit(visitId, visitData);

//     res.status(200).json({
//       data: {
//         id: updatedVisit.visitId,
//         attributes: {
//           date: updatedVisit.date,
//           reason: updatedVisit.reason,
//           visitStatus: updatedVisit.visitStatus,
//           observation: updatedVisit.observation,
//           animal: updatedVisit.animal,
//           veterinarian: updatedVisit.veterinarian,
//         },
//       },
//     });
//   } catch (err) {
//     console.error(err);
//     if ((err as Error).message.includes("Foreign key constraint")) {
//       return res.status(400).json({ message: "Invalid animalId or veterinarianId" });
//     }
//     res.status(500).json({ message: "Server error" });
//   }
// };
  
// export const deleteVisitController = async (req: Request, res: Response) => {
//   try {
//     const VisitId = Number(req.params.id);
//     if (isNaN(VisitId)) return res.status(400).json({ message: "Invalid ID" });

//     await deleteVisit(VisitId);
//     res.status(204).json();
//   } catch (err) {
//     console.error(err);
//     if ((err as Error).message.includes("not found")) {
//       return res.status(404).json({ message: (err as Error).message });
//     }
//     res.status(500).json({ message: "Server error" });
//   }
// };