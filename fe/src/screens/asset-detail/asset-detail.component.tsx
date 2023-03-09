import { useParams } from '@solidjs/router';
import { createResource, Show } from 'solid-js';
import { BASE_API } from '../../util/api-base';
import { Main } from '../../components/main';
import { api } from '../../util/api';
import styles from './asset-detail.module.css';

export const AssetDetail = () => {
  const id = useParams().id;
  const [meta, { refetch }] = createResource(() => api.getAssetMeta(id));
  return (
    <Main>
      <article class={styles.mainContainer}>
        <img class={styles.img} src={`${BASE_API}/assets/${id}`} />
        <Show when={meta()}>
          <dl class={styles.dl}>
            <div>
              <dt>Name</dt>
              <dd>{meta()?.label}</dd>
            </div>
            <div>
              <dt>Type</dt>
              <dd>{meta()?.mimetype}</dd>
            </div>
            <div>
              <dt>Updated</dt>
              <dd>{meta()?.updatedAt?.toLocaleDateString()}</dd>
            </div>
            <div>
              <dt>Created</dt>
              <dd>{meta()?.createdAt.toLocaleDateString()}</dd>
            </div>
          </dl>
        </Show>
      </article>
    </Main>
  );
};
