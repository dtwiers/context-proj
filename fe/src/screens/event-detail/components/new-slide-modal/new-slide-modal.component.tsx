import { CreateSlideSchema } from '../../../../api-interface';
import { refetchEvent } from '../../../../store';
import { createResource, createSignal, onCleanup, onMount } from 'solid-js';
import { LowerThird } from '../../../../components/lower-third';
import { Modal } from '../../../../components/modal';
import { SelectAssetModal } from '../../../../components/select-asset-modal';
import styles from './new-slide-modal.module.css';
import { Observable, Subscription } from 'rxjs';
import { Slide } from '../../../../types';
import { api } from '../../../../util/api';
import { delayMs } from '../../../../util/delay';

export type ModalRequest =
  | {
      type: 'edit';
      slide: Slide;
    }
  | {
      type: 'add';
    };

export type NewSlideModalProps = {
  eventId: string;
  request: Observable<ModalRequest>;
};
export const NewSlideModal = (props: NewSlideModalProps) => {
  let assetModalRef: HTMLDialogElement | undefined;
  let mainModalRef: HTMLDialogElement | undefined;
  let formRef: HTMLFormElement | undefined;
  const [name, setName] = createSignal('');
  const [header, setHeader] = createSignal('');
  const [footer, setFooter] = createSignal('');
  const [title, setTitle] = createSignal('');
  const [subtitle, setSubtitle] = createSignal('');
  const [assetId, setAssetId] = createSignal('');
  const [slideId, setSlideId] = createSignal('');
  const clearFields = () => {
    setSlideId('');
    setName('');
    setHeader('');
    setFooter('');
    setTitle('');
    setSubtitle('');
    setAssetId('');
  };
  let subscription: Subscription | undefined;

  onMount(() => {
    subscription = props.request.subscribe((val) => {
      if (val.type === 'add') {
        clearFields();
      } else {
        setName(val.slide.name ?? '');
        setHeader(val.slide.header ?? '');
        setFooter(val.slide.footer ?? '');
        setTitle(val.slide.title ?? '');
        setSubtitle(val.slide.subtitle ?? '');
        setAssetId(val.slide.assetId ?? '');
        setSlideId(val.slide.id);
      }
      mainModalRef?.showModal();
    });
  });
  onCleanup(() => {
    subscription?.unsubscribe();
  });

  const [assetLabel] = createResource<string, string>(
    assetId,
    async (assetId) => {
      if (assetId) {
        return (await api.getAssetMeta(assetId)).label;
      }
      return '';
    }
  );

  const handleOkClick = async (event: MouseEvent) => {
    const validated = CreateSlideSchema.safeParse({
      name: name(),
      header: header(),
      footer: footer(),
      title: title(),
      subtitle: subtitle(),
      eventId: props.eventId,
      assetId: assetId(),
    });
    if (validated.success) {
      if (slideId()) {
        console.log('UPDATE');
        await api.updateSlide(slideId(), { ...validated.data, id: slideId() });
      } else {
        console.log('CREATE');
        await api.createSlide(validated.data);
      }
      clearFields();
      mainModalRef?.close();
      await delayMs(500);
      refetchEvent();
    } else {
      console.warn(validated.error);
      event.preventDefault();
    }
  };

  const handleDeleteClick = async () => {
    await api.deleteSlide(slideId());
    clearFields();
    await refetchEvent();
    mainModalRef?.close();
  };

  const handleCloneClick = async (event: MouseEvent) => {
    const validated = CreateSlideSchema.safeParse({
      name: name(),
      header: header(),
      footer: footer(),
      title: title(),
      subtitle: subtitle(),
      eventId: props.eventId,
      assetId: assetId(),
    });
    if (validated.success) {
      await api.createSlide(validated.data);
      clearFields();
      await refetchEvent();
      mainModalRef?.close();
    } else {
      console.warn(validated.error);
      event.preventDefault();
    }
  };

  return (
    <Modal
      ref={mainModalRef}
      title={slideId() ? `Edit Slide ${name()}` : 'Add Slide'}
      footerButtons={[
        ...(slideId()
          ? [
              <button
                type="button"
                class={styles.footerClone}
                onClick={handleCloneClick}
              >
                Clone
              </button>,
              <button
                type="button"
                class={styles.footerDelete}
                onClick={handleDeleteClick}
              >
                Delete
              </button>,
            ]
          : []),
        <button
          type="button"
          class={styles.footerCancel}
          onClick={() => mainModalRef?.close()}
        >
          Cancel
        </button>,
        <button class={styles.footerOk} onClick={handleOkClick}>
          Submit
        </button>,
      ].filter(Boolean)}
    >
      <div class={styles.mainContainer}>
        <div class={styles.lowerThirdContainer}>
          <LowerThird
            crop
            header={header()}
            footer={footer()}
            title={title()}
            subtitle={subtitle()}
            assetId={assetId()}
            mode="MANUAL"
          />
        </div>
        <form ref={formRef} class={styles.inputContainer}>
          <label class={styles.label}>
            <span class={styles.labelText}>Name</span>
            <input
              name="slidename"
              value={name()}
              onInput={(event) => setName(event.currentTarget.value)}
            />
          </label>
          <label class={styles.label}>
            <span class={styles.labelText}>Header</span>
            <input
              name="header"
              value={header()}
              onInput={(event) => setHeader(event.currentTarget.value)}
            />
          </label>
          <label class={styles.label}>
            <span class={styles.labelText}>Title</span>
            <input
              name="title"
              value={title()}
              onInput={(event) => setTitle(event.currentTarget.value)}
            />
          </label>
          <label class={styles.label}>
            <span class={styles.labelText}>Subtitle</span>
            <input
              name="subtitle"
              value={subtitle()}
              onInput={(event) => setSubtitle(event.currentTarget.value)}
            />
          </label>
          <label class={styles.label}>
            <span class={styles.labelText}>Footer</span>
            <input
              name="footer"
              value={footer()}
              onInput={(event) => setFooter(event.currentTarget.value)}
            />
          </label>
          <div class={styles.label}>
            <span class={styles.labelText}>Media</span>
            <div class={styles.buttonWrapper}>
              <button
                type="button"
                onClick={() => assetModalRef?.showModal()}
                class={styles.selectAssetButton}
              >
                {assetLabel() || 'Select Media'}
              </button>
            </div>
          </div>
        </form>
      </div>
      <SelectAssetModal ref={assetModalRef} setAssetId={setAssetId} />
    </Modal>
  );
};
