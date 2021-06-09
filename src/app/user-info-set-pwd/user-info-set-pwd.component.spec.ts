import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInfoSetPwdComponent } from './user-info-set-pwd.component';

describe('UserInfoSetPwdComponent', () => {
  let component: UserInfoSetPwdComponent;
  let fixture: ComponentFixture<UserInfoSetPwdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserInfoSetPwdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserInfoSetPwdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
