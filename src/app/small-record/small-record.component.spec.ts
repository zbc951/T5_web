import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmallRecordComponent } from './small-record.component';

describe('SmallRecordComponent', () => {
  let component: SmallRecordComponent;
  let fixture: ComponentFixture<SmallRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmallRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmallRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
