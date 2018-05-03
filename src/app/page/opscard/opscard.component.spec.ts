import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpscardComponent } from './opscard.component';

describe('OpscardComponent', () => {
  let component: OpscardComponent;
  let fixture: ComponentFixture<OpscardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpscardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpscardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
