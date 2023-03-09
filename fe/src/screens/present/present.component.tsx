import { useParams } from '@solidjs/router';
import { from } from 'solid-js';
import { LowerThird } from '../../components/lower-third';
import { listenForUpdates } from './present.logic';

export const Present = () => {
  const params = useParams();
  const foo = from(listenForUpdates(params.id));

  return (
    <LowerThird
      {...foo()?.next}
      mode={foo()?.next.mode ?? 'INVISIBLE'}
      assetId={foo()?.next.assetUrl}
    />
  );
};
