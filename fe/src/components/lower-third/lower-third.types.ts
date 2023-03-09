import type { LowerThirdProps } from './lower-third.component';

export type ObservableProps = Pick<
  LowerThirdProps,
  'header' | 'footer' | 'title' | 'subtitle' | 'assetId' | 'mode'
>;
export type Update = {
  prev: ObservableProps;
  next: ObservableProps;
};

export type TextStatus = {
  value: string;
  fading: 'in' | 'out';
  transition: boolean;
};
