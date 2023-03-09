import { PresentationMode } from '../../api-interface';
import {
  delay,
  delayWhen,
  distinctUntilChanged,
  filter,
  from,
  map,
  Observable,
  ObservableInput,
  pairwise,
  startWith,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';
import { observable, type Accessor } from 'solid-js';
import type { ObservableProps, TextStatus, Update } from './lower-third.types';

const initialObservableProps: ObservableProps = {
  header: null,
  footer: null,
  title: null,
  subtitle: null,
  assetId: null,
  mode: 'INVISIBLE',
};

const DURATION_MS = 400;

const fadeInOutText = (
  text$: Observable<string>,
  prevMode$: Observable<PresentationMode>,
  nextMode$: Observable<PresentationMode>
) =>
  text$.pipe(
    pairwise(),
    withLatestFrom(nextMode$),
    withLatestFrom(prevMode$),
    map(([[[prev, next], nextMode], prevMode]) => ({
      prev,
      next,
      nextMode,
      prevMode,
    })),
    switchMap(
      ({ prev, next, nextMode, prevMode }): ObservableInput<TextStatus> => {
        if (prevMode === 'INVISIBLE') {
          // TODO: Add extra note for which branch happened
          return [
            { value: prev, fading: 'out', transition: false },
            { value: next, fading: 'in', transition: false },
            { value: next, fading: 'in', transition: true },
          ];
        }
        if (nextMode === 'INVISIBLE') {
          return from([
            { value: prev, fading: 'out' as const, transition: false },
            { value: next, fading: 'in' as const, transition: false },
            { value: next, fading: 'in' as const, transition: true },
          ]).pipe(delay(DURATION_MS));
        }
        // this looks backwards from what it is...because reasons.
        return from([
          { value: next, fading: 'in' as const, transition: true },
        ]).pipe(
          delay(DURATION_MS / 2),
          startWith({ value: prev, fading: 'out' as const, transition: true })
        );
      }
    )
  );

export const generateUpdate = (observableProps: Accessor<ObservableProps>) => {
  const fromProps$ = from(observable(observableProps)).pipe(
    distinctUntilChanged<ObservableProps>(),
    startWith(initialObservableProps),
    pairwise(),
    map<[ObservableProps, ObservableProps], Update>(([prev, next]) => ({
      prev,
      next,
    }))
  );

  const opacity$ = fromProps$.pipe(
    filter(
      ({ prev, next }) =>
        next.mode !== prev.mode &&
        (next.mode === 'INVISIBLE' || prev.mode === 'INVISIBLE')
    ),
    map(({ prev }) =>
      prev.mode === 'INVISIBLE' ? ('up' as const) : ('down' as const)
    ),
    distinctUntilChanged()
  );

  const prevMode$ = fromProps$.pipe(
    map(({ prev }) => prev.mode),
    distinctUntilChanged()
  );
  const nextMode$ = fromProps$.pipe(
    map(({ next }) => next.mode),
    distinctUntilChanged()
  );
  const header$ = fadeInOutText(
    fromProps$.pipe(
      map(({ next }) => next.header ?? ''),
      distinctUntilChanged()
    ),
    prevMode$,
    nextMode$
  );
  const footer$ = fadeInOutText(
    fromProps$.pipe(
      map(({ next }) => next.footer ?? ''),
      distinctUntilChanged()
    ),
    prevMode$,
    nextMode$
  );
  const title$ = fadeInOutText(
    fromProps$.pipe(
      map(({ next }) => next.title ?? ''),
      distinctUntilChanged()
    ),
    prevMode$,
    nextMode$
  );
  const subtitle$ = fadeInOutText(
    fromProps$.pipe(
      map(({ next }) => next.subtitle ?? ''),
      distinctUntilChanged()
    ),
    prevMode$,
    nextMode$
  );
  const assetId$ = fadeInOutText(
    fromProps$.pipe(
      map(({ next }) => next.assetId ?? ''),
      distinctUntilChanged()
    ),
    prevMode$,
    nextMode$
  );

  return {
    fromProps$,
    opacity$,
    header$,
    footer$,
    title$,
    subtitle$,
    assetId$,
  };
};
