import {ExtendsEntityStore, generateActionObject} from '../internal';

export interface EntityAddAction<T> {
  payload: T;
}

export interface EntityAddAllAction<T> {
  payload: T[];
}

export function AddOrReplace<T>(store: ExtendsEntityStore<T>, payload: T): EntityAddAction<T> {
  return generateActionObject('add', store, payload);
}

export function AddOrReplaceAll<T>(store: ExtendsEntityStore<T>, payload: T[]): EntityAddAllAction<T> {
  return generateActionObject('addAll', store, payload);
}
