import * as visitRepo from "../repositories/visit.repository";
import { VisitInput, VisitUpdateInput } from "../types";


export const fetchAllVisits = async ( page: number, pageSize: number) => {
  try {
    return await visitRepo.getAllVisits(page, pageSize);
  } catch (error) {
    throw new Error("Error fetching visits");
  }
};

export const fetchByIdVisit = async (visitId: string) => {
  const visit = await visitRepo.getByIdVisit(visitId);

  if (!visit) {
    throw new Error("Visit not found");
  }

  return visit;
};

export const createVisit = async (data: VisitInput) => {
  try {
    return await visitRepo.createVisit(data);
  } catch (error) {
    throw new Error(
      "Error creating the visit: " + (error as Error).message
    );
  }
};

export const updateVisit = async (
  visitId: string,
  data: VisitUpdateInput
) => {
  try {
    return await visitRepo.updateVisit(visitId, data);
  } catch (error) {
    throw new Error(
      "Error updating the visit: " + (error as Error).message
    );
  }
};

export const deleteVisit = async (visitId: string) => {
  try {
    return await visitRepo.deleteVisit(visitId);
  } catch (error) {
    throw new Error(
      "Error deleting the visit: " + (error as Error).message
    );
  }
};
