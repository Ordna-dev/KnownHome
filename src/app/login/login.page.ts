import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, LoadingController, AlertController } from '@ionic/angular';
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
  IonLoading,
  IonAlert
} from '@ionic/angular/standalone';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
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
    IonLoading,
    IonAlert
  ]  
})

export class LoginPage implements OnInit {
  // AGM 15/02/2024 - Código del login refactorizado
  username: string = '';
  password: string = '';
  showPassword: boolean = false;
  errorMessage: string = '';

  constructor(private router: Router, private authService: AuthService, private loadingCtrl: LoadingController, private alertController: AlertController) {} 

  ngOnInit() {}

  alertButtons = ['Action'];

  goToStudentLogin() {
    this.password = '';
    this.username = '';
    this.errorMessage = '';
    this.router.navigate(['/login-alumno']);
  }

  // AGM 17/06/2024 - Ver contraseña del maestro
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
  
    this.loadingCtrl.create({
      message: 'Iniciando sesión...'
    }).then(loading => {
      loading.present();

      this.authService.teacherLogin(this.username, this.password).subscribe({
        next: async (data) => {
          console.log(data);
          loading.dismiss();
          if (data.error !== false) {
            this.errorMessage = data.message;
            await this.showErrorAlert('Error al iniciar sesión:', this.errorMessage);
          } else {
            this.password = '';
            this.username = '';
            this.errorMessage = '';
            console.log('Inicio de sesión exitoso, redirigiendo...');
            this.router.navigate(['/dashboard-maestro'], { state: { userInfo: data } });
          }
        },
        error: async (error) => {
          console.error('Error al iniciar sesión:', error);
          this.errorMessage = 'Error al conectar con el servidor, revisa tu conexión a internet';
          loading.dismiss();
          await this.showErrorAlert('Error al iniciar sesión:', this.errorMessage);
        }
      });
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