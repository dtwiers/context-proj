import { Paginated } from '../../api-interface';
import { Injectable } from '@nestjs/common';
import { Prisma, Slide } from '@prisma/client';
import { paginate } from '../../pagination';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SlideService {
  constructor(private prisma: PrismaService) {}

  async slide(
    slideWhereUniqueInput: Prisma.SlideWhereUniqueInput
  ): Promise<Slide | null> {
    return this.prisma.slide.findUnique({ where: slideWhereUniqueInput });
  }

  async slides(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.SlideWhereUniqueInput;
    where?: Prisma.SlideWhereInput;
    orderBy?: Prisma.SlideOrderByWithRelationInput;
  }): Promise<Paginated<Slide[]>> {
    const [count, results] = await Promise.all([
      this.prisma.slide.count({ where: params.where }),
      this.prisma.slide.findMany({
        orderBy: {
          name: 'asc',
        },
        ...params,
      }),
    ]);

    return paginate(results, count, params.skip ?? 0, params.take ?? count);
  }

  async createSlide(data: Prisma.SlideUncheckedCreateInput): Promise<Slide> {
    // normalize assetId
    if (!data.assetId) {
      data.assetId = undefined;
    }
    // verify foreign records exist
    if (data.assetId) {
      await this.prisma.asset.findUniqueOrThrow({
        where: { id: data.assetId },
        select: {
          id: true,
        },
      });
    }

    await this.prisma.event.findUniqueOrThrow({
      where: { id: data.eventId },
      select: {
        id: true,
      },
    });

    return this.prisma.slide.create({ data });
  }

  async deleteSlide(where: Prisma.SlideWhereUniqueInput): Promise<Slide> {
    return await this.prisma.slide.delete({ where });
  }

  async updateSlide(
    where: Prisma.SlideWhereUniqueInput,
    data: Prisma.SlideUpdateInput
  ): Promise<Slide> {
    await this.prisma.slide.update({ where, data });
    return this.prisma.slide.findUnique({ where });
  }
}
