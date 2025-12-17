export const mapVisit = (visit: any) => ({
  id: visit.visitId,
  attributes: {
    date: visit.date,
    reason: visit.reason,
    visitStatus: visit.visitStatus, // enum
    observation: visit.observation,
    animal: visit.animal,
    veterinarian: visit.veterinarian,
    createdAt: visit.createdAt,
    updatedAt: visit.updatedAt,
  },
});