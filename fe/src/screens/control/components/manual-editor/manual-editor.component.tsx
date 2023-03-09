import { useParams } from '@solidjs/router';
import { SelectAssetModal } from '../../../../components/select-asset-modal';
import { createEffect, createMemo, createResource, createSignal, Show } from 'solid-js';
import styles from './manual-editor.module.css';
import { SlideState } from '../../../../types/slide-state';
import { api } from '../../../../util/api';

type ItemType = keyof SlideState;

export type ManualEditorProps = {
  setHasUpdates?: (hasUpdates: boolean) => void;
};

export const ManualEditor = (props: ManualEditorProps) => {
  let modalRef: HTMLDialogElement | undefined;
  const eventId = useParams().id;
  const [resource, { refetch }] = createResource(
    (): Promise<SlideState> => api.getManualPresentationState(eventId)
  );
  const [header, setHeader] = createSignal<string>('');
  const [title, setTitle] = createSignal<string>('');
  const [subtitle, setSubtitle] = createSignal<string>('');
  const [footer, setFooter] = createSignal<string>('');
  const [assetId, setAssetId] = createSignal<string>('');
  const [trackChanges, setTrackChanges] = createSignal(true);

  createEffect(() => {
    if (resource.state === 'ready') {
      setTrackChanges(false);
      setHeader(resource().header ?? '');
      setTitle(resource().title ?? '');
      setSubtitle(resource().subtitle ?? '');
      setFooter(resource().footer ?? '');
      setAssetId(resource().assetId ?? '');
      setTrackChanges(true);
    }
  });

  const changedItems = createMemo<Set<ItemType>>(() => {
    const items = new Set<ItemType>();
    if (resource.state !== 'ready') {
      return items;
    }
    if (resource().header !== header()) {
      items.add('header');
    }
    if (resource().title !== title()) {
      items.add('title');
    }
    if (resource().subtitle !== subtitle()) {
      items.add('subtitle');
    }
    if (resource().footer !== footer()) {
      items.add('footer');
    }
    if ((resource().assetId ?? '') !== assetId()) {
      items.add('assetId');
    }
    return items;
  });

  createEffect((prev: boolean) => {
    const hasChangedItems = changedItems().size > 0;
    if (hasChangedItems !== prev) {
      props.setHasUpdates?.(hasChangedItems);
    }
    return hasChangedItems;
  }, changedItems().size > 0);

  const [assetLabel] = createResource<string, string>(assetId, async (assetId) => {
    if (assetId) {
      return (await api.getAssetMeta(assetId)).label;
    }
    return '';
  });

  createEffect(() => {
    if (resource.state === 'ready') {
      setHeader(resource().header ?? '');
      setTitle(resource().title ?? '');
      setSubtitle(resource().subtitle ?? '');
      setFooter(resource().footer ?? '');
    }
  });

  return (
    <form action='#' class={styles.manualEditorForm}>
      <div class={styles.inputGroup}>
        <label for='header-input'>
          Header
          <Show when={changedItems().has('header')}>
            <span class={styles.changedItem}>*</span>
          </Show>
        </label>
        <input
          id='header-input'
          type='text'
          value={header()}
          onInput={(ev) => trackChanges() && setHeader(ev.currentTarget.value)}
        />
      </div>
      <div class={styles.inputGroup}>
        <label for='title-input'>
          Title
          <Show when={changedItems().has('title')}>
            <span class={styles.changedItem}>*</span>
          </Show>
        </label>
        <input
          id='title-input'
          type='text'
          value={title()}
          onInput={(ev) => trackChanges() && setTitle(ev.currentTarget.value)}
        />
      </div>
      <div class={styles.inputGroup}>
        <label for='subtitle-input'>
          Subtitle
          <Show when={changedItems().has('subtitle')}>
            <span class={styles.changedItem}>*</span>
          </Show>
        </label>
        <input
          id='subtitle-input'
          type='text'
          value={subtitle()}
          onInput={(ev) => trackChanges() && setSubtitle(ev.currentTarget.value)}
        />
      </div>
      <div class={styles.inputGroup}>
        <label for='footer-input'>
          Footer
          <Show when={changedItems().has('footer')}>
            <span class={styles.changedItem}>*</span>
          </Show>
        </label>
        <input type='text' value={footer()} onInput={(ev) => trackChanges() && setFooter(ev.currentTarget.value)} />
      </div>
      <div class={styles.inputGroup}>
        <span>
          Media
          <Show when={changedItems().has('assetId')}>
            <span class={styles.changedItem}>*</span>
          </Show>
        </span>
        <button
          type='button'
          onClick={() => modalRef?.showModal()}
          class={styles.selectAssetButton}
        >
          {assetLabel() || 'Select Media'}
        </button>
      </div>
      <SelectAssetModal ref={modalRef} setAssetId={setAssetId} />
      <button
        class={styles.submitButton}
        disabled={changedItems().size === 0}
        type='submit'
        onClick={async () => {
          await api.setManualPresentationState(eventId, {
            header: header(),
            title: title(),
            subtitle: subtitle(),
            footer: footer(),
            assetId: assetId(),
          });
          setTrackChanges(false);
          await refetch();
          setTimeout(() => setTrackChanges(true), 3);
        }}
      >
        Update
      </button>
    </form>
  );
};
