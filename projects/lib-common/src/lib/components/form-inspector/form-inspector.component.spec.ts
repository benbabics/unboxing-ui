import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormInspectorComponent } from './form-inspector.component';

describe('FormInspectorComponent', () => {
  let component: FormInspectorComponent;
  let fixture: ComponentFixture<FormInspectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormInspectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormInspectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
