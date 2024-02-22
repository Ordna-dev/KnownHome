import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; 
import {
  IonContent,
  IonList,
  IonInput,
  IonButton,
  IonText,
  IonIcon
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
    IonIcon
  ]  
})

export class LoginPage implements OnInit {
  // AGM 15/02/2024 - Código del login refactorizado
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private router: Router, private authService: AuthService) {} 

  ngOnInit() {}

  goToStudentLogin() {
    this.router.navigate(['/login-alumno']);
  }

  onLogin() {
    if (!this.username || !this.password) {
      this.errorMessage = 'Se requieren ambos campos';
      console.log('Los campos están vacíos');
      return;
    }
  
    console.log('Enviando solicitud de inicio de sesión', this.username);
  
    this.authService.teacherLogin(this.username, this.password).subscribe({
      next: (data) => {
        console.log('Datos de respuesta', data);
        if (data.error !== false) {
          this.errorMessage = data.message;
        } else {
          console.log('Inicio de sesión exitoso, redirigiendo...');
          this.router.navigate(['/dashboard-maestro'], { state: { userInfo: data } });
        }
      },
      error: (error) => {
        console.error('Error en el proceso de inicio de sesión:', error);
        this.errorMessage = 'Error al conectar con el servidor';
      }
    });
  }  
}