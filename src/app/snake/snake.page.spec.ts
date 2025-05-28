import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SnakePage } from './snake.page';

describe('SnakePage', () => {
  let component: SnakePage;
  let fixture: ComponentFixture<SnakePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SnakePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
