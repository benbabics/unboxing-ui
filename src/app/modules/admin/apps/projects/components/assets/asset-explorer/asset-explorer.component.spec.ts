import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetExplorerComponent } from './asset-explorer.component';

describe('AssetExplorerComponent', () => {
  let component: AssetExplorerComponent;
  let fixture: ComponentFixture<AssetExplorerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetExplorerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
