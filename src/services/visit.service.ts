import * as visitRepo from "../repositories/visit.repository";
import { VisitInput, VisitUpdateInput, VisitWithRelations } from "../types";


export const fetchAllVisits = async (
  page: number,
  pageSize: number
): Promise<{ visits: VisitWithRelations[]; total: number }> => {
  try {
    return await visitRepo.getAllVisits(page, pageSize);
  } catch (error) {
    throw new Error("Error fetching visits: " + (error as Error).message);
  }
};


export const fetchByIdVisit = async (
  visitId: string
): Promise<VisitWithRelations> => {
  const visit = await visitRepo.getByIdVisit(visitId);

  if (!visit) {
    throw new Error("Visit not found");
  }

  return visit;
};


export const createVisit = async (
  data: VisitInput
): Promise<VisitWithRelations> => {
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
): Promise<VisitWithRelations> => {
  try {
    return await visitRepo.updateVisit(visitId, data);
  } catch (error) {
    throw new Error(
      "Error updating the visit: " + (error as Error).message
    );
  }
};


export const deleteVisit = async (visitId: string): Promise<void> => {
  try {
    await visitRepo.deleteVisit(visitId);
  } catch (error) {
    throw new Error(
      "Error deleting the visit: " + (error as Error).message
    );
  }
};
