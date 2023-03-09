import { api } from '../../../../util/api';
import { VsTrash } from 'solid-icons/vs';
import { createEffect, createSignal, onCleanup, Show } from 'solid-js';
import { refetchEvents } from '../../../../store';
import styles from './event-box.module.css';
import type { Event } from '../../../../types';

const apiDeleteEvent = (eventId: string): Promise<void> =>
  api.deleteEvent(eventId);

type EventBoxProps = {
  event: Event;
};

export const EventBox = (props: EventBoxProps) => {
  const [deleting, setDeleting] = createSignal<boolean>(false);
  const [oneShotDeleting, setOneShot] = createSignal<boolean>(false);
  const resetDeleting = () => {
    setOneShot(() => false);
    setTimeout(() => setDeleting(false), 300);
  };
  const startDeleting = () => {
    setDeleting(true);
    setTimeout(() => setOneShot(true), 1);
  };

  // timeouts suck type-wise.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let timeout: any;
  createEffect(() => {
    if (deleting()) {
      document.addEventListener('click', resetDeleting);
      timeout = setTimeout(resetDeleting, 5000);
    } else {
      document.removeEventListener('click', resetDeleting);
    }
  });
  onCleanup(() => {
    document.removeEventListener('click', resetDeleting);
    if (timeout) {
      clearTimeout(timeout);
    }
  });
  const deleteEvent = async () => {
    if (deleting()) {
      await apiDeleteEvent(props.event.id);
      refetchEvents();
    } else {
      startDeleting();
    }
  };
  return (
    <div class={styles.eventContainer}>
      <div class={styles.primaryContainer}>
        <a class={styles.eventLink} href={`/events/${props.event.id}`}>
          <div class={styles.headingContainer}>
            <h2 class={styles.boxtitle}>{props.event.name}</h2>
          </div>
          <div class={styles.attributesContainer}>
            <span>
              {props.event.screenWidth} x {props.event.screenHeight}
            </span>
            <Show when={props.event.date}>
              <span>
                {new Intl.DateTimeFormat('en-US').format(
                  props.event.date ?? undefined
                )}
              </span>
            </Show>
          </div>
        </a>
        <div
          class={styles.confirmDeleteText}
          classList={{
            [styles.confirmDeleteTransitionOn]:
              !oneShotDeleting() && deleting(),
            [styles.confirmDeleteTransitionOff]:
              oneShotDeleting() && !deleting(),
            [styles.confirmDeleteVisible]: oneShotDeleting() || deleting(),
          }}
        >
          Click again to confirm delete.
        </div>
      </div>
      <div class={styles.optionList}>
        <button
          type="button"
          classList={{
            [styles.optionButton]: true,
            [styles.trash]: !deleting() || !oneShotDeleting(),
            [styles.invertedTrashButton]: deleting() && oneShotDeleting(),
          }}
          onClick={deleteEvent}
        >
          <VsTrash viewBox="0 0 16 16" />
          <span class="sr-only">Delete</span>
        </button>
      </div>
    </div>
  );
};
