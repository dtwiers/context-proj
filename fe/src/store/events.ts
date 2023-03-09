import { Paginated } from '../api-interface';
import { createResource, createSignal } from 'solid-js';
import { Event, EventWithSlides } from '../types';
import { api } from '../util/api';

export const [eventsState, { refetch: refetchEvents }] = createResource<
  Paginated<Event[]>
>(async () => api.getEvents(0));

export const [getCurrentEventId, setCurrentEventId] = createSignal<
  string | undefined
>(undefined);

export const [currentEventState, { refetch: refetchEvent }] = createResource(
  getCurrentEventId,
  (eventId): Promise<EventWithSlides> => api.getEvent(eventId)
);

export const updateEvent = async (
  id: string,
  updatedEvent: Pick<
    EventWithSlides,
    'name' | 'date' | 'screenHeight' | 'screenWidth'
  >
): Promise<void> => {
  await api.updateEvent(id, updatedEvent);
  await Promise.all([refetchEvent()]);
};
