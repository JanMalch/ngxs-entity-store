import {ExtendsEntityStore, generateActionObject} from '../internal';
import {EntitySelector, Payload} from './type-alias';

/*export interface EntityRemoveAction<T> {
  payload: EntitySelector<T>;
}*/
export type EntityRemoveAction<T> = Payload<EntitySelector<T>>;

export function Remove<T>(store: ExtendsEntityStore<T>, payload: EntitySelector<T>): EntityRemoveAction<T> {
  return generateActionObject('remove', store, payload);
}
