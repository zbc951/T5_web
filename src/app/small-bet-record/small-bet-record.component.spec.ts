import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmallBetRecordComponent } from './small-bet-record.component';

describe('SmallBetRecordComponent', () => {
  let component: SmallBetRecordComponent;
  let fixture: ComponentFixture<SmallBetRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmallBetRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmallBetRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
