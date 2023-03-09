import styles from './nav-bar.module.css';
import {
  Component,
  createEffect,
  createResource,
  createSignal,
  from,
  Show,
} from 'solid-js';
import { Link, useLocation } from '@solidjs/router';
import { CgChevronDown, CgProfile } from 'solid-icons/cg';
import { RiUserUser6Line, RiUserUser6Fill } from 'solid-icons/ri';
import { api } from '../../util/api';

export const NavBar: Component = () => {
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = createSignal(false);
  const isLoggedIn = from(api.isLoggedInObservable);
  const [userProfile] = createResource(isLoggedIn, () => api.getUserProfile());
  return (
    <Show when={!location.pathname.includes('/present')} fallback={null}>
      <nav class={styles.nav}>
        <Link href="/" class={styles.homeBtn}>
          Contextualizer
        </Link>
        <div class={styles.extraSpacer} />
        <button
          type="button"
          class={styles.profileBtn}
          title="Profile"
          onClick={() => setIsProfileOpen((val) => !val)}
        >
          <Show when={isLoggedIn()} fallback={<RiUserUser6Line />}>
            <RiUserUser6Fill />
          </Show>
          <CgChevronDown />
          <span class="sr-only">Profile</span>
        </button>
        <div
          classList={{
            [styles.open]: isProfileOpen(),
            [styles.profileMenu]: true,
          }}
        >
          <Show when={userProfile.state === 'ready'}>
            <Show
              when={isLoggedIn()}
              fallback={
                <button
                  class={styles.profileBtn}
                  type="button"
                  onClick={() => {
                    const username = prompt('username?') ?? '';
                    const password = prompt('password?') ?? '';
                    api.login(username, password);
                  }}
                >
                  Log In
                </button>
              }
            >
              <button
                type="button"
                class={styles.profileBtn}
                onClick={() => {
                  const password = prompt('New Password?');
                  if (password) {
                    api.resetPassword(password);
                  }
                }}
              >
                {userProfile()?.name}: Reset Password
              </button>
            </Show>
            <button
              type="button"
              class={styles.profileBtn}
              onClick={() => {
                api.logout();
                setIsProfileOpen(false);
              }}
            >
              Log Out
            </button>
          </Show>
        </div>
      </nav>
    </Show>
  );
};
