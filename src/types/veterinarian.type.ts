export interface CreateVeterinarianDTO {
  userId: string; // UUID
  name: string;
  phone: string;
}

export interface UpdateVeterinarianDTO {
  name?: string;
  phone?: string;
}