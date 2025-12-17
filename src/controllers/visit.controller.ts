import { Request, Response } from "express";
import { fetchAllVisits } from "../services/visit.service";
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

// export const getByIdVisit = async (req: Request, res: Response) => {
//   try {
//     const VisitId = Number.parseInt(req.params.id);
//     const Visit = await fetchByIdVisit(VisitId);
//     res.status(200).json(Visit);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// export const createVisitController = async (req: Request, res: Response) => {
//   try {
//     const { name, species, breed, dateOfBirth, picture, weight, gender, ownerId } = req.body;

//     if (!name || !species || !breed || !dateOfBirth || !weight || !gender || !ownerId) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     if (!["M", "F"].includes(gender)) {
//       return res.status(400).json({ message: "Invalid gender" });
//     }

//     const VisitData: VisitInput = {
//       name,
//       species,
//       breed,
//       dateOfBirth: new Date(dateOfBirth),
//       picture: picture ?? null,
//       weight,
//       gender,
//       ownerId: Number(ownerId),
//     };

//     const Visit = await createVisit(VisitData);

//     res.status(201).json({
//       data: {
//         id: Visit.VisitId,
//         attributes: {
//           name: Visit.name,
//           species: Visit.species,
//           breed: Visit.breed,
//           dateOfBirth: Visit.dateOfBirth,
//           picture: Visit.picture,
//           weight: Visit.weight,
//           gender: Visit.gender,
//           owner: Visit.owner,
//           vaccines: Visit.vaccines,
//           visits: Visit.visits,
//         },
//       },
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// export const updateVisitController = async (req: Request, res: Response) => {
//   try {
//     const VisitId = Number(req.params.id);
//     if (isNaN(VisitId)) {
//       return res.status(400).json({ message: "Invalid ID" });
//     }

//     const existingVisit = await fetchByIdVisit(VisitId);
//     if (!existingVisit) {
//       return res.status(404).json({ message: "Visit not found" });
//     }

//     const data: Partial<VisitInput> = { ...req.body };

//     if (isNaN(Number(data.weight))) {
//   return res.status(400).json({ message: "Invalid weight" });
// }

//     if (data.dateOfBirth && typeof data.dateOfBirth === "string") {
//       const parsedDate = new Date(data.dateOfBirth);
//       if (isNaN(parsedDate.getTime())) {
//         return res.status(400).json({ message: "Invalid dateOfBirth" });
//       }
//       data.dateOfBirth = parsedDate;
//     }

//     if (data.gender && !["M", "F"].includes(data.gender)) {
//       return res.status(400).json({ message: "Invalid gender" });
//     }

//     const updatedVisit = await updateVisit(VisitId, data);

//     res.status(200).json({
//       data: {
//         id: updatedVisit.VisitId,
//         attributes: {
//           name: updatedVisit.name,
//           species: updatedVisit.species,
//           breed: updatedVisit.breed,
//           dateOfBirth: updatedVisit.dateOfBirth,
//           picture: updatedVisit.picture,
//           weight: updatedVisit.weight,
//           gender: updatedVisit.gender,
//           owner: updatedVisit.owner,
//           vaccines: updatedVisit.vaccines,
//           visits: updatedVisit.visits,
//         },
//       },
//     });
//   } catch (err) {
//     console.error(err);
//     if ((err as Error).message.includes("Foreign key constraint")) {
//       return res.status(400).json({ message: "Invalid ownerId" });
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