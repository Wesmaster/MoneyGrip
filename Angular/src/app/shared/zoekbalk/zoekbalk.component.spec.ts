import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoekbalkComponent } from './zoekbalk.component';

describe('ZoekbalkComponent', () => {
  let component: ZoekbalkComponent;
  let fixture: ComponentFixture<ZoekbalkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZoekbalkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZoekbalkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
