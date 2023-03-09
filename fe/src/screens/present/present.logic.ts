import { PresentationStatus } from '../../api-interface';
import { scan, Subject } from 'rxjs';
import { onCleanup, onMount } from 'solid-js';

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
    console.warn(JSON.parse(event.data));
  };
  onMount(() => {
    if (presentationId) {
      eventSource = new EventSource(
        `/api/presentations/${presentationId}/subscribe`
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
