import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-validacion-correo',
  templateUrl: './validacion-correo.page.html',
  styleUrls: ['./validacion-correo.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ValidacionCorreoPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
