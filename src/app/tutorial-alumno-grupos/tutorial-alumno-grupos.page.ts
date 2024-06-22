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
  selector: 'app-tutorial-alumno-grupos',
  templateUrl: './tutorial-alumno-grupos.page.html',
  styleUrls: ['./tutorial-alumno-grupos.page.scss'],
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
export class TutorialAlumnoGruposPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  goToDashboardAlumno() {
    this.router.navigateByUrl('/dashboard-alumno', {skipLocationChange: true}).then(()=>
    this.router.navigate(['/dashboard-alumno', { timestamp: Date.now() }]));
  }

  goToDashboardTutorial() {
    this.router.navigateByUrl('/tutorial-alumno-dashboard', {skipLocationChange: true}).then(()=>
    this.router.navigate(['/tutorial-alumno-dashboard', { timestamp: Date.now() }]));
  }
}
