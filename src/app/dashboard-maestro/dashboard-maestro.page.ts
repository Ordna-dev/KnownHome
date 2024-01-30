import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-dashboard-maestro',
  templateUrl: './dashboard-maestro.page.html',
  styleUrls: ['./dashboard-maestro.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class DashboardMaestroPage implements OnInit {

  constructor(private alertController: AlertController) {}

  //AGM 30/01/2024 - Declaración de variables bandera para cerrar o abrir los modal
  isModalOpen = false;
  isSecondModalOpen = false;
  isThirdModalOpen = false; 

  //AGM 30/01/2024 - Declarar la variable del archivo txt
  fileName: string | null = null;

  //AGM 30/01/2024 - Declarar la variable de alerta de ayuda
  helpMessage: string = `Nombre usuario, Contraseña,
  Alejandro Guerrero, 12345,
  Carlos Daniel Medina, 125,`;

  async helpAlert() {
    const alert = await this.alertController.create({
      header: '¿Cómo debo estructurar mi archivo txt?',
      subHeader: 'El formato sugerido es el siguiente: ',
      message: this.helpMessage,
      buttons: ['Cerrar'],
    });
    await alert.present();
  }

  //AGM 30/01/2024 - Pintar de colores aleatorios las cards
  colores = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger', 'light', 'medium', 'dark'];

  getColorAleatorio(): string {
    const indiceAleatorio = Math.floor(Math.random() * this.colores.length);
    return this.colores[indiceAleatorio];
  }

  
  //AGM 30/01/2024 - Abrir o cerrar el primer modal
  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  //AGM 30/01/2024 - Abrir o cerrar el segundo modal
  setSecondOpen(isOpen: boolean) {
    this.isSecondModalOpen = isOpen;
  }

  //AGM 30/01/2024 - Abrir o cerrar el tercer modal
  setThirdOpen(isOpen: boolean) {
    this.isThirdModalOpen = isOpen; 
  }

  //AGM 30/01/2024 - Cerrar el segundo modal cuando se abre el tercer modal
  handleDocumentIconClick() {
    this.setSecondOpen(false); 
    this.setThirdOpen(true);   
  }

  //AGM 30/01/2024 - Manejar la data del archivo txt de los alumnos
  handleFileInput(event: Event) {
    const element = event.target as HTMLInputElement;
    const files = element.files;
    if (files && files.length > 0) {
      const file = files[0];
      this.fileName = file.name; // Establece el nombre del archivo
      // Procesa el archivo .txt aquí
    } else {
      this.fileName = null; // Restablece el nombre si no hay archivo
    }
  }

  ngOnInit() {
  }

}
