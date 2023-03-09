import {
  CreateSlideBody,
  Paginated,
  PresentationMode,
  UpdateSlideBody,
  User,
} from '../api-interface';
import axios, { type AxiosInstance } from 'axios';
import { hydrateDates, Serializable } from './serialization';
import type {
  Asset,
  Event as ContextEvent,
  EventWithSlides,
  Slide,
} from '../types';
import { SlideState } from '../types/slide-state';
import { BehaviorSubject, Observable } from 'rxjs';

const SESSION_STORAGE_KEY = 'contextualize_access_token';

const makeAxios = (token?: string | null) => {
  if (token) {
    return axios.create({
      baseURL: import.meta.env.VITE_API_BASE,
      headers: { Authorization: `Bearer ${token}` },
    });
  }
  return axios.create({ baseURL: import.meta.env.VITE_API_BASE });
};
class Api {
  private readonly axios$: BehaviorSubject<AxiosInstance>;
  private readonly isLoggedIn$: BehaviorSubject<boolean>;

  constructor() {
    const token = sessionStorage.getItem(SESSION_STORAGE_KEY);
    this.axios$ = new BehaviorSubject(makeAxios(token));
    this.isLoggedIn$ = new BehaviorSubject(!!token);
  }

  public async login(username: string, password: string): Promise<void> {
    const response = await this.axios$.value.post<{ access_token: string }>(
      `/auth/login`,
      { username, password }
    );
    const token = response.data.access_token;
    sessionStorage.setItem(SESSION_STORAGE_KEY, token);
    this.axios$.next(makeAxios(token));
    this.isLoggedIn$.next(true);
  }

  public async logout(): Promise<void> {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    console.log('foo');
    this.axios$.next(makeAxios());
    this.isLoggedIn$.next(false);
  }

  public get isLoggedIn(): boolean {
    return this.isLoggedIn$.value;
  }

  public get isLoggedInObservable(): Observable<boolean> {
    return this.isLoggedIn$.asObservable();
  }

  public async getEvents(offset: number): Promise<Paginated<ContextEvent[]>> {
    const { data } = await this.axios$.value.get<
      Paginated<Serializable<ContextEvent>[]>
    >('/events', { params: { offset } });
    return {
      ...data,
      data: data.data.map((value) =>
        hydrateDates(value, 'createdAt', 'updatedAt', 'date')
      ),
    };
  }

  public async getEvent(eventId: string): Promise<EventWithSlides> {
    const { data } = await this.axios$.value.get<Serializable<EventWithSlides>>(
      `/events/${eventId}`
    );
    return hydrateDates(
      {
        ...data,
        Slides: data.Slides.map((slide) =>
          hydrateDates(
            slide as unknown as Serializable<Slide>,
            'createdAt',
            'updatedAt'
          )
        ),
      },
      'date',
      'createdAt',
      'updatedAt'
    );
  }

  public async updateEvent(
    eventId: string,
    updatedEvent: Pick<
      EventWithSlides,
      'name' | 'date' | 'screenHeight' | 'screenWidth'
    >
  ): Promise<void> {
    const serializableEvent = {
      ...updatedEvent,
      date: updatedEvent.date?.toISOString() ?? null,
    };
    await this.axios$.value.patch(`/events/${eventId}`, serializableEvent);
  }

  public async createEvent(
    name: string,
    date: Date | undefined
  ): Promise<void> {
    this.axios$.value.post(`/events`, { name, date });
  }

  public async deleteEvent(eventId: string): Promise<void> {
    this.axios$.value.delete(`/events/${eventId}`);
  }

  public async getAssets(query?: string): Promise<Paginated<Asset[]>> {
    const params = query ? { q: query } : {};
    const { data } = await this.axios$.value.get<
      Paginated<Serializable<Asset>[]>
    >('/assets', { params });
    const hydratedData = {
      ...data,
      data: data.data.map((value) =>
        hydrateDates(value, 'createdAt', 'updatedAt')
      ),
    };
    const thumbResponses = await Promise.all(
      data.data.map((asset) =>
        this.axios$.value.get<Blob>(`/assets/${asset.id}/thumb`)
      )
    );
    const thumbs = thumbResponses.map((response) => response.data);
    return {
      ...hydratedData,
      data: hydratedData.data.map((asset, index) => ({
        ...asset,
        thumb: thumbs[index],
      })),
    };
  }

  public async getAssetImage(assetId: string): Promise<Blob> {
    return (await this.axios$.value.get<Blob>(`/assets/${assetId}`)).data;
  }

  public async getAssetMeta(assetId: string): Promise<Asset> {
    return hydrateDates(
      (
        await this.axios$.value.get<Serializable<Asset>>(
          `/assets/${assetId}/meta`
        )
      ).data,
      'createdAt',
      'updatedAt'
    );
  }

  public async deleteAsset(assetId: string): Promise<void> {
    this.axios$.value.delete(`/assets/${assetId}`);
  }

  public async createAsset(name: string, file: File): Promise<void> {
    this.axios$.value.post('/assets', {
      name,
      file,
    });
  }

  public async updatePresentationMode(
    eventId: string,
    mode: PresentationMode
  ): Promise<void> {
    this.axios$.value.patch(`/presentations/${eventId}/mode`, { mode });
  }

  public async getManualPresentationState(
    eventId: string
  ): Promise<SlideState> {
    return this.axios$.value.get(`/presentations/${eventId}/manual`);
  }

  public async setManualPresentationState(
    eventId: string,
    state: SlideState
  ): Promise<void> {
    this.axios$.value.patch(`/presentations/${eventId}/data`, state);
  }

  public async getPresentationSlideId(eventId: string): Promise<string | null> {
    const result = await this.axios$.value.get<string | null>(
      `/presentations/${eventId}/slide`
    );
    return result.data;
  }

  public async getSlidesForPresentation(
    eventId: string
  ): Promise<(Slide & { asset?: { label: string } })[]> {
    const result = await this.axios$.value.get<
      (Slide & { asset?: { label: string } })[]
    >(`/presentations/${eventId}/slides`);
    return result.data;
  }

  public async switchSlidesForPresentation(
    eventId: string,
    slideId: string
  ): Promise<void> {
    this.axios$.value.patch(`/presentations/${eventId}/slide`, { slideId });
  }

  public async createSlide(slide: CreateSlideBody): Promise<void> {
    this.axios$.value.post(`/slides/`, {
      slide,
    });
  }

  public async updateSlide(
    slideId: string,
    slide: UpdateSlideBody
  ): Promise<void> {
    this.axios$.value.patch(`/slides/${slideId}`, slide);
  }

  public async deleteSlide(slideId: string): Promise<void> {
    this.axios$.value.delete(`/slides/${slideId}`);
  }

  public async getUserProfile(): Promise<User | null> {
    if (this.isLoggedIn$.value) {
      const response = await this.axios$.value.get('/users/profile');
      return response.data;
    }
    return null;
  }

  public async resetPassword(password: string): Promise<void> {
    if (this.isLoggedIn$.value) {
      const user = await this.getUserProfile();
      if (user) {
        console.log(password);
        await this.axios$.value.post(`/users/${user.id}/password`, {
          password,
        });
      }
    }
  }
}

export const api = new Api();
