import { createResource, createSignal, For, Show } from 'solid-js';
import { BASE_API } from '../../util/api-base';
import { api } from '../../util/api';
import { Modal } from '../modal';
import styles from './select-asset-modal.module.css';

export type SelectAssetModalProps = {
  ref: HTMLDialogElement | undefined;
  setAssetId?: (id: string) => void;
};

export const SelectAssetModal = (props: SelectAssetModalProps) => {
  const [searchTerm, setSearchTerm] = createSignal('');
  const [assets] = createResource(searchTerm, (term) => api.getAssets(term));
  const [selectedAssetId, setSelectedAssetId] = createSignal('');

  const handleOkClick = () => {
    props.setAssetId?.(selectedAssetId());
  };

  return (
    <Modal
      ref={props.ref}
      title="Select Media"
      footerButtons={[
        <button
          class={styles.footerCancel}
          onClick={() => {
            props.ref?.close();
          }}
        >
          Cancel
        </button>,
        <button class={styles.footerOk} onClick={handleOkClick}>
          Submit
        </button>,
      ]}
    >
      <form class={styles.inputContainer}>
        <input
          class={styles.searchInput}
          type="search"
          name="search"
          placeholder="Search"
          onInput={(event) => setSearchTerm(event.currentTarget.value)}
        />
        <div class={styles.radioContainer}>
          <button
            class={styles.toggleButton}
            classList={{
              [styles.selected]: selectedAssetId() === '',
              [styles.emptyContainer]: true,
            }}
            type="button"
            name="asset"
            value=""
            onClick={(event) => setSelectedAssetId(event.currentTarget.value)}
          >
            No media
          </button>
          <Show when={assets()?.data}>
            <For each={assets()?.data}>
              {(item) => (
                <button
                  class={styles.toggleButton}
                  classList={{
                    [styles.selected]: selectedAssetId() === item.id,
                  }}
                  type="button"
                  name="asset"
                  value={item.id}
                  onClick={(event) =>
                    setSelectedAssetId(event.currentTarget.value)
                  }
                >
                  <img
                    src={`${BASE_API}/assets/${item.id}/thumb`}
                    class={styles.img}
                  />
                  <div class={styles.metaContainer}>
                    <h3>{item.label}</h3>
                    <p>{item.createdAt.toLocaleDateString()}</p>
                  </div>
                </button>
              )}
            </For>
          </Show>
        </div>
      </form>
    </Modal>
  );
};
