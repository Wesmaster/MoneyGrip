import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogLadenComponent } from './dialog-laden.component';

describe('DialogLadenComponent', () => {
  let component: DialogLadenComponent;
  let fixture: ComponentFixture<DialogLadenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogLadenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogLadenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
