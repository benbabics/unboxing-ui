import { TestBed } from '@angular/core/testing';

import { EditorChangeHistoryService } from './editor-change-history.service';

describe('EditorChangeHistoryService', () => {
  let service: EditorChangeHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditorChangeHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
