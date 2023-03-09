import { JSXElement } from 'solid-js';
import styles from './event-box.module.css';

type EventBoxProps = {
  mainContents?: JSXElement | JSXElement[] | null;
  auxContents?: JSXElement | JSXElement[] | null;
};

export const EventBox = (props: EventBoxProps) => {
  return (
    <article class={styles.eventContainer}>
      <div class={styles.primaryContainer}>
        <div class={styles.eventLink}>{props.mainContents}</div>
      </div>
      <div class={styles.optionList}>{props.auxContents}</div>
    </article>
  );
};
