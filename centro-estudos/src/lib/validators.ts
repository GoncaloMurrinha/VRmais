import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Introduz um email válido."),
  password: z.string().min(8, "A palavra-passe deve ter pelo menos 8 caracteres."),
});

export const sessionSchema = z
  .object({
    title: z.string().min(3),
    description: z.string().min(10),
    category: z.string().min(2),
    tutorName: z.string().min(3),
    location: z.string().min(2),
    startAt: z.string().min(1),
    endAt: z.string().min(1),
    capacity: z.coerce.number().int().min(1).max(99),
    isPublished: z.string().optional(),
  })
  .transform((data) => ({
    ...data,
    isPublished: data.isPublished === "on",
  }))
  .refine((data) => new Date(data.endAt) > new Date(data.startAt), {
    message: "A hora de fim deve ser posterior ao início.",
    path: ["endAt"],
  });

export const resourceSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  category: z.string().min(2),
  isPublished: z.string().optional(),
});

export const aboutPhotoSchema = z.object({
  title: z.string().min(2),
  isPublished: z.string().optional(),
});
