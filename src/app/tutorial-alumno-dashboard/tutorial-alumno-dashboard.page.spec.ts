import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TutorialAlumnoDashboardPage } from './tutorial-alumno-dashboard.page';

describe('TutorialAlumnoDashboardPage', () => {
  let component: TutorialAlumnoDashboardPage;
  let fixture: ComponentFixture<TutorialAlumnoDashboardPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TutorialAlumnoDashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
