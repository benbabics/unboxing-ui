import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandShowComponent } from './brand-show.component';

describe('BrandShowComponent', () => {
  let component: BrandShowComponent;
  let fixture: ComponentFixture<BrandShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrandShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
