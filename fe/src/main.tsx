import { render } from 'solid-js/web';
import App from './app/app';
import './style.css';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const app = document.querySelector<HTMLDivElement>('#app')!;

render(() => <App />, app);