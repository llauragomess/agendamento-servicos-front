import { CustomerDTO } from "./CustomerDTO";
import { ProfessionalDTO } from "./ProfessionalDTO";
import { ServiceDTO } from "./ServiceDTO";

export interface SlotDTO {
  id?: number;
  customer: CustomerDTO;
  professional: ProfessionalDTO;
  service: ServiceDTO;
  date: string;
  dateSlotFormatted?: string;
  description: string;
  status?: string;
}

export interface CreateSlotDTO {
  customerId: number;
  professionalId: number;
  serviceId: number;
  date: string;
  dateSlotFormatted?: string;
  description: string;
  status?: string;
}
