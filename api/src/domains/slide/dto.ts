import {
  CreateSlideSchema,
  SlidesQuerySchema,
  UpdateSlideSchema,
} from '../../api-interface';
import { createZodDto } from 'nestjs-zod';

export class UpdateSlideDto extends createZodDto(UpdateSlideSchema) {}
export class SlidesQueryDto extends createZodDto(SlidesQuerySchema) {}
export class CreateSlideDto extends createZodDto(CreateSlideSchema) {}
