import {ExtendsEntityStore, generateActionObject} from '../internal';


export interface EntityUpdateAction<T> {
  payload: Partial<T>;
}

export interface EntityUpdateAllAction<T> {
  payload: Array<Partial<T>>;
}

export function Update<T>(store: ExtendsEntityStore<T>, entity: Partial<T>): EntityUpdateAction<T> {
  return generateActionObject("update", store, entity);
}

export function UpdateAll<T>(store: ExtendsEntityStore<T>, entities: Array<Partial<T>>): EntityUpdateAllAction<T> {
  return generateActionObject("updateAll", store, entities);
}
