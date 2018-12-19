import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogBevestigenComponent } from './dialog-bevestigen.component';

describe('DialogBevestigenComponent', () => {
  let component: DialogBevestigenComponent;
  let fixture: ComponentFixture<DialogBevestigenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogBevestigenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogBevestigenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
