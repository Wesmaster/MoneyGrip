import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoclinkComponent } from './doclink.component';

describe('DoclinkComponent', () => {
  let component: DoclinkComponent;
  let fixture: ComponentFixture<DoclinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoclinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoclinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
