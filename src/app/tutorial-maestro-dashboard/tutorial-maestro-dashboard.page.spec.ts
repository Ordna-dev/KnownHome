import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TutorialMaestroDashboardPage } from './tutorial-maestro-dashboard.page';

describe('TutorialMaestroDashboardPage', () => {
  let component: TutorialMaestroDashboardPage;
  let fixture: ComponentFixture<TutorialMaestroDashboardPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TutorialMaestroDashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
