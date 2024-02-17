import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; 

@Component({
  selector: 'app-login-alumno',
  templateUrl: './login-alumno.page.html',
  styleUrls: ['./login-alumno.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LoginAlumnoPage implements OnInit {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private router: Router, private authService: AuthService) {} 

  ngOnInit() {}

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
