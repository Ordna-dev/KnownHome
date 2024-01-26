import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardMaestroPage } from './dashboard-maestro.page';

describe('DashboardMaestroPage', () => {
  let component: DashboardMaestroPage;
  let fixture: ComponentFixture<DashboardMaestroPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DashboardMaestroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
