import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectorRef, NgZone } from '@angular/core';
import { GrupoMaestroService } from '../services/grupo-maestro.service';

@Component({
  selector: 'app-grupo-maestro',
  templateUrl: './grupo-maestro.page.html',
  styleUrls: ['./grupo-maestro.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class GrupoMaestroPage implements OnInit {

  grupo: any;
  grupoId!: number;
  enrolledStudents: any[] = [];
  
  constructor(private grupoMaestroService: GrupoMaestroService, private alertController: AlertController, private route: ActivatedRoute, private router: Router, private cdr: ChangeDetectorRef, private navCtrl: NavController) { }

  // AGM 31/01/2024 - Redireccionamiento a perfil, cierre de sesion o dashboard
  redirectToProfile() {
    this.router.navigateByUrl('/perfil');
  }
  
  redirectToLogin() {
    this.router.navigateByUrl('/login');
  }

  goBack() {
    this.navCtrl.back();
  }

  // AGM 31/01/2024 - Declaración de variables bandera para cerrar o abrir los modal
  isModalOpen = false;
  isSecondModalOpen = false;
  isThirdModalOpen = false;
  isFourthModalOpen = false;
  isFifthModalOpen = false;
  isSixthModalOpen = false;
  isSeventhModalOpen = false;

  // AGM 31/01/2024 - Abrir o cerrar los modals
  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  setSecondOpen(isOpen: boolean) {
    this.isSecondModalOpen = isOpen;
  }

  setThirdOpen(isOpen: boolean) {
    this.isThirdModalOpen = isOpen;
  }

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
  
  // AGM 31/01/2024 - Botones de las alertas de modificaciones
  async showConfirmAlert() {
    const alert = await this.alertController.create({
      header: '¿Está seguro de realizar las modificaciones?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Modificación cancelada.');
          }
        },
        {
          text: 'Sí',
          handler: () => {
            console.log('Procediendo con la modificación del grupo.');
            this.updateGroup();
          }
        }
      ]
    });

    await alert.present();
  }

  updateGroup() {
    this.grupoMaestroService.updateGroup(this.grupo.id, this.grupo.nombre, this.grupo.descripcion)
      .subscribe({
        next: async (data) => {
          console.log('Group updated successfully:', data);
          this.setSecondOpen(false);
          const alert = await this.alertController.create({
            header: 'Cambios realizados',
            message: 'Los cambios se han efectuado en el grupo. Actualizando información...',
            buttons: [{
              text: 'Aceptar',
              handler: () => {
                this.refreshGroupData(); // Llama a una función para refrescar los datos del grupo
              }
            }]
          });
          await alert.present();
        },
        error: async (error) => {
          console.error('Error updating group:', error);
          const alert = await this.alertController.create({
            header: 'Error',
            message: 'Error al actualizar el grupo.',
            buttons: ['OK']
          });
          await alert.present();
        }
      });
  }
  
  refreshGroupData() {
    console.log(this.grupo.id);
    this.loadGroupData(this.grupo.id);
  }
    
  // AGM 31/01/2024 - Botones de la alerta de eliminación del grupo
  async confirmGroupDeletion(groupId: string) {
    const alert = await this.alertController.create({
      header: '¿Está seguro de eliminar el grupo?',
      message: 'Una vez eliminado, no se puede volver a recuperar.',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Eliminación cancelada');
          }
        },
        {
          text: 'Sí',
          handler: () => {
            this.deleteGroup(groupId);
          }
        }
      ]
    });
  
    await alert.present();
  }

  // AGM 12/02/2024 - Petición DELETE del grupo
  deleteGroup(groupId: string) {
    this.grupoMaestroService.deleteGroup(groupId)
      .subscribe({
        next: async (data) => {
          console.log('Group deleted successfully:', data);
          await this.presentGroupDeletedAlert();
        },
        error: async (error) => {
          console.error('Error al eliminar el grupo:', error);
          const alert = await this.alertController.create({
            header: 'Error',
            message: 'Ha ocurrido un error al intentar eliminar el grupo.',
            buttons: ['OK']
          });
          await alert.present();
        }
      });
  }

  // AGM 31/01/2024 - BUG a solucionar - Hay un bug con los menus cuando se redirecciona (no estoy seguro del porque)
  async presentGroupDeletedAlert() {
    const alert = await this.alertController.create({
      header: 'Se ha eliminado el grupo',
      message: 'Usted será redireccionado al dashboard.',
      buttons: [{
        text: 'Aceptar',
        handler: () => {
          this.router.navigateByUrl('/dashboard-maestro', {skipLocationChange: true}).then(()=>
          this.router.navigate(['/dashboard-maestro', { timestamp: Date.now() }]));
        }
      }]
    });

    await alert.present();
  }

  // AGM 16/02/2024 - Confirmar la eliminacion de un estudiante
  async confirmStudentDeletion(studentId: number) {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Está seguro de que desea eliminar al alumno del grupo? Esta acción no se puede deshacer',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancelación de eliminación');
          }
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.deleteStudentFromGroup(studentId);
          }
        }
      ]
    });

    await alert.present();
  }

  // AGM 17/02/2024 - Método que realiza la llamada al servicio para eliminar al alumno
  deleteStudentFromGroup(studentId: number) {
    if (this.grupo && this.grupo.id) {
      this.grupoMaestroService.removeStudentFromGroup(studentId, this.grupo.id).subscribe({
        next: async (response) => {
          console.log('El alumno ha sido eliminado:', response);
          const successAlert = await this.alertController.create({
            header: 'Operación exitosa',
            message: 'El alumno ha sido eliminado del grupo.',
            buttons: ['OK']
          });
          await successAlert.present();
          this.getEnrolledStudents(this.grupo.id);
          this.setFourthOpen(false);
        },
        error: async (error) => {
          const errorMsg = error.error?.message || 'Se produjo un error al eliminar al alumno.';
          console.error('Error:', errorMsg);
          const errorAlert = await this.alertController.create({
            header: 'ERROR',
            message: errorMsg,
            buttons: ['OK']
          });
          await errorAlert.present();
        }
      });
    } else {
      console.error('No se ha proporcionado el ID del grupo.');
    }
  }

  // AGM 15/02/2024 - Obtener los alumnos inscritos en el grupo
  getEnrolledStudents(grupoId: number) {
    this.grupoMaestroService.getEnrolledStudents(grupoId).subscribe({
      next: (response) => {
        // Asegúrate de asignar el array de estudiantes a la propiedad
        this.enrolledStudents = response.estudiantes;
        console.log('Alumnos inscritos:', this.enrolledStudents);
      },
      error: (error) => {
        console.error('Error al obtener los alumnos inscritos:', error);
      }
    });
  }

  // AGM 16/02/2024 - Cargar los datos del grupo (Parte del inicio de página)
  loadGroupData(groupId: number) {
    this.grupoMaestroService.getGroup(groupId).subscribe({
      next: (data) => {
        if (!data.error && data.grupo) {
          this.grupo = data.grupo;
          console.log('Datos del grupo:', this.grupo);
        } else {
          console.error('Error al obtener los detalles del grupo o grupo no encontrado');
        }
      },
      error: (error) => {
        console.error('Error al obtener los detalles del grupo:', error);
      }
    });
  }  
  
  // AGM 11/02/2024 Lógica al iniciar la página
  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      const state = navigation.extras.state as { [key: string]: any }; 
      if ('grupoId' in state) {
        this.grupoId = state['grupoId']; 
        console.log('Grupo-maestro: grupoId:', this.grupoId);
        this.loadGroupData(this.grupoId);
        this.getEnrolledStudents(this.grupoId);
      } else {
        console.error('grupoId no está presente en el estado de navegación.');
      }
    } else {
      console.error('No se han pasado datos de estado de navegación.');
    }
  }  
}