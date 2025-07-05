import { api } from "../shared/api";
import { SlotDTO, CreateSlotDTO } from "../dtos/SlotDTO";

export const getAllSlots = async (): Promise<SlotDTO[]> => {
  const response = await api.get("/slot");
  return response.data;
};

export const getSlotById = async (id: number): Promise<SlotDTO> => {
  const { data } = await api.get(`/slot/${id}`);
  return data;
};

export const createSlot = async (data: CreateSlotDTO): Promise<SlotDTO> => {
  const { data: created } = await api.post("/slot", data);
  return created;
};

export const cancelSlot = async (id: number): Promise<SlotDTO> => {
  const { data: canceled } = await api.put(`/slot/${id}/cancel`);
  return canceled;
};

export const completeSlot = async (
  id: number,
  data: SlotDTO
): Promise<SlotDTO> => {
  const { data: completed } = await api.put(`/slot/${id}`, data);
  return completed;
};

export const getAvailableSlots = async (
  professionalId: number,
  serviceId: number
): Promise<SlotDTO[]> => {
  const { data } = await api.get(
    `/slot/available?professionalId=${professionalId}&serviceId=${serviceId}`
  );
  return data;
}

export const scheduleSlot = async (slotId: number, customerId: number): Promise<SlotDTO[]> => {
  const { data } = await api.post("/slot/schedule", { slotId, customerId });
  return data;
}

