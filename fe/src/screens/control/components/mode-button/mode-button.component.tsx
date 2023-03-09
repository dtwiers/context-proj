import { PresentationMode } from '../../../../api-interface';
import { JSXElement } from 'solid-js';
import styles from './mode-button.module.css';

export type ModeButtonProps = {
  children?: JSXElement;
  desiredStatus: PresentationMode;
  currentStatus: PresentationMode | undefined;
  onClick: (mode: PresentationMode) => void;
};

export const ModeButton = (props: ModeButtonProps) => {
  return (
    <button
      type="button"
      class={styles.modeButton}
      classList={{
        [styles.activeModeButton]: props.currentStatus === props.desiredStatus,
      }}
      onClick={() => props.onClick(props.desiredStatus)}
    >
      {props.children}
    </button>
  );
};
