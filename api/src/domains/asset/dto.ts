import { UpdateFileMetaSchema } from '../../api-interface';
import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export class CreateAssetDto extends createZodDto(
  z.object({
    name: z.string().nonempty(),
    file: z.any(),
  })
) {}

export class UpdateAssetDto extends createZodDto(UpdateFileMetaSchema) {}
