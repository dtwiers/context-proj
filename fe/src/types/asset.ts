export type Asset = {
  id: string;
  createdAt: Date;
  updatedAt: Date | null;
  filename: string;
  label: string;
  mimetype: string;
  thumb: Blob;
};
