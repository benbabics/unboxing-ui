import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorHistoryComponent } from './editor-history.component';

describe('EditorHistoryComponent', () => {
  let component: EditorHistoryComponent;
  let fixture: ComponentFixture<EditorHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
