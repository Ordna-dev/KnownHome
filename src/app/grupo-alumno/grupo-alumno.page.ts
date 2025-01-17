import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadingController, ModalController, NavController, ActionSheetController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular/standalone';
import { GrupoAlumnoService } from '../services/grupo-alumno.service';
import { DashboardAlumnoService } from '../services/dashboard-alumno.service';
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
  IonButton,
  IonSearchbar,
  IonCardContent,
  IonButtons,
  IonLoading,
  IonMenuButton
} from '@ionic/angular/standalone';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { DomSanitizer } from '@angular/platform-browser';
import { GalleryComponent } from '../componentes/gallery/gallery.component';

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
    IonButton,
    IonSearchbar,
    IonCardContent,
    IonButtons,
    IonLoading,
    IonMenuButton
  ],  
  providers: [ModalController],
})

export class GrupoAlumnoPage implements OnInit {
  grupoId!: number;
  grupo: any;
  students: any[] = []; 
  studentsModal: any[] = [];
  imageSource: any;
  
  // AGM 31/01/2024 - Estado de los modals de la visualizacion de alumnos, visualización de fotografías del profesor y autorizadas del alumno y visualizacion de imagen 
  isFourthModalOpen = false; 
  isSeventhModalOpen = false;
  isStudentGroupOptionsModalOpen = false;

  // AGM 31/01/2024
  constructor(
    private grupoAlumnoService: GrupoAlumnoService,
    private dashboardAlumnoService: DashboardAlumnoService, 
    private route: ActivatedRoute,
    private router: Router, 
    private navCtrl: NavController,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private domSanitizer: DomSanitizer,
    private modalCtrl: ModalController,
    private actionSheetController: ActionSheetController,
  ) { }

  // AGM 31/01/2024 - Volver a la pagina anterior
  goBack() {
    this.router.navigateByUrl('/dashboard-alumno', {skipLocationChange: true}).then(()=>
    this.router.navigate(['/dashboard-alumno', { timestamp: Date.now() }]));
  }

  // AGM 31/01/2024 - Cerrar sesión y redirigir a la página de inicio de sesión
  redirectToLogin() {
    this.setStudentGroupOptionsModalOpen(false);
    this.loadingController.create({
      message: 'Cerrando sesión...'
    }).then(loading => {
      loading.present(); 
  
      this.dashboardAlumnoService.logOut().subscribe({
        next: (html) => {
          console.log(html);
          loading.dismiss();
          this.router.navigateByUrl('/login-alumno', {skipLocationChange: true}).then(() =>
            this.router.navigate(['/login-alumno', { timestamp: Date.now() }])
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

  // AGM 19/02/2024 - Refrescar pagina
  handleRefresh() {
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }

  setFourthOpen(isOpen: boolean) {
    this.isFourthModalOpen = isOpen;
  }

  setStudentGroupOptionsModalOpen(isOpen: boolean) {
    this.isStudentGroupOptionsModalOpen = isOpen;
  }
  
  //Función para obtener las fotos del profesor y crear el modal de galeria para mostrar dichas fotos
  async showTeacherGallery(teacherId:number) {
    this.grupoAlumnoService.getTeacherPhotos(this.grupoId, teacherId).subscribe({
      next: async(response) => {
        if (response.error == false){
          const modal = await this.modalCtrl.create({
            component: GalleryComponent,
            componentProps:{
              images: response.images,
              grupoId: this.grupoId,
              teacherLogged: false,
              teacherImgs: true
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
          header: 'Error:',
          message: 'No se pudieron mostrar las imagenes del profesor debido a problemas de conexión. Por favor intente de nuevo o reinicie la aplicación.',
          buttons: ['Aceptar']   
        });
        await errorAlert.present();
      }
    });
  }
  //Función para obtener las fotos de x estudiante y crear el modal de galeria para mostrar dichas fotos
  async showStudentGallery(studentId: number) {
    this.grupoAlumnoService.getStudentPhotos(this.grupoId, studentId).subscribe({
      next: async(response) => {
        if (response.error == false){
          console.log(response)
          const modal = await this.modalCtrl.create({
            component: GalleryComponent,
            componentProps:{
              images: response.images,
              grupoId: this.grupoId,
              teacherLogged: false,
              teacherImgs: false
            }
          });
          return await modal.present();
        }else{
          const errorAlert = await this.alertController.create({
            header: 'Error',
            message: response.message,
            buttons: ['Aceptar']   
          });
          await errorAlert.present();
        }
      },error: async(error) => {
        const errorAlert = await this.alertController.create({
          header: 'Error',
          message: 'No se pudieron mostrar las imagenes del alumno debido a problemas de conexión. Por favor intente de nuevo o reinicie la aplicación.',
          buttons: ['Aceptar']
        });
        await errorAlert.present();
      }
    });
    
  }
  
  // AGM 17/02/2024 - Obtener el grupo para el alumno
  getGroup() {
    if (this.grupoId) {
      this.grupoAlumnoService.getGroup(this.grupoId).subscribe({
        next: (response) => {
          if (!response.error && response.grupo && response.grupo.length > 0) {
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

  getEnrolledStudentsModal() {
    if (this.grupoId) {
      this.grupoAlumnoService.getEnrolledStudents(this.grupoId).subscribe({
        next: (response) => {
          this.studentsModal = response.estudiantes || []; 
        },
        error: (error) => {
          console.error('Error al obtener los alumnos inscritos:', error);
        }
      });
    }
  }

  handleSearchInput(event: CustomEvent) {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    if (query && query.trim() !== '') {
      this.grupoAlumnoService.searchStudents(this.grupoId, query).subscribe({
        next: (response) => {
          if (!response.error) {
            this.students = response.estudiantes || [];
            console.log('Resultados de búsqueda:', this.students);
          } else {
            this.students = [];
            console.error(response.mensaje || 'No se encontraron alumnos.');
          }
        },
        error: (error) => {
          console.error('Error al buscar alumnos:', error);
        }
      });
    } else {
      this.getEnrolledStudents();
    }
  }

  handleModalSearchInput(event: CustomEvent) {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    if (query && query.trim() !== '') {
      this.grupoAlumnoService.searchStudents(this.grupoId, query).subscribe({
        next: (response) => {
          if (!response.error) {
            this.studentsModal = response.estudiantes || [];
            console.log('Resultados de búsqueda:', this.students);
          } else {
            this.studentsModal = [];
            console.error(response.mensaje || 'No se encontraron alumnos.');
          }
        },
        error: (error) => {
          console.error('Error al buscar alumnos:', error);
        }
      });
    } else {
      this.getEnrolledStudentsModal();
    }
  }

  // AGM 17/02/2024 - Salir del grupo (alumno)
  async leaveGroup() {
    if (this.grupoId) {
      const alert = await this.alertController.create({
        header: 'Confirmar salida:',
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
      const alert = await this.alertController.create({
        header: 'Error al salir del grupo:',
        message: 'Error de conexión. Intenta de nuevo o reinicia la aplicación.',
        buttons: [
          {
            text: 'Aceptar',
            handler: (blah) => {
              console.log('Acción de salir cancelada');
            }
          }
        ]
      });
    }
  }

  private confirmLeaveGroup() {
    this.setStudentGroupOptionsModalOpen(false);  

    this.loadingController.create({
      message: 'Saliendo del grupo...'
    }).then(loading => {
      loading.present();
  
      this.grupoAlumnoService.leaveGroup(this.grupoId).subscribe({
        next: async (response) => {
          console.log(response.message);
          // Ocultar el recuadro de carga antes de mostrar la alerta
          loading.dismiss();
  
          const redirectToDashboard = () => {
            this.router.navigateByUrl('/dashboard-alumno', {skipLocationChange: true}).then(()=>
            this.router.navigate(['/dashboard-alumno', { timestamp: Date.now() }]));
          };
  
          const alert = await this.alertController.create({
            header: 'Salida del grupo:',
            message: 'Has salido del grupo. Vas a ser redirigido a la pantalla principal.',
            buttons: [{
              text: 'Aceptar',
              handler: () => redirectToDashboard()
            }],
            backdropDismiss: false 
          });
  
          alert.onDidDismiss().then((detail) => {
            if (detail.role === 'backdrop' || detail.role === 'cancel') {
              redirectToDashboard();
            }
          });
  
          await alert.present();
        },
        error: async (error) => {
          console.error('Error al salir del grupo:', error);
          // Ocultar el recuadro de carga en caso de error
          loading.dismiss();
          const errorAlert = await this.alertController.create({
            header: 'Error al salir del grupo:',
            message: 'Error de conexión. Intenta de nuevo o reinicia la aplicación.',
            buttons: ['Aceptar']
          });
          await errorAlert.present();
        }
      });
    });
  }

  // AGM 22/02/2024 - Lógica para tomar una foto en la app 
  async takePicture(groupId: number) {
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

    if (image.webPath) {
      // Convertir la imagen a un Blob, luego a un File
      const response = await fetch(image.webPath);
      const blob = await response.blob();
      const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });

      // Utilizar el servicio para subir la foto
      this.grupoAlumnoService.uploadPhoto(groupId, file).subscribe(
        async (response) => {
          loading.dismiss();
          if (response.error == false){
            const alert = await this.alertController.create({
              header: 'Fotografía subida:',
              message: 'La fotografía ha sido subida exitosamente, espera a que el profesor la valide para su visualización.',
              buttons: [{
                text: 'Aceptar',
              }],
              backdropDismiss: true 
            });
            await alert.present();
          } else {
            const alert = await this.alertController.create({
              header: 'Error, fotografía no subida:',
              message: 'Error al subir la fotografía, por favor vuelva a intentar o reinicie la aplicación',
              buttons: [{
                text: 'Aceptar',
              }],
              backdropDismiss: true
            });
            await alert.present();
            console.log(response.message);
          }
        },
        async (error) => {
          loading.dismiss(); 
          console.error('Error subiendo la foto', error);
          const errorAlert = await this.alertController.create({
            header: 'Error, fotografía no subida:',
            message: 'Se ha producido un error de conexión. Por favor, verifica tu conexión a internet o reinicie la aplicación.',
            buttons: ['Aceptar']
          });
          await errorAlert.present();
        }
      );
    }
  }

  // AGM 01/07/2024 - Reload de la pagina actualizado
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
        loading.present(); 
        Promise.all([
            this.grupoAlumnoService.getEnrolledStudents(this.grupoId).toPromise(),
            this.grupoAlumnoService.getEnrolledStudents(this.grupoId).toPromise(),
            this.grupoAlumnoService.getGroup(this.grupoId).toPromise()
        ]).then(([studentsModalResponse, studentsResponse, groupResponse]) => {
            this.studentsModal = studentsModalResponse.estudiantes || [];

            this.students = studentsResponse.estudiantes || [];
            console.log('Alumnos inscritos:', this.students);

            if (!groupResponse.error && groupResponse.grupo && groupResponse.grupo.length > 0) {
                this.grupo = groupResponse.grupo[0];
            } else {
                console.error('La estructura de la respuesta del servidor no es la esperada.');
            }
            
            loading.dismiss(); 
        }).catch(error => {
            console.error('Error al obtener la información:', error);
            loading.dismiss(); 
            this.presentNetworkErrorAlert(); 
        });
    });
  }

  async presentNetworkErrorAlert() {
      const alert = await this.alertController.create({
          header: 'Error de conexión',
          message: 'Error de conexión al actualizar la información del grupo. Por favor, intente de nuevo o reinicie la aplicación.',
          buttons: ['Aceptar']
      });
      await alert.present();
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
        this.getEnrolledStudentsModal();
      } else {
        console.error('grupoId no está presente en el estado de navegación.');
      }
    } else {
      console.error('No se han pasado datos de estado de navegación.');
    }
  }
}