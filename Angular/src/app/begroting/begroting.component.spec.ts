import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BegrotingComponent } from './begroting.component';

describe('BegrotingComponent', () => {
  let component: BegrotingComponent;
  let fixture: ComponentFixture<BegrotingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BegrotingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BegrotingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
