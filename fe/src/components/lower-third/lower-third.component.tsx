import {
  createEffect,
  createMemo,
  createSignal,
  from,
  Match,
  onMount,
  Show,
  Switch,
} from 'solid-js';
import { generateUpdate } from './lower-third.logic';
import { ObservableProps } from './lower-third.types';
import styles from './lower-third.module.css';
import { PresentationMode } from '../../api-interface';
import { api } from '../../util/api';

export type LowerThirdProps = {
  header?: string | null | undefined;
  footer?: string | null | undefined;
  title?: string | null | undefined;
  subtitle?: string | null | undefined;
  assetId?: string | null | undefined;
  mode: PresentationMode;
  resolutionX?: number;
  resolutionY?: number;
  crop?: boolean;
};

const preload = async () => {
  const assets = await api.getAssets();
  assets.data.map((asset) => {
    api.getAssetImage(asset.id);
  });
};

export const LowerThird = (props: LowerThirdProps) => {
  onMount(() => preload());

  // don't move this.
  const allProps = createMemo<ObservableProps>(() => ({
    header: props.header,
    footer: props.footer,
    title: props.title,
    subtitle: props.subtitle,
    assetId: props.assetId,
    mode: props.mode,
  }));

  const { opacity$, assetId$, footer$, header$, subtitle$, title$ } =
    generateUpdate(allProps);

  const opacity = from(opacity$);
  const header = from(header$);
  const footer = from(footer$);
  const title = from(title$);
  const subtitle = from(subtitle$);
  const assetId = from(assetId$);

  const computeCrop = (originalYValue: number): number =>
    props.crop ? originalYValue - 650 : originalYValue;

  return (
    <svg
      viewBox={`0 0 1600 ${computeCrop(900)}`}
      xmlns="http://www.w3.org/2000/svg"
      width={props.resolutionX}
      height={props.resolutionY}
    >
      <defs>
        <style>
          {`@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;600;700&display=swap');`}
        </style>
        <clipPath id="swipe-right" clipPathUnits="objectBoundingBox">
          <polygon points="0,150 50,0 1290,0 1240,150" />
        </clipPath>

        <linearGradient id="gray-fade">
          <stop offset="0%" stop-opacity="0%" stop-color="#444" />
          <stop offset="100%" stop-opacity="40%" stop-color="#444" />
        </linearGradient>
        <linearGradient id="yellow-fade">
          <stop offset="0%" stop-opacity="100%" stop-color="#ffe699" />
          <stop offset="100%" stop-opacity="100%" stop-color="#fb0" />
        </linearGradient>
        <linearGradient id="sm-gray-fade">
          <stop offset="10%" stop-color="#000" />
          <stop offset="100%" stop-color="#111" />
        </linearGradient>
        <linearGradient id="text-gradient">
          <stop offset="0%" stop-color="#fb0" />
          <stop offset="100%" stop-color="#fd8" />
        </linearGradient>

        <pattern
          id="Transparency"
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <rect x="0" y="0" width="10" height="10" fill="#555" />
          <rect x="10" y="0" width="10" height="10" fill="#444" />
          <rect x="0" y="10" width="10" height="10" fill="#444" />
          <rect x="10" y="10" width="10" height="10" fill="#555" />
        </pattern>

        <pattern id="dot" width="12" height="12" patternUnits="userSpaceOnUse">
          <rect x="1" y="1" width="10" height="10" fill="rgba(0,0,0,0.3)" />
        </pattern>

        <pattern id="skew" width="12" height="12" patternUnits="userSpaceOnUse">
          <path d="M0,1 H10 L0,11 Z M12,1 V11 H2 Z" fill="rgba(0, 0, 0, 0.4)" />
        </pattern>

        <filter id="drop-shadow">
          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
          {/* @ts-ignore */}
          <feDropShadow stdDeviation="8" flood-opacity="0.5" />
        </filter>

        <clipPath id="img-clip">
          <path d={`M130,${computeCrop(850)} l50,-150 h240 l-50,150 Z`} />
        </clipPath>

        {/* <clipPath id="text-clip">
          <path d={`M80,${computeCrop(850)} l50,-150 H1500 l-50,150 Z`} />
        </clipPath> */}
      </defs>

      <g
        class={styles.wrapper}
        classList={{
          [styles.up]: opacity() === 'up',
          [styles.down]: opacity() === 'down',
          [styles.transition]: true,
        }}
      >
        <g filter="url(#drop-shadow)">
          <g clip-path="url(#swipe)">
            <path
              d={`M80,${computeCrop(850)} l50,-150 H1520 l-50,150 Z`}
              fill="#222"
            />
            <path
              d={`M80,${computeCrop(850)} l50,-150 H1520 l-50,150 Z`}
              fill="url(#skew)"
            />
            <path
              d={`M80,${computeCrop(850)} l50,-150 H1520 l-50,150 Z`}
              fill="url(#gray-fade)"
            />
          </g>

          <g filter="url(#drop-shadow)">
            <path
              d={`M150,${computeCrop(710)} l13.3,-40 h1340 l-13.3,40 Z`}
              fill="#ffbb00"
            />
            <path
              d={`M150,${computeCrop(710)} l13.3,-40 H1340 l-13.3,40 Z`}
              fill="url(#yellow-fade)"
            />

            <path
              d={`M95,${computeCrop(880)} l13.3,-40 h1340 l-13.3,40 Z`}
              fill="url(#sm-gray-fade)"
            />
            <path
              d={`M130,${computeCrop(850)} l50,-150 h240 l-50,150 Z`}
              fill="#333"
              style="stroke-linejoin: round;"
              stroke="#333"
              stroke-width="20px"
            />
          </g>
        </g>

        <Switch>
          <Match when={title()?.value && subtitle()?.value}>
            <text
              id="title"
              font-family="Cairo"
              x="440"
              y={computeCrop(768)}
              font-size="60"
              font-weight="700"
              fill="white"
              classList={{
                [styles.up]: title()?.fading === 'in',
                [styles.down]: title()?.fading === 'out',
                [styles.textTransition]: title()?.transition,
              }}
            >
              {title()?.value}
            </text>
          </Match>
          <Match when={title()?.value && !subtitle()?.value}>
            <text
              id="title"
              font-family="Cairo"
              x="420"
              y={computeCrop(810)}
              font-size="96"
              font-weight="700"
              fill="white"
              clip-path="url(#text-clip)"
              classList={{
                [styles.up]: title()?.fading === 'in',
                [styles.down]: title()?.fading === 'out',
                [styles.textTransition]: title()?.transition,
              }}
            >
              {title()?.value}
            </text>
          </Match>
        </Switch>
        <text
          id="subtitle"
          font-family="Cairo"
          x="415"
          y={computeCrop(825)}
          font-size="48"
          font-weight="300"
          fill="white"
          classList={{
            [styles.up]: subtitle()?.fading === 'in',
            [styles.down]: subtitle()?.fading === 'out',
            [styles.textTransition]: subtitle()?.transition,
          }}
        >
          {subtitle()?.value}
        </text>
        <text
          id="header"
          font-family="Cairo"
          x="450"
          y={computeCrop(700)}
          font-size="30"
          font-weight="600"
          fill="black"
          classList={{
            [styles.up]: header()?.fading === 'in',
            [styles.down]: header()?.fading === 'out',
            [styles.textTransition]: header()?.transition,
          }}
        >
          {header()?.value}
        </text>
        <text
          id="footer"
          font-family="Cairo"
          x="400"
          y={computeCrop(870)}
          font-size="30"
          font-weight="600"
          fill="url(#text-gradient)"
          classList={{
            [styles.up]: footer()?.fading === 'in',
            [styles.down]: footer()?.fading === 'out',
            [styles.textTransition]: footer()?.transition,
          }}
        >
          {footer()?.value}
        </text>

        <Show when={assetId()?.value}>
          <image
            x="130"
            y={computeCrop(680)}
            width="290"
            height="190"
            href={`/api/assets/${assetId()?.value}`}
            preserveAspectRatio="xMidYMid meet"
            transform=""
            clip-path="url(#img-clip)"
            classList={{
              [styles.up]: assetId()?.fading === 'in',
              [styles.down]: assetId()?.fading === 'out',
              [styles.textTransition]: assetId()?.transition,
            }}
          />
        </Show>
      </g>
    </svg>
  );
};
