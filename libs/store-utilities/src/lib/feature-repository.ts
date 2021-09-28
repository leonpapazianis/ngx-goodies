import {
  MemoizedSelector,
  Store,
  select,
  createSelector,
  createFeatureSelector
} from '@ngrx/store';
import { Observable } from 'rxjs';

export class FeatureRepository<T> {
  private featureSelector: MemoizedSelector<any, T>;

  constructor(
    protected store$: Store<T>,
    protected stateLocator: string | MemoizedSelector<any, T>
  ) {
    this.setFeatureSelector(stateLocator);
  }

  private setFeatureSelector(stateLocator: string | MemoizedSelector<any, T>) {
    const isString =
      typeof stateLocator === 'string' || stateLocator instanceof String;
    this.featureSelector = isString
      ? createFeatureSelector<any, T>(stateLocator as string)
      : (stateLocator as MemoizedSelector<any, T>);
  }

  protected getState(): Observable<T> {
    return this.store$.pipe(
      select(createSelector(this.featureSelector, (state: T) => state))
    );
  }
}
