import { api } from '../../../../util/api';
import { VsTrash } from 'solid-icons/vs';
import { createEffect, createSignal, onCleanup } from 'solid-js';
import { Asset, refetchAssets } from '../../../../store';
import styles from './asset-box.module.css';

const apiDeleteAsset = (assetId: string): Promise<void> =>
  api.deleteAsset(assetId);

export type AssetBoxProps = {
  asset: Asset;
};

export const AssetBox = (props: AssetBoxProps) => {
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
  const deleteAsset = async () => {
    if (deleting()) {
      const result = await apiDeleteAsset(props.asset.id);
      refetchAssets();
    } else {
      startDeleting();
    }
  };
  return (
    <div class={styles.eventContainer}>
      <div class={styles.primaryContainer}>
        <a class={styles.eventLink} href={`/assets/${props.asset.id}`}>
          <img
            src={URL.createObjectURL(props.asset.thumb)}
            class={styles.thumb}
          />
          <div class={styles.textContainer}>
            <div class={styles.headingContainer}>
              <h2 class={styles.boxtitle}>{props.asset.label}</h2>
            </div>
            <div class={styles.attributesContainer}>
              <span>{props.asset.filename}</span>
            </div>
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
          onClick={deleteAsset}
        >
          <VsTrash />
          <span class="sr-only">Delete</span>
        </button>
      </div>
    </div>
  );
};
