import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-grupo-maestro',
  templateUrl: './grupo-maestro.page.html',
  styleUrls: ['./grupo-maestro.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class GrupoMaestroPage implements OnInit {

  constructor(private alertController: AlertController, private router: Router) { }

  // AGM 31/01/2024 - Declaración de variables bandera para cerrar o abrir los modal
  isModalOpen = false;
  isSecondModalOpen = false;
  isThirdModalOpen = false;
  isFourthModalOpen = false;
  isFifthModalOpen = false;
  isSixthModalOpen = false;
  isSeventhModalOpen = false;

  // AGM 31/01/2024 - Abrir o cerrar el primer modal
  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  // AGM 31/01/2024 - Abrir o cerrar el segundo modal
  setSecondOpen(isOpen: boolean) {
    this.isSecondModalOpen = isOpen;
  }

  setThirdOpen(isOpen: boolean) {
    this.isThirdModalOpen = isOpen;
  }

  setFourthOpen(isOpen: boolean) {
    this.isFourthModalOpen = isOpen;
  }

  setFifthOpen(isOpen: boolean) {
    this.isFifthModalOpen = isOpen;
  }

  setSixthOpen(isOpen: boolean) {
    this.isSixthModalOpen = isOpen;
  }

  setSeventhOpen(isOpen: boolean) {
    this.isSeventhModalOpen = isOpen;
  }
  
  // AGM 31/01/2024 - Botones de las alertas de modificaciones
  public alertButtonsEdit = [
    {
      text: 'No',
      handler: () => {
        // Acción a realizar cuando se presione "No".
      }
    },
    {
      text: 'Sí',
      handler: () => {
        this.setSecondOpen(false); // Cierra el segundo modal
        this.presentChangesMadeAlert(); // Muestra la segunda alerta
      }
    },
  ];

  async presentChangesMadeAlert() {
    const alert = await this.alertController.create({
      header: 'Los cambios se han hecho en el grupo',
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            window.location.reload(); // Recarga la página
          }
        }
      ]
    });
  
    await alert.present();
  }

  // AGM 31/01/2024 - Botones de la alerta de eliminación del grupo
  public alertButtonsDelete = [
    {
      text: 'No',
      handler: () => {
        // Acción a realizar cuando se presione "No".
      }
    },
    {
      text: 'Sí',
      handler: () => {
        this.presentGroupDeletedAlert(); // Muestra la alerta de grupo eliminado
      }
    },
  ];
  
  // AGM 31/01/2024 - Bug a solucionar - Hay un bug con los menus cuando se redirecciona (no estoy seguro del porque)
  async presentGroupDeletedAlert() {
    const alert = await this.alertController.create({
      header: 'Se ha eliminado el grupo',
      message: 'Usted será redireccionado al dashboard',
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            window.location.reload(); //this.router.navigateByUrl('/dashboard-maestro'); // Redirige al dashboard
          }
        }
      ]
    });
  
    await alert.present();
  }

  // AGM 31/01/2024 - Alerta de eliminación del alumno de un grupo
  public alertButtonsDeleteStudent = [
    {
      text: 'No',
      handler: () => {
        // Acción a realizar cuando se presione "No".
      }
    },
    {
      text: 'Sí',
      handler: () => {
        // Acción a realizar cuando se presione "Sí".
      }
    },
  ];

  // AGM 31/01/2024 - Redireccionamiento a perfil y cierre de sesion

  redirectToProfile() {
    this.router.navigateByUrl('/perfil');
  }
  
  redirectToLogin() {
    this.router.navigateByUrl('/login');
  }


  ngOnInit() {
  }

}
