import { TestBed } from '@angular/core/testing';

import { ContextGuard } from './context.guard';

describe('ContextGuard', () => {
  let guard: ContextGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ContextGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
