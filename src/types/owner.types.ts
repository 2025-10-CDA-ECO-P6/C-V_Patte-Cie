export interface CreateOwnerDTO {
  userId: number;
  name: string;
  phone: string;
  address: string;
}

export interface UpdateOwnerDTO {
  name?: string;
  phone?: string;
  address?: string;
}
