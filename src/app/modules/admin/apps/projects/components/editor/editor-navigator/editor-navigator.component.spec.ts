import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorNavigatorComponent } from './editor-navigator.component';

describe('EditorNavigatorComponent', () => {
  let component: EditorNavigatorComponent;
  let fixture: ComponentFixture<EditorNavigatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorNavigatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorNavigatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
