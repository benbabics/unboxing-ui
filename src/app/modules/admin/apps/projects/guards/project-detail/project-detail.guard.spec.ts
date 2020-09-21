import { TestBed } from '@angular/core/testing';

import { ProjectDetailGuard } from './project-detail.guard';

describe('ProjectDetailGuard', () => {
  let guard: ProjectDetailGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ProjectDetailGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
