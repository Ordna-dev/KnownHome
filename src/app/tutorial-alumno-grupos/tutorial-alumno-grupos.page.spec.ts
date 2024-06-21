import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TutorialAlumnoGruposPage } from './tutorial-alumno-grupos.page';

describe('TutorialAlumnoGruposPage', () => {
  let component: TutorialAlumnoGruposPage;
  let fixture: ComponentFixture<TutorialAlumnoGruposPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TutorialAlumnoGruposPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
