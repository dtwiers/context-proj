import { A } from '@solidjs/router';
import { createEffect, from, Show } from 'solid-js';
import { Header } from '../../components/header';
import { Main } from '../../components/main';
import { api } from '../../util/api';
import styles from './index.module.css';

export const Index = () => {
  const isLoggedIn = from(api.isLoggedInObservable);
  return (
    <Show
      when={isLoggedIn()}
      fallback={
        <Main>
          <Header title="Contextualizer" />
          <h2>
            You are not logged in. Please{' '}
            <button
              class={styles.link}
              onClick={() => {
                const username = prompt('username?') ?? '';
                const password = prompt('password?') ?? '';
                api.login(username, password);
              }}
            >
              log in
            </button>{' '}
            to use the service.
          </h2>
        </Main>
      }
    >
      <Main>
        <Header title="Contextualizer" />
        <A href="/events" class={styles.link}>
          Events
        </A>
        <A href="/assets" class={styles.link}>
          Media
        </A>
        <A href="/users" class={styles.link}>
          Users
        </A>
      </Main>
    </Show>
  );
};
