import { IsNumber, IsString } from 'class-validator';

export class EventDto {
  @IsString()
  name: string;

  @IsNumber()
  resolutionX: number;

  @IsNumber()
  resolutionY: number;
}
