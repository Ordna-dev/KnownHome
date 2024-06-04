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
  IonIcon,
  IonItem,
  IonLabel
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
    IonLabel
  ]  
})
export class LoginAlumnoPage implements OnInit {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  jsonData: any[] = []; // Array para almacenar los datos JSON

  constructor(private router: Router, private authService: AuthService) {} 

  fetchJsonData() {
    this.authService.getJsonData().subscribe({
      next: (data) => {
        console.log('Datos JSON recibidos', data);
        this.jsonData = data;
      },
      error: (error) => {
        console.error('Error al obtener los datos JSON:', error);
        this.errorMessage = 'Error al obtener los datos JSON';
      }
    });
  }

  ngOnInit() {
    this.fetchJsonData();
  }

  goToStudentLogin() {
    this.router.navigate(['/login']);
  }

  onLogin() {
    if (!this.username || !this.password) {
      this.errorMessage = 'Se requieren ambos campos';
      console.log('Los campos están vacíos');
      return;
    }
  
    console.log('Enviando solicitud de inicio de sesión', this.username);
  
    this.authService.studentLogin(this.username, this.password).subscribe({
      next: (data) => {
        console.log('Datos de respuesta', data);
        if (data.error !== false) {
          this.errorMessage = data.message;
        } else {
          console.log('Inicio de sesión exitoso, redirigiendo...');
          this.router.navigate(['/dashboard-alumno'], { state: { userInfo: data } });
        }
      },
      error: (error) => {
        console.error('Error en el proceso de inicio de sesión:', error);
        this.errorMessage = 'Error al conectar con el servidor';
      }
    });
  }  
}
