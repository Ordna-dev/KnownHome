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
      return;
    }

    // Realizar la solicitud PUT para el inicio de sesión
    fetch('http://localhost:5000/auth/maestro/login', {
      method: 'PUT',
      body: JSON.stringify({
        username: this.username,
        password: this.password,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        this.errorMessage = data.message;
      } else {
        this.router.navigate(['/dashboard-maestro']); // Redirige al dashboard del maestro
      }
    })
    .catch(error => {
      console.error('Error:', error);
      this.errorMessage = 'Error al conectar con el servidor';
    });
  }
  
}
