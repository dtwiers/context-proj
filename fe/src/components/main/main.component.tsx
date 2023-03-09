import type { JSXElement } from 'solid-js';
import styles from './main.module.css';

export type MainProps = {
  children?: JSXElement | JSXElement[] | null;
};
export const Main = (props: MainProps) => (
  <main class={styles.main}>{props.children}</main>
);
