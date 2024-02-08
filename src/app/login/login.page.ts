import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})

export class LoginPage implements OnInit {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private router: Router) {} 

  ngOnInit() {
    
  }

  getPosts() {
    fetch('https://jsonplaceholder.typicode.com/posts/1')
    .then((response) => response.json())
    .then((json) => console.log(json));
  }

  testLogout() {
    fetch('http://localhost:5000/auth/logout')
      .then(response => response.text()) // Obtener respuesta como texto
      .then(html => {
        console.log(html); // Mostrar la respuesta HTML en consola
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  // AGM 28/01/2024 - Redireccionar al loguearse
  onLogin() {
    if (!this.username || !this.password) {
      this.errorMessage = 'Se requieren ambos campos';
      console.log('Los campos están vacíos'); // Añadir console.log aquí
      return;
    }
  
    // Codificar los datos en formato x-www-form-urlencoded
    const formData = new URLSearchParams();
    formData.append('username', this.username);
    formData.append('password', this.password);
  
    console.log('Enviando solicitud de inicio de sesión', this.username); // Añadir console.log para los datos enviados
  
    fetch('http://localhost:5000/auth/maestro/login', {
      method: 'POST',
      body: formData,
      credentials: 'include', // Importante para enviar/recibir cookies
      headers: {
        'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
    })
    .then(response => {
      console.log('Respuesta recibida', response); // Añadir console.log para la respuesta HTTP
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Datos de respuesta', data); // Añadir console.log para la respuesta JSON
      if (data.error !== false) {
        this.errorMessage = data.message; // Mostrar mensaje de error
      } else {
        // Si no hay clave "error", asumir que el inicio de sesión fue exitoso
        console.log('Inicio de sesión exitoso, redirigiendo...'); // Añadir console.log para un inicio de sesión exitoso
        console.log(data);
        this.router.navigate(['/dashboard-maestro'], { state: { userInfo: data } });
      }
    })
    .catch(error => {
      console.error('Error en el proceso de inicio de sesión:', error); // Añadir console.log para cualquier error capturado
      this.errorMessage = 'Error al conectar con el servidor';
    });
  }  
}
