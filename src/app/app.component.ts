import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, Router, NavigationEnd, Event } from '@angular/router';
import { IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logOutOutline, reloadOutline, menu, eye, eyeOff, personCircleOutline, personOutline, chevronForwardCircle, arrowUpCircle, images, camera, chevronForwardOutline, trash, accessibility, peopleOutline, closeOutline, arrowBackOutline, helpCircleOutline, documentText, pencilSharp, ellipseOutline, logoGoogle, accessibilitySharp, logInSharp, logInOutline, mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, heartOutline, heartSharp, archiveOutline, archiveSharp, trashOutline, trashSharp, warningOutline, warningSharp, bookmarkOutline, bookmarkSharp, checkboxOutline } from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet],
})
export class AppComponent {

  constructor() {
    addIcons({ logOutOutline, reloadOutline, menu, eye, eyeOff, personCircleOutline, personOutline, chevronForwardCircle, checkboxOutline, arrowUpCircle, images, camera, chevronForwardOutline, trash, accessibility, peopleOutline, closeOutline, arrowBackOutline, helpCircleOutline, documentText, pencilSharp, ellipseOutline, logoGoogle, accessibilitySharp, logInSharp, logInOutline, mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, heartOutline, heartSharp, archiveOutline, archiveSharp, trashOutline, trashSharp, warningOutline, warningSharp, bookmarkOutline, bookmarkSharp });
  }
  
}
