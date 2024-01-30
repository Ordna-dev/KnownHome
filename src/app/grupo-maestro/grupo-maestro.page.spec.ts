import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GrupoMaestroPage } from './grupo-maestro.page';

describe('GrupoMaestroPage', () => {
  let component: GrupoMaestroPage;
  let fixture: ComponentFixture<GrupoMaestroPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(GrupoMaestroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
