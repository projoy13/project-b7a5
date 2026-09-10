import { api } from "./api";

export const getAllGear = async () => {
  return api("/api/gear", {
    method: "GET",
  });
};
export const getGearById = async (id: string) => {
  return api(`/api/gear/${id}`, {
    method: "GET",
  });
};