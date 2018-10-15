import {ExtendsEntityStore, generateActionObject} from '../internal';

export interface EntityRemoveAction {
  payload: string;
}

export interface EntityRemoveAllAction {
  payload: string[];
}

export function Remove(store: ExtendsEntityStore<any>, payload: string): EntityRemoveAction {
  return generateActionObject('remove', store, payload);
}

export function RemoveAll(store: ExtendsEntityStore<any>, payload: string[]): EntityRemoveAllAction {
  return generateActionObject('removeAll', store, payload);
}

export function Clear(store: ExtendsEntityStore<any>): {} {
  return generateActionObject('clear', store);
}
