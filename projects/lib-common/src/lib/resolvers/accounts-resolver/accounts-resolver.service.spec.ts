import { TestBed } from '@angular/core/testing';

import { AccountsResolverService } from './accounts-resolver.service';

describe('AccountsResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AccountsResolverService = TestBed.get(AccountsResolverService);
    expect(service).toBeTruthy();
  });
});
