import { onMount } from 'solid-js';
import { Header } from '../../components/header';
import { AddIcon } from '../../components/icons/add-icon';
import { eventsState, refetchEvents } from '../../store/events';
import { ItemList } from '../../components/item-list';
import { NewEventModal } from './components/new-event-modal';
import styles from './events.module.css';
import { EventBox } from './components/event-box';
import { IconButton } from '../../components/icon-button';

export const Events = () => {
  let dialogRef: HTMLDialogElement | undefined;
  onMount(() => {
    if (!eventsState.loading) {
      refetchEvents();
    }
  });
  return (
    <main class={styles.main}>
      <Header title="Events">
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
        state={eventsState}
        itemComponent={(item) => <EventBox event={item} />}
      />
      <NewEventModal ref={dialogRef} />
    </main>
  );
};
