import { api } from "../shared/api";
import { CustomerDTO } from "../dtos/CustomerDTO";

export async function getCustomer(id: number) {
  const { data } = await api.get(`/customer/${id}`);
  return data;
}

export async function createCustomer(cliente: CustomerDTO) {
  const { data } = await api.post("/customer", cliente);
  return data;
}

export async function updateCustomer(id: number, cliente: CustomerDTO) {
  const { data } = await api.put(`/customer/${id}`, cliente);
  return data;
}

export async function deleteCustomer(id: number) {
  await api.delete(`/customer/${id}`);
}
