import type { JSXElement } from 'solid-js';
import styles from './header.module.css';

export type HeaderProps = {
  title: string;
  children?: JSXElement | null;
};

export const Header = (props: HeaderProps) => (
  <header class={styles.header}>
    <h1>{props.title}</h1>
    {props.children}
  </header>
);
