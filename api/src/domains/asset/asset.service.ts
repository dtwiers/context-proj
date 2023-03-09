import { Paginated } from '../../api-interface';
import { Injectable } from '@nestjs/common';
import { Asset, Prisma } from '@prisma/client';
import { paginate } from '../../pagination';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AssetService {
  constructor(private prisma: PrismaService) {}

  async getAsset(
    assetWhereUniqueInput: Prisma.AssetWhereUniqueInput,
    throwOnFail?: boolean
  ): Promise<Asset | null> {
    if (throwOnFail) {
      return this.prisma.asset.findUniqueOrThrow({
        where: assetWhereUniqueInput,
      });
    }
    return this.prisma.asset.findUnique({ where: assetWhereUniqueInput });
  }

  async getAssets(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.AssetWhereUniqueInput;
    where?: Prisma.AssetWhereInput;
  }): Promise<
    Paginated<
      Pick<Asset, 'id' | 'createdAt' | 'filename' | 'label' | 'mimetype'>[]
    >
  > {
    const [count, results] = await Promise.all([
      this.prisma.asset.count({ where: params.where }),
      this.prisma.asset.findMany({
        take: 20,
        ...params,
        orderBy: { updatedAt: 'desc' },
        select: {
          id: true,
          createdAt: true,
          filename: true,
          label: true,
          mimetype: true,
        },
      }),
    ]);
    return paginate(results, count, params.skip ?? 0, params.take ?? 20);
  }

  async createAsset(params: { data: Prisma.AssetCreateInput }): Promise<Asset> {
    return this.prisma.asset.create({
      data: { ...params.data, updatedAt: new Date() },
    });
  }

  async deleteAsset(where: Prisma.AssetWhereUniqueInput): Promise<Asset> {
    return this.prisma.asset.delete({ where });
  }

  async replaceAssetData(
    where: Prisma.AssetWhereUniqueInput,
    image: Buffer,
    thumb: Buffer,
    fileName: string,
    thumbnailName: string
  ) {
    return this.prisma.asset.update({
      where,
      data: {
        data: image,
        thumbnail: thumb,
        filename: fileName,
        thumbnailName: thumbnailName,
        updatedAt: new Date(),
      },
    });
  }

  async updateAssetMeta(
    where: Prisma.AssetWhereUniqueInput,
    data: Omit<Prisma.AssetUpdateInput, 'data' | 'thumbnail'>
  ) {
    return this.prisma.asset.update({
      where,
      data: { ...data, updatedAt: new Date() },
    });
  }
}
