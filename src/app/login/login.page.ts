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

  constructor(private router: Router) {} 

  ngOnInit() {
  }

  // AGM 28/01/2024 - Redireccionar al loguearse
  onLogin() {
    this.router.navigate(['/dashboard-alumno']);  // Redirige a la página del dashboard del alumno - Por cambiar
  }
}
