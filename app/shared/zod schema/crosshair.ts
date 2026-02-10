import z from "zod";

//schema for api payload
export const createCrosshairSchema = z.object({
  name: z.string().min(1, "Crosshair name is required"),
  code: z.string().min(1, "Code is required"),
  description: z.string().min(1, "Description is required"),
  imageUrl: z.string().min(1, "Image is required"),
});

export type TCreateCrosshairSchema = z.infer<typeof createCrosshairSchema>;

export const createCrosshairSchemaForm = z.object({
  name: z.string().min(1, "Crosshair name is required!"),
  code: z.string().min(1, "Code is required"),
  description: z.string().min(1, "Description is required"),
  imageUrl: z.string().min(1, "Image is required"),
});

export type TCreateCrosshairSchemaForm = z.infer<
  typeof createCrosshairSchemaForm
>;
