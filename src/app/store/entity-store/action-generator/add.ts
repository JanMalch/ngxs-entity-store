import {ExtendsEntityStore, generateActionObject} from '../internal';
import {Payload} from './type-alias';

/*export interface EntityAddAction<T> {
  payload: T | T[];
}*/
export type EntityAddAction<T> = Payload<T | T[]>;

// TODO: behaviour? Should add also replace if it exists? Seperate CreateOrReplace?
export function AddOrReplace<T>(store: ExtendsEntityStore<T>, payload: T | T[]): EntityAddAction<T> {
  return generateActionObject('add', store, payload);
}
