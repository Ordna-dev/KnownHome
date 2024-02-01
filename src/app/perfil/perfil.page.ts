import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PerfilPage implements OnInit {
  
  constructor(private navCtrl: NavController) { }

  // AGM 01/02/2024 - Redireccionar a la pagina anterior
  goBack() {
    this.navCtrl.back();
  }

  ngOnInit() {
  }

}
