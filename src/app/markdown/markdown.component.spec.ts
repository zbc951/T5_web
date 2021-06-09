import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkdownTestComponent } from './markdown.component';

describe('MarkdownTestComponent', () => {
  let component: MarkdownTestComponent;
  let fixture: ComponentFixture<MarkdownTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarkdownTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkdownTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
