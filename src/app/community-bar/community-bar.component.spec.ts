import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityBarComponent } from './community-bar.component';

describe('CommunityBarComponent', () => {
  let component: CommunityBarComponent;
  let fixture: ComponentFixture<CommunityBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommunityBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
