import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import {
  IonMenu,
  IonHeader,
  IonAvatar,
  IonContent,
  IonText,
  IonIcon,
  IonRefresher,
  IonRefresherContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonButton,
  IonModal,
  IonToolbar,
  IonTitle,
  IonItem,
  IonTextarea,
  IonInput,
  IonSearchbar,
  IonButtons,
  IonList
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-tutorial-alumno-dashboard',
  templateUrl: './tutorial-alumno-dashboard.page.html',
  styleUrls: ['./tutorial-alumno-dashboard.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, // Si estás usando ngModel dentro de tu plantilla
    IonMenu,
    IonHeader,
    IonAvatar,
    IonContent,
    IonText,
    IonIcon,
    IonRefresher,
    IonRefresherContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonButton,
    IonModal,
    IonToolbar,
    IonTitle,
    IonItem,
    IonTextarea,
    IonInput,
    IonSearchbar,
    IonButtons,
    IonList
  ]  
})
export class TutorialAlumnoDashboardPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  goToDashboardAlumno() {
    this.router.navigate(['/dashboard-alumno']);
  }

  goToGroupsTutorial() {
    this.router.navigate(['/tutorial-alumno-grupos']);
  }
}
