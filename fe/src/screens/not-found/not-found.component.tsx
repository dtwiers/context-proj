import { HashTape } from './components/hash-tape';
import styles from './not-found.module.css';
export const NotFound = () => {
  return (
    <div class={styles.background}>
      <main class={styles.main}>
        <h1>404 | Not Found</h1>
        <div class={styles.ignoreWidth}>
          <HashTape widthPixels={500} />
        </div>
        <h2>
          You found a hole in the matrix! Go back and forget you were ever here!
        </h2>
      </main>
    </div>
  );
};
