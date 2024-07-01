import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; 
import {
  IonContent,
  IonList,
  IonInput,
  IonButton,
  IonText,
  IonIcon,
  IonItem,
  IonLabel,
  IonAlert,
  IonLoading
} from '@ionic/angular/standalone';

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
    IonLabel,
    IonAlert,
    IonLoading
  ]  
})
export class LoginAlumnoPage implements OnInit {
  username: string = '';
  password: string = '';
  showPassword: boolean = false;
  errorMessage: string = '';
  alertButtons = ['Action'];

  constructor(private router: Router, private authService: AuthService, private alertController: AlertController, private loadingCtrl: LoadingController) {} 

  ngOnInit() {
  }

  goToStudentLogin() {
    this.password = '';
    this.username = '';
    this.errorMessage = '';
    this.router.navigate(['/login']);
  }

  // AGM 17/06/2024 - Ver contraseña del alumno
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  async onLogin() {
    if (!this.username || !this.password) {
      this.errorMessage = 'Se requieren ambos campos';
      console.log('Los campos están vacíos');
      await this.showErrorAlert('Error de autenticación:', 'Se requieren ambos campos');
      return;
    }
  
    console.log('Enviando solicitud de inicio de sesión', this.username);

    const loading = await this.loadingCtrl.create({
      message: 'Iniciando sesión...'
    });
    await loading.present();  // Mostrar el recuadro de carga

    this.authService.studentLogin(this.username, this.password).subscribe({
      next: async (data) => {
        console.log('Datos de respuesta', data);
        await loading.dismiss();  // Ocultar el recuadro de carga
        if (data.error !== false) {
          this.errorMessage = data.message;
          await this.showErrorAlert('Error de autenticación:', this.errorMessage);
        } else {
          this.password = '';
          this.username = '';
          this.errorMessage = '';
          console.log('Inicio de sesión exitoso, redirigiendo...');
          this.router.navigate(['/dashboard-alumno'], { state: { userInfo: data } });
        }
      },
      error: async (error) => {
        console.error('Error de autenticación:', error);
        this.errorMessage = 'Error de conexión, revisa tu conexión a internet. Inténtalo de nuevo o reinicia la aplicación.';
        await loading.dismiss();  
        await this.showErrorAlert('Error al iniciar sesión:', this.errorMessage);
      }
    });
  }

  async showErrorAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['Aceptar'],
      backdropDismiss: false
    });
    await alert.present();
  }
}