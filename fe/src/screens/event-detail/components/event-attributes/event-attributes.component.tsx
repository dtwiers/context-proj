import dayjs from 'dayjs';
import { Accessor, createEffect, on, Setter, Show } from 'solid-js';
import { currentEventState } from '../../../../store/events';
import { AttributesForm, schema } from '../../event-detail.component';
import styles from './event-attributes.module.css';

export type EventAttributesProps = {
  isEditing: Accessor<boolean>;
  formStatus: Accessor<string>;
  setFormStatus: Setter<string>;
  formValues: Accessor<AttributesForm>;
  setFormValues: Setter<AttributesForm>;
};

const validate = (formValues: AttributesForm): string =>
  schema.safeParse(formValues).success ? 'ok' : 'invalid';

export const EventAttributes = (props: EventAttributesProps) => {
  createEffect(
    on(props.isEditing, (isEditingValue) => {
      if (isEditingValue) {
        props.setFormValues(() => ({
          name: currentEventState()?.name ?? '',
          screenHeight: currentEventState()?.screenHeight ?? 0,
          screenWidth: currentEventState()?.screenWidth ?? 0,
          date: currentEventState()?.date ?? null,
        }));
        props.setFormStatus(validate(props.formValues()));
      }
    })
  );

  const handleChange = <K extends keyof AttributesForm>(
    attribute: K,
    newValue: AttributesForm[K]
  ): void => {
    if (newValue instanceof Date) {
      props.setFormValues((prior) => ({
        ...prior,
        date: dayjs(newValue)
          .add(newValue.getTimezoneOffset(), 'minutes')
          .toDate(),
      }));
    } else {
      props.setFormValues(
        (prior) =>
          ({
            ...prior,
            [attribute]: newValue,
          } as AttributesForm)
      );
    }
    props.setFormStatus(validate(props.formValues()));
  };

  return (
    <dl class={styles.descriptionList}>
      <div>
        <dt>Name</dt>
        <Show
          when={props.isEditing()}
          fallback={<dd>{currentEventState()?.name}</dd>}
        >
          <input
            name="name"
            type="text"
            value={props.formValues().name}
            onInput={(ev) => handleChange('name', ev.currentTarget.value)}
          />
        </Show>
      </div>
      <div>
        <dt>Height</dt>
        <Show
          when={props.isEditing()}
          fallback={<dd>{currentEventState()?.screenHeight}</dd>}
        >
          <input
            name="screenHeight"
            type="number"
            value={props.formValues().screenHeight}
            onInput={(ev) =>
              handleChange('screenHeight', ev.currentTarget.valueAsNumber)
            }
          />
        </Show>
      </div>
      <div>
        <dt>Width</dt>
        <Show
          when={props.isEditing()}
          fallback={<dd>{currentEventState()?.screenWidth}</dd>}
        >
          <input
            name="screenWidth"
            type="number"
            value={props.formValues().screenWidth}
            onInput={(ev) =>
              handleChange('screenWidth', ev.currentTarget.valueAsNumber)
            }
          />
        </Show>
      </div>
      <div>
        <dt>Date</dt>
        <Show
          when={props.isEditing()}
          fallback={
            <dd>
              <Show
                when={currentEventState()?.date}
                fallback={<span class={styles.nullish}>No Value</span>}
              >
                {new Intl.DateTimeFormat('en-US').format(
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  currentEventState()!.date!
                )}
              </Show>
            </dd>
          }
        >
          <input
            name="date"
            type="date"
            value={
              props.formValues().date?.toISOString().replace(/T.+/, '') ?? ''
            }
            onInput={(ev) => handleChange('date', ev.currentTarget.valueAsDate)}
          />
        </Show>
      </div>
      <div>
        <dt>Updated At</dt>
        <dd>
          <Show
            when={currentEventState()?.updatedAt}
            fallback={<span class={styles.nullish}>No Value</span>}
          >
            {new Intl.DateTimeFormat('en-US').format(
              /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
              currentEventState()!.updatedAt!
            )}
          </Show>
        </dd>
      </div>
      <div>
        <dt>Created At</dt>
        <dd>
          <Show
            when={currentEventState()?.createdAt}
            fallback={<span class={styles.nullish}>No Value</span>}
          >
            {new Intl.DateTimeFormat('en-US').format(
              /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
              currentEventState()!.createdAt!
            )}
          </Show>
        </dd>
      </div>
    </dl>
  );
};
