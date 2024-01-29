import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';  // Importa Router

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})

export class LoginPage implements OnInit {

  constructor(private router: Router) {}  // Inyecta Router en el constructor

  ngOnInit() {
  }

  onLogin() {
    this.router.navigate(['/dashboard-maestro']);  // Redirige a la página del dashboard del alumno
  }
}
