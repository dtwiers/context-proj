import { PresentationStatus } from '../../api-interface';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Res,
  Sse,
  MessageEvent,
  UseGuards,
} from '@nestjs/common';
import { PresentationMode, Slide } from '@prisma/client';
import { Response } from 'express';
import {
  catchError,
  filter,
  map,
  merge,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LowerThirdsText, PresentationService } from './presentation.service';

@Controller('presentations')
export class PresentationController {
  constructor(private presentationService: PresentationService) {}

  @Get(':eventId')
  async getStatus(
    @Param('eventId') eventId: string
  ): Promise<PresentationStatus> {
    return this.presentationService.findPresentationStatus(eventId);
  }

  @Get(':eventId/manual')
  async getManualStatus(
    @Param('eventId') eventId: string
  ): Promise<LowerThirdsText> {
    return this.presentationService.getManualData(eventId);
  }

  @Get(':eventId/slide')
  async getSlideId(@Param('eventId') eventId: string): Promise<string> {
    return this.presentationService.getSlideId(eventId);
  }

  @Get(':eventId/slides')
  async getSlides(
    @Param('eventId') eventId: string
  ): Promise<(Slide & { asset: { label: string } })[]> {
    return this.presentationService.getAvailableSlides(eventId);
  }

  @Sse(':eventId/subscribe')
  subscribe(@Param('eventId') eventId: string): Observable<MessageEvent> {
    return merge(
      this.presentationService
        .findPresentationStatus(eventId)
        .then((value) => ({ data: value })),
      new Observable<string>((subscriber) =>
        this.presentationService.subscribe((id) => subscriber.next(id))
      ).pipe(
        filter((id) => id === eventId),
        switchMap(() =>
          this.presentationService.findPresentationStatus(eventId)
        ),
        map((value) => ({ data: value }))
      )
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':eventId/mode')
  async switchMode(
    @Param('eventId') eventId: string,
    @Body('mode') mode: PresentationMode,
    @Res() res: Response
  ) {
    await this.presentationService.switchMode(eventId, mode);
    res.status(204).send();
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':eventId/slide')
  async switchSlide(
    @Param('eventId') eventId: string,
    @Body('slideId') slideId: string,
    @Res() res: Response
  ) {
    await this.presentationService.switchSlide(eventId, slideId);
    res.status(204).send();
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':eventId/data')
  async setManualData(
    @Param('eventId') eventId: string,
    @Body() lowerTextData: LowerThirdsText,
    @Res() res: Response
  ) {
    const normalizedLowerTextData = {
      ...lowerTextData,
      assetId: lowerTextData.assetId || null,
    };
    await this.presentationService.setManualData(
      eventId,
      normalizedLowerTextData
    );
    res.status(204).send();
  }
}
