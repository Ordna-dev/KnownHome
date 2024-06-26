import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { CapacitorCookies } from '@capacitor/core';
import { AuthService } from '../services/auth.service'; 
import {
  IonContent,
  IonList,
  IonInput,
  IonButton,
  IonText,
  IonIcon,
  IonItem,
  IonLabel
} from '@ionic/angular/standalone';

const getCookies = () => {
  return document.cookie;
};

@Component({
  selector: 'app-login-alumno',
  templateUrl: './login-alumno.page.html',
  styleUrls: ['./login-alumno.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonList,
    IonInput,
    IonButton,
    IonText,
    IonIcon,
    IonItem,
    IonLabel
  ]  
})
export class LoginAlumnoPage implements OnInit {
  username: string = '';
  password: string = '';
  showPassword: boolean = false;
  errorMessage: string = '';
  jsonData: any[] = []; // Array para almacenar los datos JSON

  constructor(private router: Router, private authService: AuthService, private alertController: AlertController) {} 

  ngOnInit() {
  }

  goToStudentLogin() {
    this.router.navigate(['/login']);
  }

  // AGM 17/06/2024 - Ver contraseña del alumno
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onLogin() {
    if (!this.username || !this.password) {
      this.errorMessage = 'Se requieren ambos campos';
      console.log('Los campos están vacíos');
      this.showErrorAlert('Error de autenticación', 'Se requieren ambos campos');
      return;
    }
  
    console.log('Enviando solicitud de inicio de sesión', this.username);
  
    this.authService.studentLogin(this.username, this.password).subscribe({
      next: async (data) => {
        console.log('Datos de respuesta', data);
        if (data.error !== false) {
          this.errorMessage = data.message;
          await this.showErrorAlert('Error de inicio de sesión', this.errorMessage);
        } else {
          console.log('Inicio de sesión exitoso, redirigiendo...');
          this.router.navigate(['/dashboard-alumno'], { state: { userInfo: data } });
        }
      },
      error: async (error) => {
        console.error('Error en el proceso de inicio de sesión:', error);
        this.errorMessage = 'Error al conectar con el servidor';
        await this.showErrorAlert('Error de conexión', this.errorMessage);
      }
    });
  }

  async showErrorAlert(header: string, message: string) {
      const alert = await this.alertController.create({
        header: header,
        message: message,
        buttons: ['OK'],
        backdropDismiss: false
      });
      await alert.present();
  }
}
