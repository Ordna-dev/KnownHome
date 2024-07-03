import { Component, OnInit, NgZone } from '@angular/core';
import { NavController, AlertController, ModalController, LoadingController, ActionSheetController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GrupoMaestroService } from '../services/grupo-maestro.service';
import { DashboardMaestroService } from '../services/dashboard-maestro.service'; 
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
  IonSearchbar,
  IonMenuButton,
  IonButtons,
  IonLoading,
  IonBadge
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
    IonSearchbar,
    IonMenuButton,
    IonButtons,
    IonLoading,
    IonBadge
  ],
  providers: [ModalController],
})
export class GrupoMaestroPage implements OnInit {
  group: any;
  tempNombre: string = '';
  tempDescripcion: string = '';
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
    private ngZone: NgZone,
    private dashboardMaestroService: DashboardMaestroService,
    private actionSheetController: ActionSheetController,
  ) { }

  // AGM 31/01/2024 - Redireccionamiento a perfil, cierre de sesion o dashboard
  async redirectToProfile() {
    this.setGroupOptionsModalOpen(false);  // Cierra cualquier modal abierto antes de proceder
  
    const loading = await this.loadingController.create({
      message: 'Cargando perfil...',
      duration: 2000  // Esta duración garantiza que el recuadro se muestre por 2 segundos
    });
  
    await loading.present(); // Muestra el recuadro de carga
  
    setTimeout(() => {
      loading.dismiss();  // Cierra el recuadro de carga
      this.router.navigateByUrl('/perfil', {skipLocationChange: true}).then(() =>
        this.router.navigate(['/perfil', { timestamp: Date.now() }]));
    }, 2000); // Asegura que el recuadro de carga se muestra durante al menos 2 segundos antes de proceder
  }
  
  redirectToLogin() {
    this.setGroupOptionsModalOpen(false);

    this.loadingController.create({
      message: 'Cerrando sesión...'
    }).then(loading => {
      loading.present(); 
  
      this.dashboardMaestroService.logOutService().subscribe({
        next: (html) => {
          console.log(html);
          loading.dismiss();
          this.router.navigateByUrl('/login', {skipLocationChange: true}).then(() =>
            this.router.navigate(['/login', { timestamp: Date.now() }])
          );
        },
        error: async (error) => {
          console.error('Error al cerrar sesión:', error);
          loading.dismiss(); 
          const alert = await this.alertController.create({
            header: 'Error al cerrar sesión:',
            message: 'No se pudo cerrar sesión correctamente debido a problemas de conexión. Por favor, inténtalo de nuevo o reinicia la aplicación.',
            buttons: ['Aceptar'],
            backdropDismiss: false
          });
          await alert.present();
        }
      });
    });
  }

  goBack() {
    this.router.navigateByUrl('/dashboard-maestro', {skipLocationChange: true}).then(()=>
    this.router.navigate(['/dashboard-maestro', { timestamp: Date.now() }]));
  }

  // AGM 31/01/2024 - Declaración de variables bandera para cerrar o abrir los modal
  isModalOpen = false;
  isSecondModalOpen = false;
  isThirdModalOpen = false;
  isFourthModalOpen = false;
  isGroupOptionsModalOpen = false;

  // AGM 31/01/2024 - Abrir o cerrar los modals
  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  setSecondOpen(isOpen: boolean) {
    this.tempNombre = this.group.nombre;
    this.tempDescripcion = this.group.descripcion;
    this.errorMessage = '';
    this.isSecondModalOpen = isOpen;
  }

  setThirdOpen(isOpen: boolean) {
    this.isThirdModalOpen = isOpen;
  }

  setFourthOpen(isOpen: boolean) {
    this.isFourthModalOpen = isOpen;
  }

  setGroupOptionsModalOpen(isOpen: boolean) {
    this.isGroupOptionsModalOpen = isOpen;
  }


  //Función para obtener las fotos del profesor y crear el modal de galeria para mostrar dichas fotos
  async showTeacherGallery() {
    this.grupoMaestroService.getTeacherPhotos(this.grupoId).subscribe({
      next: async(response) => {
        if(response.error == false){
          // crear una instancia del modal galery
          console.log(response);
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
          console.log(response);
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
    this.loadingController.create({
        message: 'Actualizando grupo...'
    }).then(loading => {
        loading.present();

        this.grupoMaestroService.updateGroup(this.group.id, this.tempNombre, this.tempDescripcion)
            .subscribe({
                next: async (data) => {
                    console.log('Grupo actualizado con éxito:', JSON.stringify(data, null, 2));
                    loading.dismiss();

                    console.log("Aqui lo que se modifico:")
                    console.log(this.tempNombre);
                    console.log(this.tempDescripcion);
                    
                    const successAlert = await this.alertController.create({
                        header: 'Cambios realizados:',
                        message: 'Se ha actualizado la información del grupo.',
                        buttons: [{
                            text: 'Aceptar',
                            handler: () => {
                                this.ngZone.run(() => {
                                    this.setSecondOpen(false);
                                    this.refreshGroupData();
                                    this.errorMessage = '';
                                });
                            }
                        }],
                        backdropDismiss: false
                    });
                    await successAlert.present();
                },
                error: async (error) => {
                    console.error('Error al actualizar el grupo:', error);
                    loading.dismiss();
                    this.errorMessage = error.error.mensaje || 'Ha habido problemas de conexión. Verifica tu conexión a internet e inténtalo de nuevo o reinicia la aplicación.';
                    this.alertController.create({
                        header: 'Error al actualizar el grupo:',
                        message: this.errorMessage,
                        buttons: ['Aceptar'],
                        backdropDismiss: false
                    }).then(alert => alert.present());
                }
            });
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
    this.loadingController.create({
        message: 'Eliminando grupo...'
    }).then(loading => {
        loading.present(); // Mostrar el recuadro de carga

        this.grupoMaestroService.deleteGroup(groupId)
            .subscribe({
                next: async (data) => {
                    console.log('Group deleted successfully:', data);
                    loading.dismiss(); 
                    await this.presentGroupDeletedAlert();
                },
                error: async (error) => {
                    console.error('Error al eliminar el grupo:', error);
                    loading.dismiss(); 
                    const alert = await this.alertController.create({
                        header: 'Error:',
                        message: 'Ha ocurrido un error de conexión. Comprueba tu conexión a internet e inténtalo de nuevo o reinicia la aplicación.',
                        buttons: ['Aceptar']
                    });
                    await alert.present();
                }
            });
    });
  }

  // AGM 31/01/2024 - Se manda una alerta al maestro de que se eliminó el grupo
  async presentGroupDeletedAlert() {

    this.setGroupOptionsModalOpen(false);
    
    const redirectAction = () => {
      this.router.navigateByUrl('/dashboard-maestro', { skipLocationChange: true })
        .then(() => this.router.navigate(['/dashboard-maestro', { timestamp: Date.now() }]));
    };
  
    const alert = await this.alertController.create({
      header: 'Se ha eliminado el grupo.',
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
        this.loadingController.create({
            message: 'Eliminando alumno del grupo...'
        }).then(loading => {
            loading.present(); 

            this.grupoMaestroService.removeStudentFromGroup(studentId, this.group.id).subscribe({
                next: async (response) => {
                    console.log('El alumno ha sido eliminado:', response);
                    loading.dismiss(); 

                    const afterAlertActions = () => {
                      this.ngZone.run(() => {
                        this.getEnrolledStudents(this.group.id);
                        this.getEnrolledStudentsModal(this.group.id);
                      });
                    };

                    const successAlert = await this.alertController.create({
                        header: 'Operación exitosa:',
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
                    console.error('Error:', error);
                    loading.dismiss();

                    const errorMsg = error.error?.message || 'Error de conexión al expulsar al alumno, por favor vuelva a intentarlo o reinicie la aplicación.';
                    const errorAlert = await this.alertController.create({
                        header: 'Error:',
                        message: errorMsg,
                        buttons: ['Aceptar']
                    });
                    await errorAlert.present();
                }
            });
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
          console.log(response);
          if (response.error == false){
            loading.dismiss();

            const modal = await this.modalCtrl.create({
              component: EvaluatePhotoComponent,
              componentProps:{
                groupId: this.grupoId,
                image: response.imagen,
                objects: response.objetos
              }
            });
            
            return await modal.present()
          }else{
            loading.dismiss();
            const alert = await this.alertController.create({
              header: 'Fotografía no subida',
              message: response.message,
              buttons: [{
                text: 'Aceptar',
              }],
              backdropDismiss: true 
            });
            console.log(response.exception);
            await alert.present();
          }
        },
        async (error) => {
          loading.dismiss();
          const alert = await this.alertController.create({
            header: 'Fotografía no subida',
            message: 'Error de conexión al subir la fotografía, porfavor vuelva a intentarlo o reinicie la aplicación.',
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
  
  updatePage() {
    if (!this.grupoId) {
        console.error('No se ha proporcionado el ID del grupo.');
        this.presentNetworkErrorAlert();
        return;
    }

    this.loadingController.create({
        message: 'Actualizando información del grupo...',
        spinner: 'circles'
    }).then(loading => {
        loading.present(); // Mostrar el recuadro de carga

        Promise.all([
            this.grupoMaestroService.getGroup(this.grupoId).toPromise(),
            this.grupoMaestroService.getEnrolledStudents(this.grupoId).toPromise(),
            this.grupoMaestroService.getEnrolledStudentsModal(this.grupoId).toPromise()
        ]).then(([groupData, studentsData, modalStudentsData]) => {
            // Procesar la información del grupo
            if (!groupData.error && groupData.grupo) {
                this.group = groupData.grupo;
                console.log('Datos del grupo:', this.group);
            } else {
                console.error('Error al obtener los detalles del grupo o grupo no encontrado');
            }

            // Procesar los estudiantes inscritos
            this.enrolledStudents = studentsData.estudiantes || [];
            console.log('Alumnos inscritos:', this.enrolledStudents);

            // Procesar los estudiantes inscritos en el modal
            this.modalEnrolledStudents = modalStudentsData.estudiantes || [];
            console.log('Alumnos inscritos en el modal:', this.modalEnrolledStudents);

            loading.dismiss(); // Ocultar el recuadro de carga
        }).catch(error => {
            console.error('Error al obtener la información:', error);
            loading.dismiss(); // Ocultar el recuadro de carga
            this.presentNetworkErrorAlert();
        });
    });
  }

  async presentNetworkErrorAlert() {
      const alert = await this.alertController.create({
          header: 'Error de conexión:',
          message: 'Error de conexión al actualizar la información del grupo. Por favor, intente de nuevo o reinicie la aplicación.',
          buttons: ['Aceptar']
      });
      await alert.present();
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