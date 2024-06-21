import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TutorialMaestroGruposPage } from './tutorial-maestro-grupos.page';

describe('TutorialMaestroGruposPage', () => {
  let component: TutorialMaestroGruposPage;
  let fixture: ComponentFixture<TutorialMaestroGruposPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TutorialMaestroGruposPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
