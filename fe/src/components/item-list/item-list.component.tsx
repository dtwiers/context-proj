import { Paginated } from '../../api-interface';
import { Component, For, Show, type Resource } from 'solid-js';
import styles from './item-list.module.css';

export type ItemListProps<ItemType> = {
  state: Resource<Paginated<ItemType[]>>;
  itemComponent: Component<ItemType>;
};
export const ItemList = <ItemType,>(props: ItemListProps<ItemType>) => (
  <section class={styles.listContainer}>
    <Show when={!props.state.loading && props.state()}>
      <For each={props.state()?.data}>{props.itemComponent}</For>
    </Show>
  </section>
);
