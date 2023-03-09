export type Slide = {
  id: string;
  name: string;
  assetId: string | null;
  eventId: string;
  order: number;
  header: string | null;
  footer: string | null;
  title: string | null;
  subtitle: string | null;
  createdAt: Date;
  updatedAt: Date | null;
};
