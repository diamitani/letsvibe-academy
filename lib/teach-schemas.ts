/**
 * Shared zod schemas for the admin side.
 * Imported by BOTH the API routes (server validation) and the client forms
 * (client-side validation before POST) so the contract stays in one place.
 */
import { z } from "zod";

/** URL-safe slugs: lowercase letters, numbers, hyphens (e.g. "vibe-coding-101"). */
export const slugSchema = z
  .string()
  .trim()
  .min(1, "Slug is required")
  .max(120)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Use lowercase letters, numbers, and hyphens only (e.g. vibe-coding-101)",
  );

/** Treat "" as "not provided" for optional text/number fields. */
const emptyToUndefined = (v: unknown) =>
  typeof v === "string" && v.trim() === "" ? undefined : v;

// ---------------------------------------------------------------- courses ---
export const courseCreateSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  slug: slugSchema,
  description: z.string().trim().min(1, "Description is required"),
  category: z.string().trim().min(1, "Category is required").max(80),
  level: z.string().trim().min(1, "Level is required").max(40),
  isFree: z.boolean(),
  isPublished: z.boolean(),
});

export const courseUpdateSchema = courseCreateSchema.partial();

export type CourseCreateInput = z.infer<typeof courseCreateSchema>;

// --------------------------------------------------------------- chapters ---
export const chapterCreateSchema = z.object({
  courseId: z.string().min(1),
  title: z.string().trim().min(1, "Title is required").max(200),
  isPublished: z.boolean().default(false),
  isFreePreview: z.boolean().default(false),
});

export const chapterUpdateSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200).optional(),
  position: z.number().int().min(0).optional(),
  isPublished: z.boolean().optional(),
  isFreePreview: z.boolean().optional(),
});

export type ChapterCreateInput = z.infer<typeof chapterCreateSchema>;

// ---------------------------------------------------------------- lessons ---
export const lessonKindSchema = z.enum(["video", "article", "quiz", "lab"]);
export type LessonKind = z.infer<typeof lessonKindSchema>;

export const lessonCreateSchema = z.object({
  chapterId: z.string().min(1),
  title: z.string().trim().min(1, "Title is required").max(200),
  kind: lessonKindSchema,
  contentUrl: z.preprocess(
    emptyToUndefined,
    z.string().trim().max(2000).optional(),
  ),
  bodyMd: z.preprocess(emptyToUndefined, z.string().optional()),
  durationMin: z.preprocess(
    emptyToUndefined,
    z.coerce.number().int().positive().max(600).optional(),
  ),
});

export const lessonUpdateSchema = lessonCreateSchema
  .omit({ chapterId: true })
  .partial();

export type LessonCreateInput = z.infer<typeof lessonCreateSchema>;

// --------------------------------------------------------------- companies ---
export const companyCreateSchema = z.object({
  name: z.string().trim().min(1, "Company name is required").max(120),
  slug: slugSchema,
});

export const memberAddSchema = z
  .object({
    companyId: z.string().min(1),
    userId: z.string().trim().min(1).optional(),
    email: z
      .preprocess(emptyToUndefined, z.string().trim().email("Enter a valid email").optional()),
  })
  .refine((v) => v.userId || v.email, {
    message: "Provide an email or a user ID",
  });

export const seatAssignSchema = z.object({
  companyId: z.string().min(1),
  userId: z.string().min(1),
  courseId: z.string().min(1),
});
