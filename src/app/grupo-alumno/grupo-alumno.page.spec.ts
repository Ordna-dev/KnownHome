import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GrupoAlumnoPage } from './grupo-alumno.page';

describe('GrupoAlumnoPage', () => {
  let component: GrupoAlumnoPage;
  let fixture: ComponentFixture<GrupoAlumnoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(GrupoAlumnoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
