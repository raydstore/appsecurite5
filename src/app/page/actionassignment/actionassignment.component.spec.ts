import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionassignmentComponent } from './actionassignment.component';

describe('ActionassignmentComponent', () => {
  let component: ActionassignmentComponent;
  let fixture: ComponentFixture<ActionassignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionassignmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionassignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
