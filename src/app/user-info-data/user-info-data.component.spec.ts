import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInfoDataComponent } from './user-info-data.component';

describe('UserInfoDataComponent', () => {
  let component: UserInfoDataComponent;
  let fixture: ComponentFixture<UserInfoDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserInfoDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserInfoDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
