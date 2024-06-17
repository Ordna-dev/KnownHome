import { Component, OnInit} from '@angular/core';
import { NavController, AlertController, ModalController, LoadingController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GrupoMaestroService } from '../services/grupo-maestro.service';
import {
  IonMenu,
  IonHeader,
  IonAvatar,
  IonContent,
  IonIcon,
  IonRefresher,
  IonRefresherContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonModal,
  IonToolbar,
  IonItem,
  IonInput,
  IonTextarea,
  IonButton,
  IonText,
  IonTitle,
  IonCardSubtitle,
  IonSearchbar
} from '@ionic/angular/standalone';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { DomSanitizer } from '@angular/platform-browser';
import { GalleryComponent } from '../componentes/gallery/gallery.component';
import { EvaluatePhotoComponent } from '../componentes/evaluate-photo/evaluate-photo.component';


@Component({
  selector: 'app-grupo-maestro',
  templateUrl: './grupo-maestro.page.html',
  styleUrls: ['./grupo-maestro.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonMenu,
    IonHeader,
    IonAvatar,
    IonContent,
    IonIcon,
    IonRefresher,
    IonRefresherContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonModal,
    IonToolbar,
    IonItem,
    IonInput,
    IonTextarea,
    IonButton,
    IonText,
    IonTitle,
    IonCardSubtitle,
    IonSearchbar
  ],
  providers: [ModalController],
})
export class GrupoMaestroPage implements OnInit {
  group: any;
  grupoId!: number;
  errorMessage: string = '';
  enrolledStudents: any[] = [];
  modalEnrolledStudents: any[] = [];
  imageSource: any;
  
  constructor(
    private modalCtrl : ModalController,
    private grupoMaestroService: GrupoMaestroService, 
    private alertController: AlertController,
    private loadingController: LoadingController,
    private router: Router, 
    private navCtrl: NavController,
    ) { }

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
  isFourthModalOpen = false;;

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

  //Función para obtener las fotos del profesor y crear el modal de galeria para mostrar dichas fotos
  async showTeacherGallery() {
    this.grupoMaestroService.getTeacherPhotos(this.grupoId).subscribe({
      next: async(response) => {
        if(response.error == false){
          // crear una instancia del modal galery
          const modal = await this.modalCtrl.create({
            component: GalleryComponent,
            componentProps:{
              images: response.images,
              grupoId: this.grupoId,
              teacherLogged: true,
              teacherImgs: true,
            }
          });
          // Mostrar el modal
          return await modal.present();
        }else{
          const errorAlert = await this.alertController.create({
            header: 'Error',
            message: response.message,
            buttons: ['Aceptar']   
          });
          await errorAlert.present();
        }
      }, error: async(error) => {
        const errorAlert = await this.alertController.create({
          header: 'Error',
          message: 'No se pudieron mostrar las imagenes del profesor. Por favor intente de nuevo',
          buttons: ['Aceptar']   
        });
        await errorAlert.present();
      }
    });
  }

  async showStudentGallery(studentId:number) {
    this.grupoMaestroService.getStudentPhotos(this.grupoId, studentId).subscribe({
      next: async(response) => {
        if(response.error == false){
          //Crear una instancia del modal galery
          const modal = await this.modalCtrl.create({
            component: GalleryComponent,
            componentProps: {
              images: response.images,
              grupoId: this.grupoId,
              teacherLogged: true, 
              teacherImgs: false,
              studentId: studentId
            }
          });
          //Mostrar el modal
          return await modal.present();
        }else{
          const errorAlert = await this.alertController.create({
            header: 'Error',
            message: response.message,
            buttons: ['Aceptar']   
          });
          await errorAlert.present();
        }
      }, error: async(error) => {
        const errorAlert = await this.alertController.create({
          header: 'Error',
          message: 'No se puedieron mostrar las imagenes del alumno. Porfavor intente de nuevo',
          buttons: ['Aceptar']
        });
        await errorAlert.present();
      }
    });
  }

  // AGM 19/02/2024 - Refrescar pagina
  handleRefresh() {
    setTimeout(() => {
      window.location.reload();
    }, 2000);
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
    this.grupoMaestroService.updateGroup(this.group.id, this.group.nombre, this.group.descripcion)
      .subscribe({
        next: async (data) => {
          console.log('Grupo actualizado con éxito:', JSON.stringify(data, null, 2));
          this.setSecondOpen(false);
          this.errorMessage = '';
  
          const afterAlertActions = () => {
            this.refreshGroupData();
          };
  
          const alert = await this.alertController.create({
            header: 'Cambios realizados',
            message: 'Los cambios se han efectuado en el grupo. Se ha actualizado la información.',
            buttons: [{
              text: 'Aceptar',
              handler: () => afterAlertActions()
            }],
            backdropDismiss: true
          });
  
          alert.onDidDismiss().then((detail) => {
            if (detail.role === 'backdrop' || detail.role === 'cancel') {
              afterAlertActions();
            }
          });
  
          await alert.present();
        },
        error: async (error) => {
          if (error && error.error && error.error.mensaje) {
            console.error('Error al actualizar el grupo:', error.error.mensaje);
            this.errorMessage = error.error.mensaje;
          } else {
            console.error('Error al actualizar el grupo:', error);
          }
        }
      });
  }  

  // AGM 15/02/2024 - Refrescar los datos del grupo si ha sido modificado
  refreshGroupData() {
    console.log(this.group.id);
    this.loadGroupData(this.group.id);
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

  // AGM 31/01/2024 - Se manda una alerta al maestro de que se eliminó el grupo
  async presentGroupDeletedAlert() {
    const redirectAction = () => {
      this.router.navigateByUrl('/dashboard-maestro', { skipLocationChange: true })
        .then(() => this.router.navigate(['/dashboard-maestro', { timestamp: Date.now() }]));
    };
  
    const alert = await this.alertController.create({
      header: 'Se ha eliminado el grupo',
      message: 'Usted será redireccionado al dashboard.',
      buttons: [{
        text: 'Aceptar',
        handler: () => redirectAction()
      }],
      backdropDismiss: false
    });
  
    alert.onDidDismiss().then((detail) => {
      if (detail.role === 'backdrop' || detail.role === 'cancel') {
        redirectAction();
      }
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
    if (this.group && this.group.id) {
      this.grupoMaestroService.removeStudentFromGroup(studentId, this.group.id).subscribe({
        next: async (response) => {
          console.log('El alumno ha sido eliminado:', response);

          const afterAlertActions = () => {
            this.getEnrolledStudents(this.group.id);
            this.getEnrolledStudentsModal(this.grupoId);
          };

          const successAlert = await this.alertController.create({
            header: 'Operación exitosa',
            message: 'El alumno ha sido eliminado del grupo.',
            buttons: [{
              text: 'OK',
              handler: () => afterAlertActions()
            }],
            backdropDismiss: false
          });

          successAlert.onDidDismiss().then((detail) => {
            if (detail.role === 'backdrop' || detail.role === 'cancel') {
              afterAlertActions();
            }
          });

          await successAlert.present();
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
  getEnrolledStudents(groupId: number) {
    this.grupoMaestroService.getEnrolledStudents(groupId).subscribe({
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

  getEnrolledStudentsModal(groupId: number) {
    this.grupoMaestroService.getEnrolledStudentsModal(groupId).subscribe({
      next: (response) => {
        this.modalEnrolledStudents = response.estudiantes;
        console.log('Alumnos inscritos en el modal:', this.modalEnrolledStudents);
      },
      error: (error) => {
        console.error('Error al obtener los alumnos inscritos en el modal:', error);
      }
    });
  }

  // AGM 16/02/2024 - Cargar los datos del grupo (Parte del inicio de página)
  loadGroupData(groupId: number) {
    this.grupoMaestroService.getGroup(groupId).subscribe({
      next: (data) => {
        if (!data.error && data.grupo) {
          this.group = data.grupo;
          console.log('Datos del grupo:', this.group);
        } else {
          console.error('Error al obtener los detalles del grupo o grupo no encontrado');
        }
      },
      error: (error) => {
        console.error('Error al obtener los detalles del grupo:', error);
      }
    });
  }  

  // AGM 22/02/2024 - Lógica para tomar una foto en la app 
  takePicture = async (groupId: number) => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Prompt,
      saveToGallery: true
    });

    const loading = await this.loadingController.create({
      message: 'Subiendo fotografía',
      duration: 100000,
    });

    loading.present();

    if(image.webPath){
      //Convertir la imagen a un Blob, luego a un File
      const response = await fetch(image.webPath);
      const blob = await response.blob();
      const file = new File([blob], 'photo.jpg', {type:'image/jpeg'});

      //Utilizar el servicio para subir la foto
      this.grupoMaestroService.uploadPhoto(groupId, file).subscribe(
        async (response) => {
          if (response.error == false){
            loading.dismiss();
            //Generar una instancia del modal para evaluar la foto tomada
            const modal = await this.modalCtrl.create({
              component: EvaluatePhotoComponent,
              componentProps:{
                groupId: this.grupoId,
                image: response.imagen,
                objects: response.objetos
              }
            });
            //Mostrar el modal
            return await modal.present()
          }else{
            loading.dismiss();
            const alert = await this.alertController.create({
              header: 'Fotografía no subida',
              message: response.message,
              buttons: [{
                text: 'Aceptar',
              }],
              backdropDismiss: true // Permite cerrar la alerta tocando fuera
            });
            console.log(response.exception);
            await alert.present();
          }
        },
        async (error) => {
          loading.dismiss();
          const alert = await this.alertController.create({
            header: 'Fotografía no subida',
            message: 'Error al subir la foto, porfavor vuelva a intentar',
            buttons: [{
              text: 'Aceptar',
            }],
            backdropDismiss: true // Permite cerrar la alerta tocando fuera
          });
          await alert.present();
        }
      );
    }

  }

  handleSearchInput(event: CustomEvent) {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    if (query && query.trim() !== '') {
      this.grupoMaestroService.searchEnrolledStudents(this.grupoId, query).subscribe({
        next: (response) => {
          if (!response.error) {
            this.enrolledStudents = response.estudiantes;
          } else {
            this.enrolledStudents = [];
            console.error(response.mensaje || 'No se encontraron alumnos.');
          }
        },
        error: (error) => {
          console.error('Error al buscar alumnos:', error);
          this.enrolledStudents = [];
        }
      });
    } else {
      this.getEnrolledStudents(this.grupoId);
    }
  }

  handleModalSearchInput(event: CustomEvent) {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    if (query && query.trim() !== '') {
      this.grupoMaestroService.searchEnrolledStudents(this.grupoId, query).subscribe({
        next: (response) => {
          if (!response.error) {
            this.modalEnrolledStudents = response.estudiantes;
          } else {
            this.modalEnrolledStudents = [];
            console.error(response.mensaje || 'No se encontraron alumnos.');
          }
        },
        error: (error) => {
          console.error('Error al buscar alumnos en el modal:', error);
          this.modalEnrolledStudents = [];
        }
      });
    } else {
      this.getEnrolledStudentsModal(this.grupoId);
    }
  }

  // AGM 11/02/2024 Lógica al iniciar la página
  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      const state = navigation.extras.state as { [key: string]: any }; 
      if ('groupId' in state) {
        this.grupoId = state['groupId']; 
        console.log('Grupo-maestro: groupId:', this.grupoId);
        this.loadGroupData(this.grupoId);
        this.getEnrolledStudents(this.grupoId);
        this.getEnrolledStudentsModal(this.grupoId);
      } else {
        console.error('groupId no está presente en el estado de navegación.');
      }
    } else {
      console.error('No se han pasado datos de estado de navegación.');
    }
  }  
}