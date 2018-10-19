import {StateContext} from '@ngxs/store';
import {
  EntityAddAction,
  EntityAddAllAction,
  EntityRemoveAction,
  EntityRemoveAllAction,
  EntitySetActiveAction,
  EntitySetErrorAction,
  EntitySetLoadingAction,
  EntityUpdateAction,
  EntityUpdateActiveAction,
  EntityUpdateAllAction
} from './action-generator';
import {ExtendsEntityStore, getActive, HashMap} from './internal';

export interface EntityStateModel<T> {
  entities: HashMap<T>;
  loading: boolean;
  error: Error | undefined;
  active: string | undefined;
}

export function defaultEntityState(): EntityStateModel<any> {
  return {
    entities: {},
    loading: false,
    error: undefined,
    active: undefined
  };
}

export abstract class EntityStore<T> {
  protected readonly idKey: string;
  protected readonly storePath: string;

  protected constructor(storeClass: ExtendsEntityStore<T>, _idKey: keyof T) {
    this.idKey = _idKey as string;
    this.storePath = storeClass['NGXS_META'].path;
    this.setup(storeClass,
      'add', 'addAll',
      'update', 'updateAll', 'updateActive',
      'remove', 'removeAll', 'clear',
      'setLoading', 'setError',
      'setActive', 'clearActive',
      'reset');
  }

  static get storePath(): string { // used by static getters
    return this['NGXS_META'].path;
  }

  static get activeId() {
    return (state) => {
      const subState = elvis(state, this.storePath) as EntityStateModel<any>;
      return subState.active;
    };
  }

  static get active() {
    return (state) => {
      const subState = elvis(state, this.storePath) as EntityStateModel<any>;
      return getActive(subState);
    };
  }

  static get keys() {
    return (state) => {
      const subState = elvis(state, this.storePath) as EntityStateModel<any>;
      return Object.keys(subState.entities);
    };
  }

  static get entities() {
    return (state) => {
      const subState = elvis(state, this.storePath) as EntityStateModel<any>;
      return Object.values(subState.entities);
    };
  }

  static get entitiesMap() {
    return (state) => {
      const subState = elvis(state, this.storePath) as EntityStateModel<any>;
      return subState.entities;
    };
  }

  static get size() {
    return (state) => {
      const subState = elvis(state, this.storePath) as EntityStateModel<any>;
      return Object.keys(subState.entities).length;
    };
  }

  static get error() {
    return (state) => {
      const name = this.storePath;
      return elvis(state, name).error;
    };
  }

  static get loading() {
    return (state) => {
      const name = this.storePath;
      return elvis(state, name).loading;
    };
  }

  abstract onUpdate(current: T, updated: Partial<T>): T;

  private _update(entities: HashMap<T>, entity: Partial<T>, _id?: string): HashMap<T> {
    const id = _id || this.idOf(entity);
    assertValidId(id);
    const current = entities[id];
    // enforce Immutable Entities ?
    // typeof current === "object" && current !== updated
    entities[id] = this.onUpdate(current, entity);
    return entities;
  }

  add({getState, patchState}: StateContext<EntityStateModel<T>>, {payload}: EntityAddAction<T>) {
    const {entities} = getState();
    entities[this.idOf(payload)] = payload;
    patchState({entities: {...entities}});
  }

  addAll({getState, patchState}: StateContext<EntityStateModel<T>>, {payload}: EntityAddAllAction<T>) {
    const {entities} = getState();
    payload.forEach(entity => {
      entities[this.idOf(entity)] = entity;
    });
    patchState({entities: {...entities}});
  }

  update({getState, patchState}: StateContext<EntityStateModel<T>>, {payload}: EntityUpdateAction<T>) {
    const {entities} = getState();
    patchState({entities: {...this._update(entities, payload)}});
  }

  updateActive({getState, patchState}: StateContext<EntityStateModel<T>>, {payload}: EntityUpdateActiveAction<T>) {
    const state = getState();
    const id = this.idOf(getActive(state));
    const {entities} = state;
    patchState({entities: {...this._update(entities, payload, id)}});
  }

  updateAll({getState, patchState}: StateContext<EntityStateModel<T>>, {payload}: EntityUpdateAllAction<T>) {
    let {entities} = getState();
    payload.forEach(e => {
      entities = {...this._update(entities, e)};
    });
    patchState({entities});
  }

  remove({getState, patchState}: StateContext<EntityStateModel<T>>, {payload}: EntityRemoveAction) {
    const {entities, active} = getState();
    delete entities[payload];

    patchState({
      entities: {...entities},
      active: active === payload ? undefined : active
    });
  }

  removeAll({getState, patchState}: StateContext<EntityStateModel<T>>, {payload}: EntityRemoveAllAction) {
    const {entities, active} = getState();
    const wasActive = payload.includes(active);
    payload.forEach(id => delete entities[id]);
    patchState({
      entities: {...entities},
      active: wasActive ? undefined : active
    });
  }

  clear({patchState}: StateContext<EntityStateModel<T>>) {
    patchState({entities: {}, active: undefined});
  }

  reset({setState}: StateContext<EntityStateModel<T>>) {
    setState(defaultEntityState());
  }

  setLoading({patchState}: StateContext<EntityStateModel<T>>, {payload}: EntitySetLoadingAction) {
    patchState({loading: payload});
  }

  setActive({patchState}: StateContext<EntityStateModel<T>>, {payload}: EntitySetActiveAction) {
    patchState({active: payload});
  }

  clearActive({patchState}: StateContext<EntityStateModel<T>>) {
    patchState({active: undefined});
  }

  setError({patchState}: StateContext<EntityStateModel<T>>, {payload}: EntitySetErrorAction) {
    patchState({error: payload});
  }

  protected setup(storeClass: ExtendsEntityStore<T>, ...actions: string[]) {
    actions.forEach(fn => {
      const actionName = `[${this.storePath}] ${fn}`;
      storeClass['NGXS_META'].actions[actionName] = [
        {
          fn: fn,
          options: {},
          type: actionName
        }
      ];
    });
  }

  protected idOf(data: Partial<T>): string {
    return data[this.idKey];
  }

}

function assertValidId(id: string) {
  if (id === undefined) {
    throw new Error('Invalid ID for update action. Result of getID wasn\'t a valid ID.');
  }
}

function elvis(object: any, path: string) {
  return path ? path.split('.').reduce(function (value, key) {
    return value && value[key];
  }, object) : object;
}
