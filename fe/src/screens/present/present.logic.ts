import { PresentationStatus } from '../../api-interface';
import { scan, Subject } from 'rxjs';
import { onCleanup, onMount } from 'solid-js';
import { BASE_API } from '../../util/api-base';

export type Update = {
  prev: PresentationStatus;
  next: PresentationStatus;
};

const createInitialUpdate = (presentationId: string): Update => ({
  next: {
    eventId: presentationId,
    footer: null,
    header: null,
    mode: 'INVISIBLE',
    subtitle: null,
    title: null,
    assetUrl: null,
  },
  prev: {
    eventId: presentationId,
    footer: null,
    header: null,
    mode: 'INVISIBLE',
    subtitle: null,
    title: null,
    assetUrl: null,
  },
});

export const listenForUpdates = (presentationId: string) => {
  const status$ = new Subject<PresentationStatus>();
  let eventSource: EventSource;
  const handleMessage = (event: MessageEvent<string>) => {
    status$.next(JSON.parse(event.data));
  };
  onMount(() => {
    if (presentationId) {
      eventSource = new EventSource(
        `${BASE_API}/presentations/${presentationId}/subscribe`
      );
      eventSource?.addEventListener('message', handleMessage);
    }
  });
  onCleanup(() => {
    eventSource?.removeEventListener('message', handleMessage);
    status$.complete();
  });
  return status$.pipe(
    scan<PresentationStatus, Update>(
      (acc, val) => ({
        prev: acc.next,
        next: val,
      }),
      createInitialUpdate(presentationId)
    )
  );
};
