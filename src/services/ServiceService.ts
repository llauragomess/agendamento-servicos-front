
import {api} from '../shared/api';
import { ServiceDTO } from '../dtos/ServiceDTO';

export const getAllServices = async (): Promise<ServiceDTO[]> => {
  const response = await api.get('/service');
  return response.data;
};

export const getServiceById = async (id: number): Promise<ServiceDTO> => {
  const response = await api.get(`/service/${id}`);
  return response.data;
};

export const createService = async (data: ServiceDTO): Promise<ServiceDTO> => {
  const response = await api.post('/service', data);
  return response.data;
};

export const updateService = async (id: number, data: ServiceDTO): Promise<ServiceDTO> => {
  const response = await api.put(`/service/${id}`, data);
  return response.data;
};

export const deleteService = async (id: number): Promise<void> => {
  await api.delete(`/service/${id}`);
};