import {ExtendsEntityStore, generateActionObject} from '../internal';

export function Reset(store: ExtendsEntityStore<any>): {} {
  return generateActionObject('reset', store);
}
