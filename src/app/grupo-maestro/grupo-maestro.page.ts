import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-grupo-maestro',
  templateUrl: './grupo-maestro.page.html',
  styleUrls: ['./grupo-maestro.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class GrupoMaestroPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
