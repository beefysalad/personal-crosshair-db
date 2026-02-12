import { Crosshair } from "@/app/generated/prisma/client";
import api from "@/lib/axios";
import { TCreateCrosshairSchemaForm } from "../../zod schema/crosshair";

interface CrosshairResponse {
  crosshairs: Crosshair[];
  total: number;
}
export const getCrosshairs = async (
  page: number,
  limit: number
): Promise<CrosshairResponse> => {
  const response = await api.get(`/crosshair?page=${page}&limit=${limit}`);
  return response.data;
};

export const createCrosshair = async (
  values: TCreateCrosshairSchemaForm
): Promise<Crosshair> => {
  const response = await api.post("/crosshair", values);
  return response.data;
};

export const uploadCrosshairPhoto = async (
  data: FormData
): Promise<{ url: string; publicId: string }> => {
  const response = await api.post("/upload", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteCrosshair = async (id: string): Promise<void> => {
  const response = await api.delete("/crosshair", {
    data: { id },
  });
  return response.data;
};
