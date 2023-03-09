import styles from './hash-tape.module.css';

export type HashTapeProps = {
  widthPixels: number;
};
export const HashTape = (props: HashTapeProps) => (
  <svg
    class={styles.svg}
    height="40"
    viewBox={`0 0 ${props.widthPixels} 40`}
    width={props.widthPixels}
  >
    <defs>
      <pattern
        id="hash-pattern"
        x="0"
        y="0"
        width="0.08"
        height="1"
        patternUnits="objectBoundingBox"
      >
        <g transform="skewX(-20)">
          <rect fill="hsl(0, 0%, 20%)" x="20" y="0" width="20" height="40" />
        </g>
      </pattern>
    </defs>
    <rect
      fill="url(#hash-pattern)"
      stroke="none"
      width={props.widthPixels}
      height="40"
      x="0"
      y="0"
    />
  </svg>
);
