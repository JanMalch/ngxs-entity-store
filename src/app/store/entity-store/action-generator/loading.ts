import {ExtendsEntityStore, generateActionObject} from '../internal';


export interface EntitySetLoadingAction {
  payload: boolean;
}

export function SetLoading(store: ExtendsEntityStore<any>, loading: boolean): EntitySetLoadingAction {
  return generateActionObject("setLoading", store, loading);
}
