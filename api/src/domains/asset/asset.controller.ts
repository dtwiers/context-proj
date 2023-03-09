import {
  Body,
  Controller,
  Delete,
  Get,
  MaxFileSizeValidator,
  NotFoundException,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  Res,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { read } from 'jimp';
import 'multer';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AssetService } from './asset.service';
import { CreateAssetDto, UpdateAssetDto } from './dto';

@Controller('assets')
export class AssetController {
  constructor(private assets: AssetService) {}

  @Get()
  async findMany(@Query('q') querystring: string) {
    if (querystring) {
      return this.assets.getAssets({
        where: { label: { contains: querystring, mode: 'insensitive' } },
      });
    }
    return this.assets.getAssets({});
  }

  @Get(':id/meta')
  async findOne(@Param('id') id: string) {
    const asset = await this.assets.getAsset({ id });
    if (asset) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { data, thumbnail, ...filteredAsset } = asset;
      return filteredAsset;
    }
    throw new NotFoundException();
  }

  @Get(':id')
  async findFile(
    @Res({ passthrough: true }) res: Response,
    @Param('id') id: string
  ): Promise<StreamableFile> {
    const asset = await this.assets.getAsset({ id });
    res.set({
      'Content-Type': asset.mimetype,
      'Content-Disposition': `attachment; filename="${asset.filename.replace(
        /"/,
        '\\"'
      )}"`,
    });
    return new StreamableFile(asset.data);
  }

  @Get(':id/thumb')
  async findThumbnail(
    @Res({ passthrough: true }) res: Response,
    @Param('id') id: string
  ): Promise<StreamableFile> {
    const asset = await this.assets.getAsset({ id });
    res.set({
      'Content-Type': 'image/jpeg',
      'Content-Disposition': `attachment; filename="${asset.thumbnailName}"`,
    });
    return new StreamableFile(asset.thumbnail);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createAsset(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 20 * 1024 * 1024 })],
      })
    )
    file: Express.Multer.File,
    @Body() body: CreateAssetDto
  ) {
    const thumbBuffer = await this.generateThumb(file.buffer);
    const resizedBuffer = await this.generateImage(file.buffer);
    await this.assets.createAsset({
      data: {
        label: body.name,
        data: resizedBuffer,
        filename: file.originalname,
        mimetype: 'image/png',
        thumbnail: thumbBuffer,
        thumbnailName: `${file.originalname}.thumbnail.jpeg`,
      },
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteOne(@Param('id') id: string) {
    return this.assets.deleteAsset({ id });
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/meta')
  async updateFileMeta(@Param('id') id: string, @Body() body: UpdateAssetDto) {
    return this.assets.updateAssetMeta({ id }, { label: body.name });
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  async reuploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 20000 })],
      })
    )
    file: Express.Multer.File,
    @Param('id') id: string
  ) {
    const thumbBuffer = await this.generateThumb(file.buffer);
    const resizedBuffer = await this.generateImage(file.buffer);
    const asset = await this.assets.replaceAssetData(
      { id },
      resizedBuffer,
      thumbBuffer,
      file.filename,
      `${file.filename}.thumbnail.jpeg`
    );
    return asset;
  }

  private async generateThumb(imageBuffer: Buffer): Promise<Buffer> {
    const jmp = await read(imageBuffer);
    return await new Promise<Buffer>((resolve, reject) =>
      jmp
        .clone()
        .scaleToFit(290, 190)
        .quality(80)
        .getBuffer('image/jpeg', (err, buffer) => {
          if (err) {
            reject(err);
          } else {
            resolve(buffer);
          }
        })
    );
  }

  private async generateImage(imageBuffer: Buffer): Promise<Buffer> {
    const jmp = await read(imageBuffer);
    return await new Promise<Buffer>((resolve, reject) =>
      jmp
        .clone()
        .scaleToFit(290, 190)
        .getBuffer('image/png', (err, buffer) => {
          if (err) {
            reject(err);
          } else {
            resolve(buffer);
          }
        })
    );
  }
}
