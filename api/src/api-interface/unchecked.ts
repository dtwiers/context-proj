export type PresentationMode = 'INVISIBLE' | 'EMPTY' | 'MANUAL' | 'SLIDE';
export type PresentationStatus = {
  eventId: string;
  assetUrl?: string | null;
  mode: PresentationMode;
  header: string | null;
  footer: string | null;
  title: string | null;
  subtitle: string | null;
};
