export const SlideIcon = () => (
  <svg
    viewBox="3 3 21 21"
    height="1em"
    width="1em"
    stroke="currentColor"
    fill="none"
  >
    <rect x={7} y={9.5} width={16} height={9} stroke-width="1" rx="1" ry="1" />
    <rect
      x={5.5}
      y={8}
      width={16}
      height={9}
      stroke-width="1"
      rx="1"
      ry="1"
      stroke-dasharray="29,21"
      stroke-dashoffset={12.5}
    />
    <rect
      x={4}
      y={6.5}
      width={16}
      height={9}
      stroke-width="1"
      rx="1"
      ry="1"
      stroke-dasharray="29,21"
      stroke-dashoffset={12.5}
    />
    <g stroke-width="1" stroke-opacity={0.5}>
      <path d="M11,15.5 h11" />
      <path d="M11,17 h11" />
      <path d="M8.5,15.5 h1.5 v1.5 h-1.5 v-1.5 Z" />
    </g>
  </svg>
);
