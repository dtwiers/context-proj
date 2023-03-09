import * as z from 'nestjs-zod/z';
import { unknownToNullableNumber } from './util';

export const ContextImage = z.object({
  url: z.string(),
});

export const ContextBar = z.object({
  header: z.optional(z.string()),
  footer: z.optional(z.string()),
  title: z.optional(z.string()),
  subtitle: z.optional(z.string()),
  image: z.optional(ContextImage),
});

export type ContextImage = z.TypeOf<typeof ContextImage>;
export type ContextBar = z.TypeOf<typeof ContextBar>;

export const CreateEventSchema = z.object({
  name: z.string().nonempty(),
  screenHeight: z.number().int().positive().default(1080),
  screenWidth: z.number().int().positive().default(1920),
  date: z.dateString().optional(),
});

export type CreateEventBody = z.TypeOf<typeof CreateEventSchema>;

export const EventsQuerySchema = z.object({
  limit: z
    .preprocess(unknownToNullableNumber, z.number().int().positive().optional())
    .default(20),
  offset: z.preprocess(
    unknownToNullableNumber,
    z.number().int().nonnegative().optional()
  ),
});

export type EventsQuery = z.TypeOf<typeof EventsQuerySchema>;

export const UpdateEventSchema = z.object({
  name: z.string().optional(),
  screenHeight: z.number().int().positive().optional(),
  screenWidth: z.number().int().positive().optional(),
  date: z.union([z.dateString(), z.null()]),
});

export type UpdateEventBody = z.TypeOf<typeof UpdateEventSchema>;

export const UpdateSlideSchema = z.object({
  id: z.string().cuid(),
  name: z.string().nonempty().optional(),
  eventId: z.string().cuid().optional(),
  order: z.number().nonnegative().int().optional(),
  header: z.string().optional(),
  footer: z.string().optional(),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  assetId: z.string().cuid().optional(),
});

export type UpdateSlideBody = z.TypeOf<typeof UpdateSlideSchema>;

export const SlidesQuerySchema = z.object({
  limit: z.preprocess(
    unknownToNullableNumber,
    z.number().int().positive().optional()
  ),
  offset: z.preprocess(
    unknownToNullableNumber,
    z.number().int().nonnegative().optional()
  ),
  eventId: z.string().cuid().optional(),
});

export type SlidesQuery = z.TypeOf<typeof SlidesQuerySchema>;

export const CreateSlideSchema = z.object({
  name: z.string().nonempty(),
  eventId: z.string().cuid(),
  order: z.number().nonnegative().int().optional(),
  header: z.string().optional(),
  footer: z.string().optional(),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  assetId: z.string().optional(),
});

export type CreateSlideBody = z.TypeOf<typeof CreateSlideSchema>;

export const UpdateFileMetaSchema = z.object({
  name: z.string().nonempty().optional(),
});

export type UpdateFileMetaBody = z.TypeOf<typeof UpdateFileMetaSchema>;

export const CreateUserSchema = z.object({
  name: z.string().nonempty(),
  username: z.string().nonempty(),
  password: z.string().nonempty(),
}).required();

export type CreateUserBody = z.TypeOf<typeof CreateUserSchema>;

export const UpdateUserSchema = z.object({
  name: z.string().nonempty().optional(),
  username: z.string().nonempty().optional(),
  id: z.string().cuid().nonempty(),
}).required();

export type UpdateUserBody = z.TypeOf<typeof UpdateUserSchema>;

export type User = {
  id: string;
  name: string;
  username: string;
  lastLoggedIn?: Date | null;
};

export type UserWithoutId = Omit<User, 'id'>;
