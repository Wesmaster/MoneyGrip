import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReserveringComponent } from './reservering.component';

describe('ReserveringComponent', () => {
  let component: ReserveringComponent;
  let fixture: ComponentFixture<ReserveringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReserveringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReserveringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
