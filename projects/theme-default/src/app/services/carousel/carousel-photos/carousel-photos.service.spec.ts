import { TestBed } from '@angular/core/testing';

import { CarouselPhotosService } from './carousel-photos.service';

describe('CarouselPhotosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CarouselPhotosService = TestBed.get(CarouselPhotosService);
    expect(service).toBeTruthy();
  });
});
