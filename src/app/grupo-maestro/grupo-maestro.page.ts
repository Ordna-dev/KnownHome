import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef, NgZone } from '@angular/core';

@Component({
  selector: 'app-grupo-maestro',
  templateUrl: './grupo-maestro.page.html',
  styleUrls: ['./grupo-maestro.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class GrupoMaestroPage implements OnInit {

  constructor(private ngZone: NgZone, private alertController: AlertController, private router: Router, private route: ActivatedRoute, private cdr: ChangeDetectorRef, private navCtrl: NavController) { }

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
    let formData = new FormData();
    formData.append('nombre', this.grupo.nombre);
    formData.append('descripcion', this.grupo.descripcion);
  
    fetch(`http://localhost:5000/maestro/update-group/${this.grupo.id}`, {
        method: 'PUT',
        body: formData,
        credentials: 'include',
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => Promise.reject(data));
        }
        return response.json();
    })
    .then(async data => {
        console.log('Group updated successfully:', data);
        this.setSecondOpen(false); 
        
        const alert = await this.alertController.create({
            header: 'Cambios realizados',
            message: 'Los cambios se han efectuado en el grupo. Se le va a redirigir al dashboard',
            buttons: [{
                text: 'Aceptar',
                handler: () => {
                    this.router.navigateByUrl('/dashboard-maestro', {skipLocationChange: true}).then(()=>
                    this.router.navigate(['/dashboard-maestro', { timestamp: Date.now() }]));
                }
            }]
        });
  
        await alert.present();
    })
    .catch(async error => {
        console.error('Error updating group:', error);
        // Aquí cambiamos para mostrar el mensaje de error como una alerta
        const alert = await this.alertController.create({
            header: 'Error',
            message: error.mensaje || 'Error al actualizar el grupo.',
            buttons: ['OK']
        });
  
        await alert.present();
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
  async deleteGroup(groupId: string) {
    fetch(`http://localhost:5000/maestro/delete-group/${groupId}`, {
      method: 'DELETE',
      credentials: 'include'
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(async data => {
      console.log(data);
      await this.presentGroupDeletedAlert();
    })
    .catch(error => {
      console.error('Error al eliminar el grupo:', error);
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
  students: any[] = [];

  getEnrolledStudents(grupoId: number) {
    fetch(`http://localhost:5000/grupo-alumno/${grupoId}/enrolled-students`, {
      method: 'GET',
      credentials: 'include' // Asumiendo que tu API requiere autenticación
    })
    .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Datos de los estudiantes inscritos:', data);
      this.ngZone.run(() => { // Execute within Angular's zone
        this.students = data.students;
      });
    })
    .catch(error => {
      console.error('Error al obtener los alumnos inscritos:', error);
    });
  }

  // AGM 11/02/2024 Lógica al iniciar la página
  grupo: any = null;

  ngOnInit() {
    const currentNavigation = this.router.getCurrentNavigation();
    this.grupo = currentNavigation?.extras.state ? currentNavigation.extras.state['grupo'] : null;
  
    if (this.grupo) {
        console.log('Datos del grupo:', this.grupo);
        // Una vez confirmado que tenemos los datos del grupo, hacemos el fetch de los alumnos
        this.getEnrolledStudents(this.grupo.id); // Asumiendo que el ID está en grupo.id
    } else {
        console.error('No se pasaron datos del grupo.');
    }
  }
}
