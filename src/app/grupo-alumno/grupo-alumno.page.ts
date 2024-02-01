import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-grupo-alumno',
  templateUrl: './grupo-alumno.page.html',
  styleUrls: ['./grupo-alumno.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class GrupoAlumnoPage implements OnInit {

  // AGM 31/01/2024 - Redireccionamiento al cierre de sesión
  constructor(private router: Router, private navCtrl: NavController) { }

  goBack() {
    this.navCtrl.back();
  }

  redirectToLogin() {
    this.router.navigateByUrl('/login');
  }

  // AGM 31/01/2024 - Modals de la visualizacion de alumnos, visualización de fotografías del profesor y autorizadas del alumno y visualizacion de imagen 
  isFourthModalOpen = false; 
  isFifthModalOpen = false;
  isSixthModalOpen = false;
  isSeventhModalOpen = false;

  setFourthOpen(isOpen: boolean) {
    this.isFourthModalOpen = isOpen;
  }

  setFifthOpen(isOpen: boolean) {
    this.isFifthModalOpen = isOpen;
  }

  setSixthOpen(isOpen: boolean) {
    this.isSixthModalOpen = isOpen;
  }

  setSeventhOpen(isOpen: boolean) {
    this.isSeventhModalOpen = isOpen;
  }

  ngOnInit() {
  }

}
