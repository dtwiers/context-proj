import {
  CreateEventSchema,
  EventsQuerySchema,
  UpdateEventSchema,
} from '../../api-interface';
import { createZodDto } from 'nestjs-zod';

export class CreateEventDto extends createZodDto(CreateEventSchema) {}
export class EventsQueryDto extends createZodDto(EventsQuerySchema) {}
export class UpdateEventDto extends createZodDto(UpdateEventSchema) {}
