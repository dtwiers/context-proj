import { api } from '../../../../util/api';
import { Modal } from '../../../../components/modal';
import { refetchEvents } from '../../../../store/events';
import styles from './new-event-modal.module.css';

const apiCreateEvent = (name: string, date: Date | null): Promise<void> => {
  const payload = {
    name,
    date: date
      ? new Date(
          date.setUTCHours(Math.floor(new Date().getTimezoneOffset() / 60) + 1)
        )
      : undefined,
  };
  return api.createEvent(payload.name, payload.date);
};

export type NewEventModalProps = {
  ref:
    | HTMLDialogElement
    | ((e: HTMLDialogElement | undefined) => void)
    | undefined;
};

export const NewEventModal = (props: NewEventModalProps) => {
  let dialogRef: HTMLDialogElement | undefined;
  let nameRef: HTMLInputElement | undefined;
  let dateRef: HTMLInputElement | undefined;

  const handleOkClick = async () => {
    if (nameRef?.value && dateRef) {
      await apiCreateEvent(nameRef.value, dateRef.valueAsDate);
      await refetchEvents();
      dialogRef?.close();
      nameRef.value = '';
      dateRef.value = '';
    }
  };

  return (
    <Modal
      ref={(r) => {
        typeof props.ref === 'function' ? props.ref(r) : (props.ref = r);
        dialogRef = r;
      }}
      title="Create New Event"
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
        <label class={styles.label}>
          <span class={styles.labelText}>Name</span>
          <input ref={nameRef} type="text" />
        </label>
        <label class={styles.label}>
          <span class={styles.labelText}>Date</span>
          <input ref={dateRef} type="date" />
        </label>
      </div>
    </Modal>
  );
};
