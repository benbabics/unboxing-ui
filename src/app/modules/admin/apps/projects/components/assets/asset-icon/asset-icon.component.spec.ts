import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetIconComponent } from './asset-icon.component';

describe('AssetIconComponent', () => {
  let component: AssetIconComponent;
  let fixture: ComponentFixture<AssetIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
