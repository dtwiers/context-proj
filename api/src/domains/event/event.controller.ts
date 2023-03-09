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
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateEventDto, EventsQueryDto, UpdateEventDto } from './dto';
import { EventService } from './event.service';

@Controller('events')
export class EventController {
  constructor(private events: EventService) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.events.event({ id });
  }

  @Get()
  async findMany(@Query() query: EventsQueryDto) {
    return this.events.events({ take: query.limit, skip: query.offset });
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createOne(@Body() body: CreateEventDto) {
    return this.events.createEvent(body as Prisma.EventCreateInput);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteOne(@Param('id') id: string) {
    return this.events.deleteEvent({ id });
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async partialUpdateOne(
    @Param('id') id: string,
    @Body() body: UpdateEventDto
  ) {
    return this.events.updateEvent(
      {
        id,
      },
      body
    );
  }
}
