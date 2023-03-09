import { Paginated } from '../../api-interface';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Prisma, Slide } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateSlideDto, SlidesQueryDto, UpdateSlideDto } from './dto';
import { SlideService } from './slide.service';

@Controller('slides')
export class SlideController {
  constructor(private slides: SlideService) {}

  @Get()
  async findMany(@Query() query: SlidesQueryDto): Promise<Paginated<Slide[]>> {
    return this.slides.slides({
      take: query.limit,
      skip: query.offset,
      where: {
        eventId: query.eventId,
      },
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Slide> {
    return this.slides.slide({ id });
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createOne(@Body() body: CreateSlideDto) {
    return this.slides.createSlide(body as Prisma.SlideUncheckedCreateInput);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteOne(@Param('id') id: string) {
    return this.slides.deleteSlide({ id });
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async partialUpdateOne(
    @Param('id') id: string,
    @Body() body: UpdateSlideDto
  ): Promise<Slide> {
    return this.slides.updateSlide(
      {
        id,
      },
      body
    );
  }
}
