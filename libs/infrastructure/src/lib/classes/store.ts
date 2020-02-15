import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

export class Store<StateType = any> {
  private _state$: BehaviorSubject<StateType>;

  constructor(initialState: StateType) {
    this._state$ = new BehaviorSubject(initialState);
  }

  getState(): Observable<StateType> {
    return this._state$.pipe(distinctUntilChanged());
  }

  getStateSnapshot(): StateType {
    return this._state$.getValue();
  }

  select<K extends keyof StateType>(key: K): Observable<StateType[K]> {
    return this._state$.pipe(
      map((state: StateType) => state[key]),
      distinctUntilChanged()
    );
  }

  setState(partialState: Partial<StateType>): void {
    const currentState = this.getStateSnapshot();
    this._state$.next({ ...currentState, ...partialState });
  }
}
