import { Header } from '../../components/header';
import { IconButton } from '../../components/icon-button';
import { AddIcon } from '../../components/icons/add-icon';
import { ItemList } from '../../components/item-list';
import { Main } from '../../components/main';
import { assetsState, refetchAssets } from '../../store';
import styles from './assets.module.css';
import { AssetBox } from './components/asset-box';
import { NewAssetModal } from './components/new-asset-modal';

export const Assets = () => {
  let dialogRef: HTMLDialogElement | undefined;
  refetchAssets();
  return (
    <Main>
      <Header title="Media">
        <IconButton
          variant="primary"
          altText="Add Event"
          icon={AddIcon}
          onClick={() => {
            dialogRef?.showModal();
          }}
        />
      </Header>
      <ItemList
        state={assetsState}
        itemComponent={(asset) => <AssetBox asset={asset} />}
      />
      <NewAssetModal ref={dialogRef} />
    </Main>
  );
};
