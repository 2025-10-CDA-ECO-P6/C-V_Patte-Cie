export interface CreateVeterinarianDTO {
  userId: number;
  name: string;
  phone: string;
}

export interface UpdateVeterinarianDTO {
  name?: string;
  phone?: string;
}