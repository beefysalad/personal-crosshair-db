import z from "zod";

//schema for api payload
export const createCrosshairSchema = z.object({
  name: z.string().min(1, "Crosshair name is required"),
  code: z.string().min(1, "Code is required"),
  description: z.string().optional(),
  imageUrl: z.string().min(1, "Image is required"),
  imagePublicId: z.string().min(1, "Image public id is required"),
});

export type TCreateCrosshairSchema = z.infer<typeof createCrosshairSchema>;

export const createCrosshairSchemaForm = z.object({
  name: z.string().min(1, "Crosshair name is required!"),
  code: z.string().min(1, "Code is required"),
  description: z.string().optional(),
  imageUrl: z.string().min(1, "Image is required"),
  imagePublicId: z.string().min(1, "Image public id is required"),
});

export type TCreateCrosshairSchemaForm = z.infer<
  typeof createCrosshairSchemaForm
>;
