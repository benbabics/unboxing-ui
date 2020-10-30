import { TestBed } from '@angular/core/testing';

import { CarouselVideosService } from './carousel-videos.service';

describe('CarouselVideosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CarouselVideosService = TestBed.get(CarouselVideosService);
    expect(service).toBeTruthy();
  });
});
