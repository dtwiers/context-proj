import {
  PresentationMode,
  PresentationStatus,
} from '../../api-interface';
import { useParams } from '@solidjs/router';
import {
  createEffect,
  createSignal,
  For,
  JSXElement,
  Match,
  Show,
  Switch,
} from 'solid-js';
import { EmptyIcon } from '../../components/icons/empty-icon';
import { InvisibleIcon } from '../../components/icons/invisible-icon';
import { LowerThird } from '../../components/lower-third';
import { ManualIcon } from '../../components/icons/manual-icon';
import { SlideIcon } from '../../components/icons/slide-icon';
import { ManualEditor } from './components/manual-editor';
import { ModeButton } from './components/mode-button';
import styles from './control.module.css';
import { SlideEditor } from './components/slide-editor';
import { api } from '../../util/api';

const buttonConfigs: { mode: PresentationMode; icon: JSXElement }[] = [
  { mode: 'INVISIBLE', icon: <InvisibleIcon /> },
  { mode: 'EMPTY', icon: <EmptyIcon /> },
  { mode: 'MANUAL', icon: <ManualIcon /> },
  { mode: 'SLIDE', icon: <SlideIcon /> },
];

export const Control = () => {
  const [controlMode, setControlMode] = createSignal('manual');
  const [hasManualUpdates, setHasManualUpdates] = createSignal(false);
  const [hasSlideUpdates, setHasSlideUpdates] = createSignal(false);
  const [incomingStatus, setIncomingStatus] =
    createSignal<PresentationStatus>();
  const params = useParams();
  let eventSource;
  createEffect(() => {
    if (params.id) {
      eventSource = new EventSource(
        `/api/presentations/${params.id}/subscribe`
      );
      eventSource?.addEventListener(
        'message',
        (event: MessageEvent<string>) => {
          setIncomingStatus(JSON.parse(event.data));
        }
      );
      eventSource?.addEventListener('error', (ev: Event) => {
        console.error(ev);
      });
    }
  });

  const handleModeSwitch = (mode: PresentationMode) => {
    api.updatePresentationMode(params.id, mode);
  };

  return (
    <main class={styles.main}>
      <LowerThird
        crop
        title={incomingStatus()?.title}
        subtitle={incomingStatus()?.subtitle}
        header={incomingStatus()?.header}
        footer={incomingStatus()?.footer}
        assetId={incomingStatus()?.assetUrl || null}
        mode={incomingStatus()?.mode ?? 'INVISIBLE'}
      />
      <div class={styles.modeButtonContainer}>
        <For each={buttonConfigs}>
          {(item) => (
            <ModeButton
              desiredStatus={item.mode}
              currentStatus={incomingStatus()?.mode}
              onClick={handleModeSwitch}
            >
              {item.icon}
            </ModeButton>
          )}
        </For>
      </div>
      <div class={styles.tabContainer}>
        <button
          type="button"
          classList={{ [styles.active]: controlMode() === 'manual' }}
          onClick={() => setControlMode('manual')}
        >
          <ManualIcon />
          <div>
            Manual
            <Show when={hasManualUpdates()}>
              <span class={styles.changedItem}>*</span>
            </Show>
          </div>
        </button>
        <button
          type="button"
          classList={{ [styles.active]: controlMode() === 'slide' }}
          onClick={() => setControlMode('slide')}
        >
          <SlideIcon />
          <div>Slide</div>
        </button>
      </div>
      <Switch>
        <Match when={controlMode() === 'manual'}>
          <ManualEditor setHasUpdates={setHasManualUpdates} />
        </Match>
        <Match when={controlMode() === 'slide'}>
          <SlideEditor setHasUpdates={setHasSlideUpdates} eventId={params.id} />
        </Match>
      </Switch>
    </main>
  );
};
