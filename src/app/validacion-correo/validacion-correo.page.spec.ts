import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ValidacionCorreoPage } from './validacion-correo.page';

describe('ValidacionCorreoPage', () => {
  let component: ValidacionCorreoPage;
  let fixture: ComponentFixture<ValidacionCorreoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ValidacionCorreoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
