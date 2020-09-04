import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandNewComponent } from './brand-new.component';

describe('BrandNewComponent', () => {
  let component: BrandNewComponent;
  let fixture: ComponentFixture<BrandNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrandNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
