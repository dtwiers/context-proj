import { PresentationStatus } from '../../api-interface';
import { Injectable } from '@nestjs/common';
import { Presentation, PresentationMode, Slide } from '@prisma/client';
import { Subject, Subscription } from 'rxjs';
import { PrismaService } from '../../prisma/prisma.service';

export type LowerThirdsText = {
  footer?: string | null;
  header?: string | null;
  title?: string | null;
  subtitle?: string | null;
  assetId?: string | null;
};

@Injectable()
export class PresentationService {
  backingSubject = new Subject<string>();
  constructor(private prisma: PrismaService) {}

  async switchMode(eventId: string, mode: PresentationMode): Promise<void> {
    if (!mode || typeof mode !== 'string') {
      console.error('Oh Nos! mode is blank for no apparent reason: ', mode);
      throw new Error('Rawr');
    }
    try {
      const { mode: currentMode } = await this.prisma.presentation.findUnique({
        where: { eventId },
        select: { mode: true },
      });
      await this.prisma.presentation.update({
        where: { eventId },
        data: {
          mode,
          previousMode: currentMode,
        },
      });
      this.backingSubject.next(eventId);
    } catch (e) {
      console.log(e);
    }
  }

  async switchSlide(eventId: string, slideId: string | null): Promise<void> {
    await this.prisma.presentation.update({
      where: { eventId },
      data: {
        slideId,
      },
    });
    this.backingSubject.next(eventId);
  }

  async setManualData(eventId: string, text: LowerThirdsText): Promise<void> {
    await this.prisma.presentation.update({
      where: { eventId },
      data: text,
    });
    this.backingSubject.next(eventId);
  }

  async ensureExists(eventId: string) {
    const presentationExists = await this.prisma.presentation.count({
      where: {
        eventId,
      },
    });

    if (!presentationExists) {
      await this.prisma.presentation.create({
        data: {
          mode: 'INVISIBLE',
          eventId,
        },
      });
    }
  }

  async getManualData(eventId: string): Promise<LowerThirdsText> {
    await this.ensureExists(eventId);
    const result = await this.prisma.presentation.findUnique({
      where: { eventId },
    });
    return {
      assetId: result.assetId,
      header: result.header,
      title: result.title,
      subtitle: result.subtitle,
      footer: result.footer,
    };
  }

  async getSlideId(eventId: string): Promise<string> {
    await this.ensureExists(eventId);
    const result = await this.prisma.presentation.findUnique({
      where: { eventId },
    });
    return result.slideId;
  }

  async getAvailableSlides(eventId: string): Promise<
    (Slide & {
      asset: {
        label: string;
      };
    })[]
  > {
    return this.prisma.slide.findMany({
      where: { eventId },
      include: { asset: { select: { label: true } } },
      orderBy: { name: 'asc' },
    });
  }

  public subscribe(callback: (id: string) => void): Subscription {
    const subscription = new Subscription();
    subscription.add(this.backingSubject.subscribe(callback));
    return subscription;
  }

  private calculateTextValue(
    mode: PresentationMode,
    previousMode: PresentationMode,
    manualValue: string,
    slideValue: string
  ): string | null {
    if (mode === 'INVISIBLE' && previousMode === 'MANUAL') {
      return manualValue;
    }
    if (mode === 'INVISIBLE' && previousMode === 'SLIDE') {
      return slideValue;
    }
    if (mode === 'MANUAL') {
      return manualValue;
    }
    if (mode === 'SLIDE') {
      return slideValue;
    }
    return null;
  }

  async findPresentationStatus(eventId: string): Promise<PresentationStatus> {
    await this.ensureExists(eventId);

    const presentation = await this.prisma.presentation.findUnique({
      where: { eventId },
      include: {
        Asset: { select: { filename: true } },
        Slide: {
          select: {
            assetId: true,
            header: true,
            footer: true,
            title: true,
            subtitle: true,
          },
        },
      },
    });

    return {
      eventId,
      footer: this.calculateTextValue(
        presentation.mode,
        presentation.previousMode,
        presentation.footer,
        presentation.Slide?.footer
      ),
      header: this.calculateTextValue(
        presentation.mode,
        presentation.previousMode,
        presentation.header,
        presentation.Slide?.header
      ),
      title: this.calculateTextValue(
        presentation.mode,
        presentation.previousMode,
        presentation.title,
        presentation.Slide?.title
      ),
      subtitle: this.calculateTextValue(
        presentation.mode,
        presentation.previousMode,
        presentation.subtitle,
        presentation.Slide?.subtitle
      ),
      assetUrl: this.calculateTextValue(
        presentation.mode,
        presentation.previousMode,
        presentation.assetId,
        presentation.Slide?.assetId
      ),
      mode: presentation.mode,
    };
  }
}
