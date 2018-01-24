import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccidentnatureComponent } from './accidentnature.component';

describe('AccidentnatureComponent', () => {
  let component: AccidentnatureComponent;
  let fixture: ComponentFixture<AccidentnatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccidentnatureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccidentnatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
