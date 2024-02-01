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

  irGrupo() {
    // Acciones como limpiar datos de sesión
    this.router.navigate(['/grupo-alumno']);
  }

  isFifthModalOpen = false;

  //AGM 31/01/2024 - Abrir o cerrar el quinto modal
  setFifthOpen(isOpen: boolean) {
    this.isFifthModalOpen = isOpen; 
  }

  //AGM 30/01/2024 - Pintar de colores aleatorios las cards
  /*colores = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger', 'light', 'medium', 'dark'];

  getColorAleatorio(): string {
    const indiceAleatorio = Math.floor(Math.random() * this.colores.length);
    return this.colores[indiceAleatorio];
  }*/

  isModalOpen = false;

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  ngOnInit() {
  }

}
