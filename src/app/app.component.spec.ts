import {ComponentFixture, ComponentFixtureAutoDetect, TestBed} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {AppModule} from './app.module';
import {Store} from '@ngxs/store';
import {defaultEntityState} from './store/entity-store';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      providers: [{provide: ComponentFixtureAutoDetect, useValue: true}]
    });

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;

    // reset store because of storage plugin
    const store = TestBed.get(Store);
    store.reset({todo: defaultEntityState()});
  });

  it('should add a todo', () => {
    component.addToDo();

    component.toDos$.subscribe(state => {
      expect(state.length).toBe(1);
    });
  });

  it('should update a todo', () => {
    component.addToDo();
    component.setDone({
      title: 'NGXS Entity Store 1',
      description: 'Doesn\'t matter. Just need title for ID',
      done: false
    });

    component.toDos$.subscribe(([state]) => {
      expect(state.title).toBe('NGXS Entity Store 1');
      expect(state.done).toBeTruthy();
    });
  });

  it('should remove a todo', () => {
    component.addToDo();
    component.addToDo();
    component.open('NGXS Entity Store 1');
    component.removeToDo('NGXS Entity Store 1');

    component.toDos$.subscribe(state => {
      expect(state.length).toBe(1);
      expect(state[0].title).toBe('NGXS Entity Store 2');
    });

    component.activeId$.subscribe(state => {
      expect(state).toBeUndefined();
    });
  });

  it('should add multiple todos', () => {
    component.addMultiple();

    component.toDos$.subscribe(state => {
      expect(state.length).toBe(2);
    });
  });

  it('should update multiple todos', () => {
    component.addToDo();
    component.addToDo();
    component.addToDo();
    component.doneAll([
      {
        title: 'NGXS Entity Store 1',
        description: 'Doesn\'t matter. Just need title for ID',
        done: false
      },
      {
        title: 'NGXS Entity Store 2',
        description: 'Doesn\'t matter. Just need title for ID',
        done: false
      }
    ]);

    component.toDos$.subscribe(([first, second, third]) => {
      expect(first.title).toBe('NGXS Entity Store 1');
      expect(first.done).toBeTruthy();
      expect(second.title).toBe('NGXS Entity Store 2');
      expect(second.done).toBeTruthy();
      expect(third.title).toBe('NGXS Entity Store 3');
      expect(third.done).toBeFalsy();
    });
  });

  it('should remove multiple todos', () => {
    component.addToDo();
    component.open('NGXS Entity Store 1');
    component.addToDo();
    component.addToDo();
    component.addToDo();
    component.addToDo();
    component.removeMultiple([
      'NGXS Entity Store 1',
      'NGXS Entity Store 2',
      'NGXS Entity Store 3'
    ]);

    component.toDos$.subscribe(([first]) => {
      expect(first.title).toBe('NGXS Entity Store 4');
    });

    component.activeId$.subscribe(state => {
      expect(state).toBeUndefined();
    });
  });

  it('should toggle loading', () => {
    component.toggleLoading();

    component.loading$.subscribe(state => {
      expect(state).toBeTruthy();
    });
  });

  it('should toggle error', () => {
    component.toggleError();

    component.error$.subscribe(state => {
      expect(state instanceof Error).toBeTruthy();
    });
  });

  it('should set active entity', () => {
    component.addToDo();
    component.open('NGXS Entity Store 1');

    component.active$.subscribe(state => {
      expect(state).toBeTruthy();
    });
  });

  it('should update active entity', () => {
    component.addToDo();
    component.addToDo();
    component.addToDo();
    component.open('NGXS Entity Store 2');
    component.setDoneActive();

    component.active$.subscribe(state => {
      expect(state.title).toBe('NGXS Entity Store 2');
      expect(state.done).toBeTruthy();
    });
  });

  it('should clear active entity', () => {
    component.addToDo();
    component.open('NGXS Entity Store 1');
    component.closeDetails();

    component.active$.subscribe(state => {
      expect(state).toBeUndefined();
    });
  });

  it('should remove all entities', () => {
    component.addToDo();
    component.addToDo();
    component.open('NGXS Entity Store 2');
    component.addToDo();
    component.toggleLoading();
    component.toggleError();
    component.clearEntities();

    component.toDos$.subscribe(state => {
      expect(state.length).toBe(0);
    });

    component.activeId$.subscribe(state => {
      expect(state).toBeUndefined();
    });

    component.error$.subscribe(state => {
      expect(state instanceof Error).toBeTruthy();
    });

    component.loading$.subscribe(state => {
      expect(state).toBeTruthy();
    });
  });

  it('should completely reset store', () => {
    component.addToDo();
    component.addToDo();
    component.open('NGXS Entity Store 2');
    component.addToDo();
    component.toggleLoading();
    component.toggleError();
    component.resetState();

    component.toDos$.subscribe(state => {
      expect(state.length).toBe(0);
    });

    component.activeId$.subscribe(state => {
      expect(state).toBeUndefined();
    });

    component.error$.subscribe(state => {
      expect(state).toBeUndefined();
    });

    component.loading$.subscribe(state => {
      expect(state).toBeFalsy();
    });
  });

});
