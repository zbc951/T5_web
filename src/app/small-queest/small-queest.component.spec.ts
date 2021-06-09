import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmallQueestComponent } from './small-queest.component';

describe('SmallQueestComponent', () => {
  let component: SmallQueestComponent;
  let fixture: ComponentFixture<SmallQueestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmallQueestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmallQueestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
