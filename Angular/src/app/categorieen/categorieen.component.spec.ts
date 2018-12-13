import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorieenComponent } from './categorieen.component';

describe('CategorieenComponent', () => {
  let component: CategorieenComponent;
  let fixture: ComponentFixture<CategorieenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategorieenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategorieenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
