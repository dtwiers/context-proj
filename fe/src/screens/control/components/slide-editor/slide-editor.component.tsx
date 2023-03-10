import { createEffect, createMemo, createResource, createSignal, For, onMount } from 'solid-js';
import { api } from '../../../../util/api';
import styles from './slide-editor.module.css';

export type SlideEditorProps = {
  setHasUpdates?: (hasUpdates?: boolean) => void;
  eventId: string;
};

export const SlideEditor = (props: SlideEditorProps) => {
  const [selectedSlideId, setSelectedSlideId] = createSignal<string | null>(null);
  const [searchTerm, setSearchTerm] = createSignal('');
  const [currentSlide, { refetch }] = createResource(async () =>
    api.getPresentationSlideId(props.eventId)
  );
  createEffect(() => {
    if (currentSlide.state === 'ready') {
      setSelectedSlideId(currentSlide());
    }
  });
  const [slides] = createResource(() => api.getSlidesForPresentation(props.eventId));

  const filteredSlides = createMemo(
    () =>
      slides()?.filter((slide) => slide.name.toLowerCase().includes(searchTerm().toLowerCase())) ??
      []
  );

  return (
    <div class={styles.mainContainer}>
      <form class={styles.form}>
        <input
          class={styles.searchInput}
          type='search'
          placeholder='search slides'
          onInput={(ev) => setSearchTerm(ev.currentTarget.value)}
        />
      </form>
      <div class={styles.slideContainer}>
        <For each={filteredSlides()}>
          {(item) => (
            <button
              class={styles.slideButton}
              classList={{ [styles.selected]: item.id === selectedSlideId() }}
              type='button'
              title={`Header: ${item.header}\nTitle: ${item.title}\nSubtitle: ${
                item.subtitle
              }\nFooter: ${item.footer}\nMedia: ${item.asset?.label ?? 'None'}`}
              onClick={async () => {
                setSelectedSlideId(item.id);
                await api.switchSlidesForPresentation(props.eventId, item.id);
                refetch();
              }}
            >
              {item.name}
            </button>
          )}
        </For>
      </div>
    </div>
  );
};
