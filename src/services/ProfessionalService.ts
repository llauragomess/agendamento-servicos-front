import { api } from "../shared/api";
import { ProfessionalDTO } from "../dtos/ProfessionalDTO";

export const getAllProfessionals = async (): Promise<ProfessionalDTO[]> => {
  const { data } = await api.get("/professional");
  return data;
};

export const getProfessionalById = async (
  id: number
): Promise<ProfessionalDTO> => {
  const { data } = await api.get(`/professional/${id}`);
  return data;
};

export const createProfessional = async (
  data: ProfessionalDTO
): Promise<ProfessionalDTO> => {
  const { data: created } = await api.post("/professional", data);
  return created;
};

export const updateProfessional = async (
  id: number,
  data: ProfessionalDTO
): Promise<ProfessionalDTO> => {
  const { data: updated } = await api.put(`/professional/${id}`, data);
  return updated;
};

export const deleteProfessional = async (id: number): Promise<void> => {
  await api.delete(`/professional/${id}`);
};
