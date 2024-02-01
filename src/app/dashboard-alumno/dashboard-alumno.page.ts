import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-alumno',
  templateUrl: './dashboard-alumno.page.html',
  styleUrls: ['./dashboard-alumno.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class DashboardAlumnoPage implements OnInit {

  constructor(private router: Router) { }

  // AGM 31/01/2024 - Redireccionamiento al grupo
  irGrupo() {
    // Futuras acciones
    this.router.navigate(['/grupo-alumno']);
  }

  // AGM 31/01/2024 - Redireccionamiento al cierre de sesion
  logOut() {
    // Acciones como limpiar datos de sesión
    this.router.navigate(['/login']);
  }

  // AGM 31/01/2024 - Abrir o cerrar el primer modal
  isModalOpen = false;

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  // AGM 31/01/2024 - Abrir o cerrar el quinto modal
  isFifthModalOpen = false;

  setFifthOpen(isOpen: boolean) {
    this.isFifthModalOpen = isOpen; 
  }

  ngOnInit() {
  }

}
