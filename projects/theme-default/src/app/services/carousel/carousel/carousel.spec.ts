import { TestBed } from '@angular/core/testing';

import { Carousel } from './carousel';

describe('Carousel', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Carousel = TestBed.get(Carousel);
    expect(service).toBeTruthy();
  });
});
