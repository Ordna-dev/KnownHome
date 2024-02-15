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
    // Aquí puedes llamar a una función para obtener los datos del grupo nuevamente
    // Por ejemplo, si tienes un método que recupera la información del grupo:
    console.log(this.grupo.id);
    this.getGroupInfo(this.grupo.id);
  }
  
  getGroupInfo(groupId: number) {
    // Tu lógica para recuperar los detalles del grupo
    // Después de obtener los datos, actualiza el objeto 'grupo' con los nuevos datos
    this.grupoMaestroService.getGroup(groupId).subscribe({
      next: (groupData) => {
        this.grupo = groupData;
        // Aquí deberías también refrescar los estudiantes si es necesario
        this.getEnrolledStudents(groupId);
      },
      error: (error) => {
        console.error('Error retrieving group data:', error);
      }
    });
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
  
  // AGM 31/01/2024 - Eliminación de alumno - Alerta de eliminación del alumno de un grupo
  public alertButtonsDeleteStudent = [
    {
      text: 'No',
      handler: () => {
        // Acción a realizar cuando se presione "No".
      }
    },
    {
      text: 'Sí',
      handler: () => {
        // Acción a realizar cuando se presione "Sí".
      }
    },
  ];

  // AGM 15/02/2024 - Obtener los alumnos inscritos en el grupo
  enrolledStudents: any[] = [];

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
  
  // AGM 11/02/2024 Lógica al iniciar la página
  grupo: any;

  ngOnInit() {
    /*const currentNavigation = this.router.getCurrentNavigation();
    this.grupo = currentNavigation?.extras.state ? currentNavigation.extras.state['grupo'] : null;
  
    if (this.grupo) {
        console.log('Datos del grupo:', this.grupo);
        // Una vez confirmado que tenemos los datos del grupo, hacemos el fetch de los alumnos
        this.getEnrolledStudents(this.grupo.id); // Asumiendo que el ID está en grupo.id
    } else {
        console.error('No se pasaron datos del grupo.');
    }*/
    
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      if ('grupo' in navigation.extras.state) {
        this.grupo = navigation.extras.state['grupo'];
        console.log('Datos del grupo:', this.grupo);
        // Una vez que tenemos el grupo, obtenemos los estudiantes inscritos
        this.getEnrolledStudents(this.grupo.id); // Asegúrate de que 'id' sea la propiedad correcta
      } else {
        console.error('La propiedad grupo no está presente en el estado.');
        // Manejar la falta de datos del grupo como sea necesario
      }
    } else {
      console.error('No se han pasado datos de estado.');
      // Manejar la falta de datos del estado como sea necesario
    }
  }
}