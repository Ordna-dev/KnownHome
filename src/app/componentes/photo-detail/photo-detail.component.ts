import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalController } from '@ionic/angular';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonIcon } from '@ionic/angular/standalone';

interface DangerLevelsClasses {
  Minimo: string,
  Bajo: string,
  Moderado: string,
  Peligroso: string,
  'Extremadamente peligroso': string 
}

@Component({
  selector: 'app-photo-detail',
  templateUrl: './photo-detail.component.html',
  styleUrls: ['./photo-detail.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonIcon
  ]
})

export class PhotoDetailComponent {
  @Input() image:any;

  // Danger CSS classes
  dangerLevelsClasses:DangerLevelsClasses = {
    Minimo: 'low',
    Bajo: 'low-middle',
    Moderado: 'middle',
    Peligroso: 'middle-danger',
    'Extremadamente peligroso': 'danger'
  };

  constructor(private modalCtrl: ModalController) {}

  dismiss(){
    return this.modalCtrl.dismiss()
  }

  getDangerClass(danger_level : keyof DangerLevelsClasses) {
    return this.dangerLevelsClasses[danger_level];
  }
}
