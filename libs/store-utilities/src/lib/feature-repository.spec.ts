import { TestBed } from '@angular/core/testing';
import { createFeatureSelector, Store } from '@ngrx/store';
import { FeatureRepository } from './feature-repository';
import { Injectable } from '@angular/core';
import { cold } from 'jasmine-marbles';
import { map } from 'rxjs/operators';
import { provideMockStore } from '@ngrx/store/testing';
interface TestState {
  testProp: string;
}

const featureStateKey = 'test';
const initialState: TestState = { testProp: 'Tested' };
const testSelector = createFeatureSelector<TestState>(featureStateKey);

@Injectable()
class TestFeatureRepositoryService extends FeatureRepository<TestState> {
  constructor(protected store$: Store<TestState>) {
    super(store$, featureStateKey);
  }
  public getTestProp() {
    return this.getState().pipe(map((state: TestState) => state.testProp));
  }
}

@Injectable()
class TestFeatureRepositoryWithSelectorService extends FeatureRepository<TestState> {
  constructor(protected store$: Store<TestState>) {
    super(store$, testSelector);
  }
  public getTestProp() {
    return this.getState().pipe(map((state: TestState) => state.testProp));
  }
}

describe('FeatureRepository', () => {
  let repository: TestFeatureRepositoryService;
  let repositoryWithSelector: TestFeatureRepositoryWithSelectorService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
      ],
      providers: [
        TestFeatureRepositoryService,
        TestFeatureRepositoryWithSelectorService,
        provideMockStore({
          initialState: {
            [featureStateKey]: initialState
          }
        })
      ]
    });
  });
  beforeEach(() => {
    repository = TestBed.inject(TestFeatureRepositoryService);
    repositoryWithSelector = TestBed.inject(
      TestFeatureRepositoryWithSelectorService
    );
  });
  describe('When using the repository with the string based stateLocator', () => {
    it('Should return the value of the testProp', () => {
      expect(repository.getTestProp()).toBeObservable(
        cold('a', { a: initialState.testProp })
      );
    });
  });
  describe('When using the repository with the selector based stateLocator', () => {
    it('Should return the value of the testProp', () => {
      expect(repositoryWithSelector.getTestProp()).toBeObservable(
        cold('a', { a: initialState.testProp })
      );
    });
  });
});
