import { TestBed } from '@angular/core/testing';

import { CanDeactivate } from './brands.guard';

describe('CanDeactivate', () => {
  let guard: CanDeactivate;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CanDeactivate);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
