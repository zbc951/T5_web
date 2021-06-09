import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderQuickTransferComponent } from './header-quick-transfer.component';

describe('HeaderQuickTransferComponent', () => {
  let component: HeaderQuickTransferComponent;
  let fixture: ComponentFixture<HeaderQuickTransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderQuickTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderQuickTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
