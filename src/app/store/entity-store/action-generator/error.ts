import {ExtendsEntityStore, generateActionObject} from '../internal';

export interface EntitySetErrorAction {
  payload: Error;
}

export function SetError(store: ExtendsEntityStore<any>, error: Error | undefined): EntitySetErrorAction {
  return generateActionObject("setError", store, error);
}
