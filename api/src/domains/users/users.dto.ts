import {
  CreateUserSchema,
  UpdateUserSchema,
} from '../../api-interface';
import { createZodDto } from 'nestjs-zod';

export class CreateUserDto extends createZodDto(CreateUserSchema) {}

export class UpdateUserDto extends createZodDto(UpdateUserSchema) {}
