import { JSXElement } from 'solid-js';
import type { JSX } from 'solid-js/types/jsx';
import styles from './icon-button.module.css';

export type IconButtonVariant =
  | 'primary'
  | 'loading'
  | 'success'
  | 'error'
  | 'neutral';

export type IconButtonProps = {
  icon?: () => JSXElement;
  altText: string;
  variant: IconButtonVariant;
  onClick?: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> | undefined;
};

export const IconButton = (props: IconButtonProps) => {
  return (
    <button
      type="button"
      class={styles.iconButton}
      title={props.altText}
      onClick={props.onClick}
      classList={{
        [styles.primary]: props.variant === 'primary',
        [styles.success]: props.variant === 'success',
        [styles.error]: props.variant === 'error',
        [styles.neutral]: props.variant === 'neutral',
      }}
    >
      {props.icon}
      <span class="sr-only">{props.altText}</span>
    </button>
  );
};
