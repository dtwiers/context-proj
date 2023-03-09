import { Paginated } from '../api-interface';
import { createResource } from 'solid-js';
import { api } from '../util/api';

export type Asset = {
  id: string;
  createdAt: Date;
  updatedAt: Date | null;
  filename: string;
  label: string;
  mimetype: string;
  thumb: Blob;
};

export const [assetsState, { refetch: refetchAssets }] = createResource<
  Paginated<Asset[]>
>(async () => api.getAssets());
