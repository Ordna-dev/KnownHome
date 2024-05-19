import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertController, ModalController } from '@ionic/angular';
import { GrupoMaestroService } from '../../services/grupo-maestro.service';
import { IonItem, IonList, IonRadioGroup, IonRadio, IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-evaluate-photo',
  templateUrl: './evaluate-photo.component.html',
  styleUrls: ['./evaluate-photo.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonIcon,
    IonRadio,
    IonRadioGroup,
    IonList,
    IonItem
  ],
  providers: [ModalController]
})

export class EvaluatePhotoComponent implements OnInit{
  @Input() groupId:any;
  @Input() image:any;
  @Input() objects:any[] | [] = [];

  selectedObject: number | null = null;

  constructor(
    private modalCtrl: ModalController,
    private grupoMaestroService: GrupoMaestroService,
    private alertController: AlertController
  ) {}

  dismiss(){
    return this.modalCtrl.dismiss();
  }

  updateObjectSelected(event: any){
    this.selectedObject = event.detail.value;
  }

  async showAlert(header: string, message: string, buttons:any, backDropDismiss:boolean = true){
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: buttons,
      backdropDismiss: backDropDismiss
    });
    await alert.present();
  }

  authorizeImage(groupId: number, imageId: number, authorized: boolean, clasification:boolean){
    let header: string, message: string, buttons: any [];
    this.grupoMaestroService.authorizeImage(groupId, imageId, authorized, clasification).subscribe({
      next: async(response) => {
        if(response.error == false){
          header = 'Proceso de autorización';
          message = 'Exito al autorizar la imagen';
          buttons =  ['Aceptar'];
          this.showAlert(header, message, buttons);
          this.dismiss();
        }else{
          header = 'Proceso de autorización';
          message = response.message;
          buttons =  ['Aceptar'];
          this.showAlert(header, message, buttons, false);
        }
      }, error: async(error) => {
        header = 'Proceso de autorización';
        message = 'No se pudo actualizar la imagen';
        buttons =  ['Aceptar'];
        this.showAlert(header, message, buttons, false);
      }
    });
  }

  updateImageObject(groupId: number, imageId: number, objectId: number | null){
    let header: string, message: string, buttons: any [];
    this.grupoMaestroService.updateImageObject(groupId, imageId, objectId).subscribe({
      next: async(response) => {
        if(response.error == false){
          header = 'Revisión de imagen';
          message = 'Exito al actualizar el objeto';
          buttons = ['Aceptar'];
          this.showAlert(header, message, buttons);
          this.dismiss();
        }else{
          header = 'Revisión de objeto';
          message = response.message;
          buttons = ['Aceptar'];
          this.showAlert(header, message, buttons, false);
          this.dismiss();
        }
      }, error: async(error) => {
        header = 'Revisión de objeto';
        message = 'No se pudo actualizar la iamgen';
        buttons = ['Aceptar'];
        this.showAlert(header, message, buttons, false);
        this.dismiss();
      }
    })
  }

  async confirmObject(){
    let header: string, message: string, buttons:any [];
    if(this.selectedObject == null){
      header = 'Seleción de objeto';
      message = 'Porfavor escoge un objeto que concuerde con la imagen';
      buttons = [{
        text: 'Aceptar',
      }];
      this.showAlert(header, message, buttons);
    }else{
      header = 'Confirma objeto';
      message = '¿Estas segura del objeto seleccionado?';
      buttons = [{
        text: 'Rechazar',
      },{
        text: 'Ok',
        handler: () => {
          this.updateImageObject(this.groupId, this.image.image_id, this.selectedObject);
        }
      }];
      this.showAlert(header, message, buttons, false);
    }
  }

  async ngOnInit() {
    let header: string, message: string, buttons: any [];
    this.selectedObject = null;
    header = 'Foto subida con exito',
    message = 'El objeto que se identifico es ' + this.image.object.toUpperCase() + '\n¿Es correcto?',
    buttons = [{
      text: 'Cancelar'
    },{
      text: 'Ok',
      handler: () => {
        this.authorizeImage(this.groupId, this.image.image_id, true, true);
      }
    }];
    this.showAlert(header, message, buttons, false)
  }
}
