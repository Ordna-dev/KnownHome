import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalController } from '@ionic/angular';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonIcon } from '@ionic/angular/standalone';
import { GrupoAlumnoService } from '../../services/grupo-alumno.service';
import { PhotoDetailComponent } from '../photo-detail/photo-detail.component';
import { AlertController } from '@ionic/angular/standalone';
import { GrupoMaestroService } from '../../services/grupo-maestro.service';
import { EvaluatePhotoComponent } from '../evaluate-photo/evaluate-photo.component';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonIcon
  ],
  providers: [ModalController]
})

export class GalleryComponent{

  @Input() images:any[] | [] = [];
  @Input() grupoId: any;
  @Input() studentId: any;
  @Input() teacherLogged: any;
  @Input() teacherImgs: any;

  constructor(
    private modalCtrl: ModalController, 
    private grupoAlumnoService: GrupoAlumnoService,
    private grupoMaestroService: GrupoMaestroService,
    private alertController: AlertController
  ){}

  dismiss(){
    return this.modalCtrl.dismiss();
  }

  async confirmDeleteImage(photoId: number) {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Estas seguro de eliminar la imagen del alumno? Una vez borrada no se puede recuperar.',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Si',
          handler: () => {
            this.deleteImageFromStudent(photoId);
          }
        }
      ],
      backdropDismiss: true
    });
    await alert.present();
  }

  deleteImageFromStudent(photoId: number) {
    this.grupoMaestroService.deleteStudentPhoto(this.grupoId, this.studentId, photoId).subscribe({
      next: async (response) => {
        if (response.error == false) {
          const finalizeDeletion = () => {
            this.refreshModal();
          };
  
          const alert = await this.alertController.create({
            header: 'Eliminación exitosa',
            message: 'La imagen del alumno ha sido borrada permanentemente',
            buttons: [{
              text: 'Ok',
              handler: () => finalizeDeletion()
            }],
            backdropDismiss: true
          });
  
          alert.onDidDismiss().then((detail) => {
            if (detail.role === 'backdrop' || detail.role === 'cancel' || detail.role === 'confirm') {
              finalizeDeletion();
            }
          });
  
          await alert.present();
        } else {
          this.showAlert('Error', response.message, ['Aceptar']);
        }
      },
      error: async (error) => {
        let message = 'No se pudo eliminar la imagen. Por favor intente de nuevo';
        this.showAlert('Error', message, ['Aceptar']);
      }
    });
  }

  refreshModal() {
    this.grupoMaestroService.getStudentPhotos(this.grupoId, this.studentId).subscribe({
      next: (response) => {
        if (response.error == false) {
          this.images = response.images;
        }
      },
      error: (error) => {
        console.error('Error al refrescar las imágenes: ', error);
      }
    });
  }

  async confirmDeleteImageFromTeacher(photoId: number) {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Estás seguro de eliminar la imagen? Una vez borrada no se puede recuperar.',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Sí',
          handler: () => {
            this.deleteImageFromTeacher(photoId);
          }
        }
      ],
      backdropDismiss: true
    });
    await alert.present();
  }

  deleteImageFromTeacher(photoId: number) {
    this.grupoMaestroService.deleteTeacherPhoto(this.grupoId, photoId).subscribe({
      next: async (response) => {
        if (!response.error) {
          const finalizeDeletion = () => {
            this.refreshModalFromTeacher();
          };
  
          const alert = await this.alertController.create({
            header: 'Eliminación exitosa',
            message: 'La imagen ha sido borrada permanentemente',
            buttons: [{
              text: 'Ok',
              handler: () => finalizeDeletion()
            }],
            backdropDismiss: true
          });
  
          alert.onDidDismiss().then((detail) => {
            if (detail.role === 'backdrop' || detail.role === 'cancel' || detail.role === 'confirm') {
              finalizeDeletion();
            }
          });
  
          await alert.present();
        } else {
          this.showAlert('Error', response.message, ['Aceptar']);
        }
      },
      error: async (error) => {
        let message = 'No se pudo eliminar la imagen. Por favor intente de nuevo';
        this.showAlert('Error', message, ['Aceptar']);
      }
    });
  }

  refreshModalFromTeacher() {
    this.grupoMaestroService.getTeacherPhotos(this.grupoId).subscribe({
      next: (response) => {
        if (!response.error) {
          this.images = response.images;
        }
      },
      error: (error) => {
        console.error('Error al refrescar las imágenes: ', error);
      }
    });
  }

  async showAlert(header: string, message:string, buttons:any, backDropDismiss:boolean = true){
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: buttons,
      backdropDismiss: backDropDismiss
    });
    await alert.present();
  }

  //From the student view, show the detail for an image owned by x student or by x teacher. The parameter teacherImgs determine which one we want to consult
  async studentShowImageDetail(userId: number, photoId: number) {
    //Show the image detail owned by a teacher
    if (this.teacherImgs){
      this.grupoAlumnoService.getTeacherPhotoDetail(this.grupoId, userId, photoId).subscribe({
        next: async(response)=>{
          if (response.error == false){
            //Crear una instancia de photo-detail
            const modal = await this.modalCtrl.create({
              component: PhotoDetailComponent,
              componentProps:{
                image: response.image
              }
            });
            //Mostrar el modal
            return await modal.present()
          }else{
            this.showAlert('Error', response.message, ['Aceptar']);
          }
        }, error: async(error) => {
          let message = 'No se pudo mostrar el detalle de la imagen. Por favor intente de nuevo';
          this.showAlert('Error', message, ['Aceptar']);
        }
      });
      
    }else{ //Show the image detail owned by a student 
      
      this.grupoAlumnoService.getStudentPhotoDetail(this.grupoId, userId, photoId).subscribe({
        next: async(response)=>{
          if(response.error == false){
            //Crear una instancia de photo-detail
            const modal = await this.modalCtrl.create({
              component: PhotoDetailComponent,
              componentProps:{
                image: response.image
              }
            });
            //Mostrar el modal
            return await modal.present()
          }else{
            this.showAlert('Error', response.message, ['Aceptar']);
          }
        }, error: async(error) => {
          let message = 'No se pudo mostrar el detalle de la imagen. Por favor intente de nuevo';
          this.showAlert('Error', message, ['Aceptar']);
        }
      });
    }
  }

  //From the teacher view. Show the detail for an image owned by the teacher logged or by x student
  async teacherShowImageDetail(userId: number, photoId:number){
    if (this.teacherImgs){
      this.grupoMaestroService.getTeacherPhotoDetail(this.grupoId, photoId).subscribe({
        next: async(response)=>{
          if (response.error == false){
            //Crear una instancia del modal photo-detail
            const modal = await this.modalCtrl.create({
              component: PhotoDetailComponent,
              componentProps:{
                image: response.image
              }
            });
            //Mostrar el modal
            return await modal.present()
          }else{
            this.showAlert('Error', response.message, ['Aceptar']);
          }
        }, error: async(error) => {
          let message = 'No se pudo mostrar el detalle de la imagen. Por favor intente de nuevo';
          this.showAlert('Error', message, ['Aceptar']);
        }
      });
    }else{
      this.grupoMaestroService.getStudentPhotoDetail(this.grupoId, userId, photoId).subscribe({
        next: async(response) => {
          if (response.error == false){
            //Crear una instancia del modal photo-detail
            const modal = await this.modalCtrl.create({
              component: PhotoDetailComponent,
              componentProps:{
                image: response.image,
                teacher: true
              }
            });
            //Mostrar el modal
            return await modal.present();
          }else{
            this.showAlert('Error', response.message, ['Aceptar']);
          }
        }, error: async(error) => {
          let message = 'No se pudo mostrar el detalle de la imagen. Por favor intente de nuevo';
          this.showAlert('Error', message, ['Aceptar']);
        }
      });
    }
  }
  
  //From the teacher view, evaluate the object detected uploaded by a student
  async checkStudentImage(imageId: number){
    this.grupoMaestroService.getStudentPhotoEvaluate(this.grupoId, imageId).subscribe({
      next: async(response) => {
        if(response.error == false){
          //Generar una instancia del modal para evaluar la foto tomada
          const modal = await this.modalCtrl.create({
            
            component: EvaluatePhotoComponent,
            componentProps:{
              groupId: this.grupoId,
              image: response.imagen,
              objects: response.objetos
            }
          });
          await modal.present()
          if(await modal.onWillDismiss()){
            this.grupoMaestroService.getStudentPhotos(this.grupoId, this.studentId).subscribe({
              next:async(response) => {
                if(response.error == false){
                  this.images = response.images
                } 
              }
            })
          }
        }else{
          this.showAlert('Error', response.message, ['Aceptar']);
          console.log(response.exception);
        }
      }, error: async(error) => {
        let message = 'No se pudo mostrar el detalle de la imagen. Por favor intente de nuevo';
        this.showAlert('Error', message, ['Aceptar']);
      }
    });
  }

  //From the teacher view, evaluate the object detected uploaded by myself
  async checkTeacherImage(imageId: number){
    this.grupoMaestroService.getTeacherPhotoEvaluate(this.grupoId, imageId).subscribe({
      next: async(response) => {
        console.log(response)
        if(response.error == false){
          //Generar una instancia del modal para evaluar la foto tomada
          const modal = await this.modalCtrl.create({
            
            component: EvaluatePhotoComponent,
            componentProps:{
              groupId: this.grupoId,
              image: response.imagen,
              objects: response.objetos
            }
          });
          await modal.present()
          if(await modal.onWillDismiss()){
            this.grupoMaestroService.getTeacherPhotos(this.grupoId).subscribe({
              next:async(response) => {
                if(response.error == false){
                  this.images = response.images
                } 
              }
            })
          }
        }else{
          this.showAlert('Error', response.message, ['Aceptar']);
          console.log(response.exception);
        }
      }, error: async(error) => {
        let message = 'No se pudo mostrar el detalle de la imagen. Por favor intente de nuevo';
        this.showAlert('Error', message, ['Aceptar']);
      }
    });
  }

}