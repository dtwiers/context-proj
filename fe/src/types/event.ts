import { Slide } from './slide';

export type Event = {
  name: string;
  screenHeight: number;
  screenWidth: number;
  date: Date | null;
  currentSlideId: string | null;
  id: string;
  createdAt: Date;
  updatedAt: Date | null;
};

export type EventWithSlides = Event & {
  Slides: Slide[];
};
