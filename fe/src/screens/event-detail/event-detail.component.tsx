import { useParams } from '@solidjs/router';
import { z } from 'nestjs-zod/z';
import { Subject } from 'rxjs';
import {
  VsCheck,
  VsEdit,
  VsError,
  VsLoading,
  VsQuestion,
} from 'solid-icons/vs';
import { createEffect, createSignal, For, Match, Show, Switch } from 'solid-js';
import { IconButton } from '../../components/icon-button';
import { AddIcon } from '../../components/icons/add-icon';
import { WheelIcon } from '../../components/icons/wheel-icon';
import { Main } from '../../components/main';
import {
  currentEventState,
  getCurrentEventId,
  refetchEvent,
  setCurrentEventId,
  updateEvent,
} from '../../store/events';
import { EventAttributes } from './components/event-attributes';
import { ModalRequest, NewSlideModal } from './components/new-slide-modal';
import styles from './event-detail.module.css';

export const schema = z.object({
  name: z.string().nonempty(),
  screenHeight: z.number().positive().int(),
  screenWidth: z.number().positive().int(),
  date: z.union([z.date(), z.null()]),
});

export type AttributesForm = z.TypeOf<typeof schema>;

export const EventDetail = () => {
  const modalRequest$ = new Subject<ModalRequest>();

  const params = useParams();
  createEffect(() => {
    if (getCurrentEventId() === params.id) {
      refetchEvent();
    } else {
      setCurrentEventId(params.id);
    }
  });
  const [isEditingAttributes, setIsEditingAttributes] = createSignal(false);
  const [formStatus, setFormStatus] = createSignal('ok');
  const [formValues, setFormValues] = createSignal<AttributesForm>({
    name: '',
    screenHeight: 0,
    screenWidth: 0,
    date: null,
  });

  return (
    <Main>
      <header class={styles.mainHeader}>
        <div>
          Event
          <h1>{currentEventState()?.name}</h1>
        </div>
        <div class={styles.buttonList}>
          <Show
            when={isEditingAttributes()}
            fallback={
              <a
                class={styles.controlButton}
                href={`/events/${params.id}/control`}
              >
                <WheelIcon />
                <span class="sr-only">Control</span>
              </a>
            }
          >
            <button
              type="button"
              class={styles.cancelButton}
              onClick={() => setIsEditingAttributes(false)}
            >
              Cancel
            </button>
          </Show>
          <button
            type="button"
            classList={{
              [styles.editButton]: true,
              [styles.ctaColor]:
                !isEditingAttributes() ||
                !['ok', 'invalid'].includes(formStatus()),
              [styles.loadingColor]: currentEventState.loading,
              [styles.angryColor]:
                isEditingAttributes() && formStatus() === 'invalid',
              [styles.happyColor]:
                isEditingAttributes() && formStatus() === 'ok',
            }}
            disabled={isEditingAttributes() && formStatus() !== 'ok'}
            onClick={async () => {
              // be careful - only use this synchronously
              const event = currentEventState();
              if (isEditingAttributes() && event?.id) {
                await updateEvent(event.id, formValues());
                setIsEditingAttributes(false);
              } else {
                setIsEditingAttributes(true);
              }
            }}
          >
            <Switch fallback={<VsEdit viewBox="0 0 16 16" />}>
              <Match when={isEditingAttributes()}>
                <Switch fallback={<VsQuestion viewBox="0 0 16 16" />}>
                  <Match when={formStatus() === 'ok'}>
                    <VsCheck viewBox="0 0 16 16" />
                  </Match>
                  <Match when={formStatus() === 'invalid'}>
                    <VsError viewBox="0 0 16 16" />
                  </Match>
                  <Match when={currentEventState.loading}>
                    <VsLoading viewBox="0 0 16 16" />
                  </Match>
                </Switch>
              </Match>
            </Switch>
          </button>
        </div>
      </header>
      <article class={styles.mainContainer}>
        <EventAttributes
          isEditing={isEditingAttributes}
          formStatus={formStatus}
          setFormStatus={setFormStatus}
          formValues={formValues}
          setFormValues={setFormValues}
        />
      </article>
      <header class={styles.mainHeader}>
        <h1>Slides</h1>
        <IconButton
          icon={AddIcon}
          altText="Add Slide"
          variant="primary"
          onClick={() => {
            modalRequest$.next({
              type: 'add',
            });
          }}
        />
      </header>
      <article class={styles.mainContainer}>
        <For
          each={currentEventState()?.Slides}
          fallback={
            <div class={styles.metaText}>
              No slides defined. Click (+) to add a slide.
            </div>
          }
        >
          {(item) => (
            <button
              type="button"
              onClick={() => {
                modalRequest$.next({
                  type: 'edit',
                  slide: item,
                });
              }}
              class={styles.slideBox}
            >
              {item.name}
            </button>
          )}
        </For>
      </article>
      <NewSlideModal
        eventId={params.id}
        request={modalRequest$.asObservable()}
      />
    </Main>
  );
};
