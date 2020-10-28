import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorInspectorComponent } from './editor-inspector.component';

describe('EditorInspectorComponent', () => {
  let component: EditorInspectorComponent;
  let fixture: ComponentFixture<EditorInspectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorInspectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorInspectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
