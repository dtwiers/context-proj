import { api } from '../../../../util/api';
import { createSignal, Show } from 'solid-js';
import { Modal } from '../../../../components/modal';
import { refetchAssets } from '../../../../store';
import styles from './new-asset-modal.module.css';

const apiCreateAsset = async (name: string, file: File): Promise<void> => {
  api.createAsset(name, file);
};

export type NewAssetModalProps = {
  ref:
    | HTMLDialogElement
    | ((e: HTMLDialogElement | undefined) => void)
    | undefined;
};

export const NewAssetModal = (props: NewAssetModalProps) => {
  let dialogRef: HTMLDialogElement | undefined;
  let nameRef: HTMLInputElement | undefined;
  let fileRef: HTMLInputElement | undefined;
  let formRef: HTMLFormElement | undefined;
  const [selectedFile, setSelectedFile] = createSignal<File | null>();

  const handleOkClick = async () => {
    const file = fileRef?.files?.item(0);
    if (nameRef?.value && file && fileRef) {
      await apiCreateAsset(nameRef.value, file);
      await refetchAssets();
      dialogRef?.close();
      formRef?.reset();
    }
  };

  return (
    <Modal
      ref={(r) => {
        typeof props.ref === 'function' ? props.ref(r) : (props.ref = r);
        dialogRef = r;
      }}
      title="Create New Media"
      footerButtons={[
        <button
          type="button"
          class={styles.footerCancel}
          onClick={() => dialogRef?.close()}
        >
          Cancel
        </button>,
        <button class={styles.footerOk} onClick={handleOkClick}>
          Submit
        </button>,
      ]}
    >
      <div class={styles.inputContainer}>
        <form ref={formRef}>
          <label class={styles.label}>
            <span class={styles.labelText}>Name</span>
            <input ref={nameRef} type="text" />
          </label>
          <label class={styles.label}>
            <span class={styles.labelText}>File</span>
            <div class={styles.fileInput}>
              <input
                id="file"
                ref={fileRef}
                type="file"
                class={styles.hiddenInput}
                onChange={(event) =>
                  setSelectedFile(event.currentTarget.files?.item(0) ?? null)
                }
              />
              <label for="file">
                <Show when={selectedFile()} fallback="Select file">
                  <span class={styles.fileText}>{selectedFile()?.name}</span>
                </Show>
              </label>
            </div>
          </label>
        </form>
      </div>
    </Modal>
  );
};
