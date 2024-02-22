import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular/standalone';
import { GrupoAlumnoService } from '../services/grupo-alumno.service';
import {
  IonMenu,
  IonContent,
  IonText,
  IonIcon,
  IonRefresher,
  IonRefresherContent,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton
} from '@ionic/angular/standalone';


@Component({
  selector: 'app-grupo-alumno',
  templateUrl: './grupo-alumno.page.html',
  styleUrls: ['./grupo-alumno.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, 
    IonMenu,
    IonContent,
    IonText,
    IonIcon,
    IonRefresher,
    IonRefresherContent,
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton
  ],  
})
export class GrupoAlumnoPage implements OnInit {
  grupoId!: number;
  grupo: any;
  students: any[] = []; 

  // AGM 31/01/2024
  constructor(
    private grupoAlumnoService: GrupoAlumnoService, 
    private route: ActivatedRoute,
    private router: Router, 
    private navCtrl: NavController,
    private alertController: AlertController,
  ) { }

  // AGM 31/01/2024 - Volver a la pagina anterior
  goBack() {
    this.navCtrl.back();
  }

  // AGM 31/01/2024 - Cerrar sesion
  redirectToLogin() {
    this.router.navigateByUrl('/login');
  }

  // AGM 19/02/2024 - Refrescar pagina
  handleRefresh() {
    setTimeout(() => {
      window.location.reload();
    }, 2000);
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

  // AGM 17/02/2024 - Obtener el grupo para el alumno
  getGroup() {
    if (this.grupoId) {
      this.grupoAlumnoService.getGroup(this.grupoId).subscribe({
        next: (response) => {
          if (!response.error && response.grupo && response.grupo.length > 0) {
            console.log(response.grupo[0]);
            this.grupo = response.grupo[0];
          } else {
            console.error('La estructura de la respuesta del servidor no es la esperada.');
          }
        },
        error: (error) => {
          console.error('Error al obtener la información del grupo:', error);
        }
      });
    }
  }

  // AGM 17/02/2024 - Obtener los alumnos del grupo
  getEnrolledStudents() {
    if (this.grupoId) {
      this.grupoAlumnoService.getEnrolledStudents(this.grupoId).subscribe({
        next: (response) => {
          this.students = response.estudiantes || []; 
          console.log('Alumnos inscritos:', this.students); 
        },
        error: (error) => {
          console.error('Error al obtener los alumnos inscritos:', error);
        }
      });
    }
  }

  // AGM 17/02/2024 - Salir del grupo (alumno)
  async leaveGroup() {
    if (this.grupoId) {
      const alert = await this.alertController.create({
        header: 'Confirmar',
        message: '¿Estás seguro de salir del grupo?',
        buttons: [
          {
            text: 'No',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              console.log('Acción de salir cancelada');
            }
          }, {
            text: 'Sí',
            handler: () => {
              this.confirmLeaveGroup();
            }
          }
        ]
      });

      await alert.present();
    } else {
      console.error('Error: No se ha proporcionado un ID de grupo válido.');
    }
  }

  private confirmLeaveGroup() {
    this.grupoAlumnoService.leaveGroup(this.grupoId).subscribe({
      next: async (response) => {
        console.log(response.message);
        // Define la acción de redireccionamiento
        const redirectToDashboard = () => {
          this.router.navigateByUrl('/dashboard-alumno', {skipLocationChange: true}).then(()=>
          this.router.navigate(['/dashboard-alumno', { timestamp: Date.now() }]));
        };
  
        const alert = await this.alertController.create({
          header: 'Salida del grupo',
          message: 'Has salido del grupo. Redirigiendo a la pantalla principal...',
          buttons: [{
            text: 'Aceptar',
            handler: () => redirectToDashboard()
          }],
          backdropDismiss: true // Permite cerrar la alerta tocando fuera
        });
  
        // Asegúrate de ejecutar redirectToDashboard si la alerta se cierra de cualquier manera
        alert.onDidDismiss().then((detail) => {
          if (detail.role === 'backdrop' || detail.role === 'cancel') {
            redirectToDashboard();
          }
        });
  
        await alert.present();
      },
      error: async (error) => {
        console.error('Error al salir del grupo:', error);
        const errorAlert = await this.alertController.create({
          header: 'Error',
          message: 'No se pudo salir del grupo. Por favor, intenta de nuevo.',
          buttons: ['Aceptar']
        });
        await errorAlert.present();
      }
    });
  }  

  // AGM 17/02/2024 - Al iniciar la pagina, obtiene la informacion del grupo y de los alumnos
  ngOnInit() {
    const currentNavigation = this.router.getCurrentNavigation();
    if (currentNavigation?.extras?.state) {
      this.grupoId = currentNavigation.extras.state['grupoId'];
      if (this.grupoId) {
        console.log('Grupo-maestro: grupoId:', this.grupoId);
        this.getGroup();
        this.getEnrolledStudents();
      } else {
        console.error('grupoId no está presente en el estado de navegación.');
      }
    } else {
      console.error('No se han pasado datos de estado de navegación.');
    }
  }
}