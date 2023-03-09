import { Paginated } from '../../api-interface';
import { Injectable } from '@nestjs/common';
import { Event, Prisma } from '@prisma/client';
import { paginate } from '../../pagination';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {}

  async event(
    eventWhereUniqueInput: Prisma.EventWhereUniqueInput
  ): Promise<Event | null> {
    return this.prisma.event.findUnique({
      where: eventWhereUniqueInput,
      include: {
        Slides: {
          include: {
            asset: { select: { id: true, label: true, thumbnail: true } },
          },
        },
      },
    });
  }

  async events(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.EventWhereUniqueInput;
    where?: Prisma.EventWhereInput;
  }): Promise<Paginated<Event[]>> {
    const [count, results] = await Promise.all([
      this.prisma.event.count({ where: params.where }),
      this.prisma.event.findMany({
        take: 20,
        ...params,
        orderBy: [{ createdAt: 'desc' }],
      }),
    ]);
    return paginate(results, count, params.skip ?? 0, params.take ?? 20);
  }

  async createEvent(data: Prisma.EventCreateInput): Promise<Event> {
    return this.prisma.event.create({ data });
  }

  async updateEvent(
    where: Prisma.EventWhereUniqueInput,
    data: Prisma.EventUpdateInput
  ): Promise<Event> {
    return this.prisma.event.update({
      where,
      data: { ...data, updatedAt: new Date() },
    });
  }

  async deleteEvent(where: Prisma.EventWhereUniqueInput): Promise<Event> {
    return this.prisma.event.delete({ where });
  }
}
