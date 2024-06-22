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
  selector: 'app-tutorial-maestro-dashboard',
  templateUrl: './tutorial-maestro-dashboard.page.html',
  styleUrls: ['./tutorial-maestro-dashboard.page.scss'],
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
export class TutorialMaestroDashboardPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  goToDashboardMaestro() {
    this.router.navigateByUrl('/dashboard-maestro', {skipLocationChange: true}).then(()=>
    this.router.navigate(['/dashboard-maestro', { timestamp: Date.now() }]));
  }

  goToGroupsTutorial() {
    this.router.navigateByUrl('/tutorial-maestro-grupos', {skipLocationChange: true}).then(()=>
    this.router.navigate(['/tutorial-maestro-grupos', { timestamp: Date.now() }]));
  }
}
