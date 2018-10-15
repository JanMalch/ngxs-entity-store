import {ExtendsEntityStore, generateActionObject} from '../internal';

export interface EntitySetActiveAction {
  payload: string;
}

export interface EntityUpdateActiveAction<T> {
  payload: Partial<T>;
}

export function SetActive(store: ExtendsEntityStore<any>, id: string): EntitySetActiveAction {
  return generateActionObject("setActive", store, id);
}

export function ClearActive(store: ExtendsEntityStore<any>): {} {
  return generateActionObject("clearActive", store);
}

export function UpdateActive<T>(store: ExtendsEntityStore<T>, payload: Partial<T>): EntityUpdateActiveAction<T> {
  return generateActionObject("updateActive", store, payload);
}

