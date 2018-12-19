import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InkomstComponent } from './inkomst.component';

describe('InkomstComponent', () => {
  let component: InkomstComponent;
  let fixture: ComponentFixture<InkomstComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InkomstComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InkomstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
