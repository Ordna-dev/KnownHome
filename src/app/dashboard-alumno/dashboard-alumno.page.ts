import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DashboardAlumnoService } from '../services/dashboard-alumno.service';
import { AlertController } from '@ionic/angular/standalone';
import {
  IonMenu,
  IonContent,
  IonHeader,
  IonItem,
  IonText,
  IonIcon,
  IonRefresher,
  IonRefresherContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonButton,
  IonModal,
  IonToolbar,
  IonTitle,
  IonInput,
  IonSearchbar,
  IonList,
  IonLabel,
  IonMenuButton,
  IonButtons
} from '@ionic/angular/standalone';


@Component({
  selector: 'app-dashboard-alumno',
  templateUrl: './dashboard-alumno.page.html',
  styleUrls: ['./dashboard-alumno.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, 
    IonMenu,
    IonContent,
    IonHeader,
    IonItem,
    IonText,
    IonIcon,
    IonRefresher,
    IonRefresherContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonButton,
    IonModal,
    IonToolbar,
    IonTitle,
    IonInput,
    IonSearchbar,
    IonList,
    IonLabel,
    IonMenuButton,
    IonButtons
  ]
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
        this.router.navigateByUrl('/login-alumno', {skipLocationChange: true}).then(()=>
        this.router.navigate(['/login-alumno', { timestamp: Date.now() }]));
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }

  // AGM 20/06/2024 - Redireccionamiento al tutorial de dashboard del alumno
  goToTutorialAlumnoDashboard() {
    this.router.navigateByUrl('/tutorial-alumno-dashboard', {skipLocationChange: true}).then(()=>
    this.router.navigate(['/tutorial-alumno-dashboard', { timestamp: Date.now() }]));
  }

  // AGM 20/06/2024 - Redireccionamiento al tutorial de grupos del alumno
  goToTutorialAlumnoGrupos() {
    this.router.navigateByUrl('/tutorial-alumno-grupos', {skipLocationChange: true}).then(()=>
    this.router.navigate(['/tutorial-alumno-grupos', { timestamp: Date.now() }]));
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
          this.getGroups();
          const alert = await this.alertController.create({
            header: 'Inscripción exitosa',
            message: 'Te has inscrito al grupo "' + response.nombre_grupo + '".',
            buttons: ['OK'],
            backdropDismiss: false
          });
          await alert.present();
        },
        error: async (error) => {
          if (error.error && error.error.message) {
            this.errorMessage = error.error.message;
          } else {
            this.errorMessage = 'Error al inscribir al alumno en el grupo: ' + (error.message || 'Error desconocido');
          }
          console.error('Error completo:', error);
  
          const alert = await this.alertController.create({
            header: 'Error al inscribir',
            message: this.errorMessage,
            buttons: ['OK'],
            backdropDismiss: false
          });
          await alert.present();
        }
      });
    } else {
      this.errorMessage = 'El código del grupo es necesario para la inscripción';
    }
  }

  handleSearchInput(event: CustomEvent) {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    if (query && query.trim() !== '') {
      this.dashboardAlumnoService.getGroupsByQuery(query).subscribe({
        next: (response) => {
          if (!response.error) {
            console.log(this.grupos);
            this.grupos = response.grupos;
          } else {
            this.grupos = [];
            console.error(response.message || 'No se encontraron grupos.');
          }
        },
        error: (error) => console.error('Error al buscar grupos:', error),
      });
    } else {
      this.getGroups();  // Restaurar la lista original si no hay consulta
    }
  }

  ngOnInit() {
    this.getGroups();
  }
}