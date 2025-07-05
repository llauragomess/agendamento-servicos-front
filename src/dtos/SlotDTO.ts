import { CustomerDTO } from "./CustomerDTO";
import { ProfessionalDTO } from "./ProfessionalDTO";
import { ServiceDTO } from "./ServiceDTO";

export enum SlotStatus {
  Available = 1,
  Scheduled = 2,
  Canceled = 3,
  Completed = 4
}

export const SlotStatusMap ={
  1: 'Disponível',
  2: 'Agendado',
  3: 'Cancelado',
  4: 'Concluído'
}

export interface SlotDTO {
  id?: number;
  customer: CustomerDTO;
  professional: ProfessionalDTO;
  service: ServiceDTO;
  date: string;
  dateSlotFormatted?: string;
  description: string;
  status?: SlotStatus;
}

export interface CreateSlotDTO {
  customerId: number;
  professionalId: number;
  serviceId: number;
  date: string;
  dateSlotFormatted?: string;
  description: string;
  status?: SlotStatus;
}
