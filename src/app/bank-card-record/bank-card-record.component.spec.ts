import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankCardRecordComponent } from './bank-card-record.component';

describe('BankCardRecordComponent', () => {
  let component: BankCardRecordComponent;
  let fixture: ComponentFixture<BankCardRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankCardRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankCardRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
