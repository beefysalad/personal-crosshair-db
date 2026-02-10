import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCrosshair,
  deleteCrosshair,
  getCrosshairs,
  uploadCrosshairPhoto,
} from "./crosshair-service";
import { useRouter } from "next/navigation";

export const useGetCrosshairs = (page: number, limit: number) => {
  return useQuery({
    queryKey: ["crosshair", page, limit],
    queryFn: () => getCrosshairs(page, limit),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateCrosshair = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: createCrosshair,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crosshair"] });
      router.push("/");
    },
  });
};

export const useUploadCrosshair = () => {
  return useMutation({
    mutationFn: (data: FormData) => uploadCrosshairPhoto(data),
    onError: (error) => {
      console.error("Upload failed", error);
    },
  });
};

export const useDeleteCrosshair = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCrosshair(id),
    onError: (error) => {
      console.error("Delete failed", error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crosshair"] });
    },
  });
};
