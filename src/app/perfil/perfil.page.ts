import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, AlertController } from '@ionic/angular';
import { PerfilService } from '../services/perfil.service'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PerfilPage implements OnInit {
  username: string = '';
  newUsername: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  creationDate: string = ''; 

  isModalOpen = false;
  isSecondModalOpen = false;

  constructor(
    private navCtrl: NavController,
    private perfilService: PerfilService, 
    private router: Router,
    private alertController: AlertController,
    private zone: NgZone
    ) { }

  // AGM 20/02/2024 - Abrir o cerrar el primer modal
  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
    this.errorMessage = '';
    this.newUsername = '';
  }

  setSecondOpen(isOpen: boolean) {
    this.isSecondModalOpen = isOpen;
    this.errorMessage = '';
    this.password = '';
    this.confirmPassword = '';
  }

  // AGM 01/02/2024 - Redireccionar a la pagina anterior
  goBack() {
    this.navCtrl.back();
  }

  // AGM 20/02/2024 - Efectuar el LogOut del actual usuario
  logOut() {
    this.perfilService.logOutService().subscribe({
      next: (html) => {
        console.log(html); 
        this.zone.run(() => {
          this.navCtrl.navigateRoot('/login');
        });
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }

  // AGM 20/02/2024 - Obtener el usuario a la hora de entrar a la pagina
  getUser() {
    this.perfilService.getUser().subscribe({
      next: (user) => {
        console.log(user);
        this.username = user.username;
        this.creationDate = user.created_at; 
        console.log(this.creationDate);
      },
      error: (error) => {
        console.error('Error al obtener el perfil del usuario:', error);
      }
    });
  }

  // AGM 20/02/2024 - Confirmar a la hora de querer efectuar cambios en el perfil
  async presentConfirmEditUsername() {
    const alert = await this.alertController.create({
      header: 'Confirmar Cambios',
      message: '¿Estás seguro de efectuar los cambios a tu perfil? Una vez efectuados, no se puede deshacer esta acción.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Edición de username cancelada');
          }
        }, {
          text: 'Aceptar',
          handler: () => {
            this.editUsername();
          }
        }
      ]
    });
  
    await alert.present();
  }

  // AGM 20/02/2024 - Lógica de manejo de edición de username
  editUsername() {
    if (!this.newUsername) {
      this.errorMessage = 'Se requiere un nombre de usuario.';
      return;
    }
  
    this.perfilService.updateUser(this.newUsername, undefined, undefined).subscribe({
      next: (response) => {
        if (response.error) {
          this.errorMessage = response.message;
        } else {
          console.log('Perfil actualizado con éxito:', response.message);
          this.setOpen(false);
          this.presentUpdateSuccessAlert(); 
        }
      },
      error: (err) => {
        console.error('Error al actualizar el perfil:', err);
        this.errorMessage = err.error.message || 'Ocurrió un error al actualizar el perfil.';
      }
    });
  }
  
  // AGM 20/02/2024 - Confirmar a la hora de querer efectuar cambios en el password
  async presentConfirmEditPassword() {
    const alert = await this.alertController.create({
      header: 'Confirmar Cambios',
      message: '¿Estás seguro de efectuar los cambios a tu perfil? Una vez efectuados, no se puede deshacer esta acción.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Edición de password cancelada');
          }
        }, {
          text: 'Aceptar',
          handler: () => {
            this.editPassword();
          }
        }
      ]
    });
  
    await alert.present();
  }

  // AGM 20/02/2024 - Lógica de manejo de edición de password
  editPassword() {
    if (!this.password || !this.confirmPassword) {
      this.errorMessage = 'Se requieren todos los campos de contraseña.';
      return;
    }
  
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    console.log(this.password);
    console.log(this.confirmPassword);
  
    this.perfilService.updateUser(undefined, this.password, this.confirmPassword).subscribe({
      next: (response) => {
        if (response.error) {
          this.errorMessage = response.message;
        } else {
          console.log('Perfil actualizado con éxito:', response.message);
          this.setSecondOpen(false);
          this.presentUpdateSuccessAlert();
        }
      },
      error: (err) => {
        console.error('Error al actualizar el perfil:', err);
        this.errorMessage = err.error.message || 'Ocurrió un error al actualizar el perfil.';
      }
    });
  }  

  // AGM 20/02/2024 - Alerta que confirma que el perfil ha sido actualizado
  async presentUpdateSuccessAlert() {
    const alert = await this.alertController.create({
      header: 'Actualización Exitosa',
      message: 'Los cambios han sido efectuados en tu perfil, serás redirigido al login.',
      buttons: [{
        text: 'Aceptar',
        handler: () => {
          this.logOut();
        }
      }],
      backdropDismiss: true 
    });
  
    await alert.present();
  
    const { role } = await alert.onDidDismiss();
    if (role === 'backdrop') {
      this.logOut();
    }
  }

  /*
  AgmX77777#
  GMAx4444?
  */

  // AGM 20/02/2024 - Se inicia la pagina
  ngOnInit() {
    this.getUser();
  }
}