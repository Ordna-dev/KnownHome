import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { DashboardAlumnoService } from '../services/dashboard-alumno.service';
import { AlertController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-dashboard-alumno',
  templateUrl: './dashboard-alumno.page.html',
  styleUrls: ['./dashboard-alumno.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class DashboardAlumnoPage implements OnInit {
  grupos: any[] = []; 
  username: string = '';
  groupCode: string = '';
  errorMessage: string = ''; 

  constructor(
    private alertController: AlertController, 
    private dashboardAlumnoService: DashboardAlumnoService, 
    private router: Router) { }

  // AGM 19/02/2024 - Refrescar pagina
  handleRefresh() {
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }

  // AGM 31/01/2024 - Redireccionamiento al grupo
  goToGroup(groupId: number) {
    console.log(groupId);
    this.router.navigate(['/grupo-alumno'], { state: { grupoId: groupId } });
  }

  // AGM 31/01/2024 - Redireccionamiento al cierre de sesion
  logOut() {
    this.dashboardAlumnoService.logOut().subscribe({
      next: (html) => {
        console.log(html); // Mostrar la respuesta HTML en consola
        this.router.navigate(['/login-alumno']);
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }

  // AGM 31/01/2024 - Abrir o cerrar el primer modal
  isModalOpen = false;

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
    this.groupCode = '';
    this.errorMessage = ''; 
  }

  // AGM 31/01/2024 - Abrir o cerrar el quinto modal
  isFifthModalOpen = false;

  setFifthOpen(isOpen: boolean) {
    this.isFifthModalOpen = isOpen; 
  }

  getGroups() {
    this.dashboardAlumnoService.getGroups().subscribe({
      next: (json) => {
        console.log(json);
        this.grupos = json.grupos;
        this.username = json.username;
      },
      error: (error) => console.error('Error al obtener los grupos:', error)
    });
  }

  enrollStudentInGroup() {
    if (this.groupCode) {
      this.dashboardAlumnoService.enrollStudentInGroup(this.groupCode).subscribe({
        next: async (response) => {
          this.setOpen(false);
          console.log('Respuesta del servidor:', response);
          const alert = await this.alertController.create({
            header: 'Inscripción exitosa',
            message: 'Te has inscrito al grupo, serás redireccionado a ese grupo.',
            buttons: [{
              text: 'OK',
              handler: () => {
                this.getGroups();
              }
            }]
          });
          await alert.present();
        },
        error: (error) => {
          if (error.error && error.error.message) {
            this.errorMessage = error.error.message;
          } else {
            this.errorMessage = 'Error al inscribir al alumno en el grupo: ' + (error.message || 'Error desconocido');
          }
          console.error('Error completo:', error);
        }
      });
    } else {
      this.errorMessage = 'El código del grupo es necesario para la inscripción';
    }
  }

  ngOnInit() {
    this.getGroups();
  }
}