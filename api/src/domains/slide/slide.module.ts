import { Module } from '@nestjs/common';
import { SlideController } from './slide.controller';
import { SlideService } from './slide.service';

@Module({
  controllers: [SlideController],
  providers: [SlideService],
})
export class SlideModule {}
