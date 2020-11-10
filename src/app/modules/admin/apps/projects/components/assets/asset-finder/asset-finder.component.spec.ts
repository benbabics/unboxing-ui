import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetFinderComponent } from './asset-finder.component';

describe('AssetFinderComponent', () => {
  let component: AssetFinderComponent;
  let fixture: ComponentFixture<AssetFinderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetFinderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetFinderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
