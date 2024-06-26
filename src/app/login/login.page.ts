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

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Dismissing after 3 seconds...',
      duration: 3000,
    });

    loading.present();
  }

  alertButtons = ['Action'];

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'A Short Title Is Best',
      subHeader: 'A Sub Header Is Optional',
      message: 'A message should be a short, complete sentence.',
      buttons: ['Action'],
    });

    await alert.present();
  }

  goToStudentLogin() {
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
  
    this.authService.teacherLogin(this.username, this.password).subscribe({
      next: async (data) => {
        console.log(data);
        if (data.error !== false) {
          this.errorMessage = data.message;
          await this.showErrorAlert('Error de inicio de sesión', this.errorMessage);
        } else {
          console.log('Inicio de sesión exitoso, redirigiendo...');
          this.router.navigate(['/dashboard-maestro'], { state: { userInfo: data } });
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