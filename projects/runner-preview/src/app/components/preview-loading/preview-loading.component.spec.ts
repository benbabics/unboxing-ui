import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewLoadingComponent } from './preview-loading.component';

describe('PreviewLoadingComponent', () => {
  let component: PreviewLoadingComponent;
  let fixture: ComponentFixture<PreviewLoadingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewLoadingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
