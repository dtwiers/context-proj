import { VsClose } from 'solid-icons/vs';
import type { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';
import styles from './modal.module.css';

export type ModalProps = {
  ref: HTMLDialogElement | ((el: HTMLDialogElement) => void) | undefined;
  title: string;
  children?: JSX.Element;
  footerButtons?: JSX.Element | JSX.Element[];
};

export const Modal = (props: ModalProps) => {
  let sharedRef: HTMLDialogElement;
  return (
    <Portal>
      <dialog
        onClick={(ev) => {
          if (ev.currentTarget === sharedRef) {
            sharedRef.close();
          }
        }}
        ref={(r) => {
          typeof props.ref === 'function' ? props.ref(r) : (props.ref = r);
          sharedRef = r;
        }}
        class={styles.dialog}
      >
        <form
          class={styles.form}
          method="dialog"
          onClick={(ev) => ev.stopPropagation()}
        >
          <header class={styles.header}>
            <h1 class={styles.title}>{props.title}</h1>
            <button
              class={styles.closeButton}
              type="button"
              onClick={() => sharedRef?.close()}
            >
              <VsClose viewBox='0 0 16 16' width="2rem" height="2rem" class={styles.closeButtonSvg} />
            </button>
          </header>
          <div class={styles.body}>{props.children}</div>
          <footer class={styles.footer}>{props.footerButtons}</footer>
        </form>
      </dialog>
    </Portal>
  );
};
