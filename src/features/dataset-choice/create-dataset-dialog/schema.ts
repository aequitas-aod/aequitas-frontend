import { z } from "zod";

export const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string().min(5, {
    message: "Description must be at least 5 characters.",
  }),
});

export type FormValues = z.infer<typeof FormSchema>;
