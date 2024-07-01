import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, AlertController, LoadingController } from '@ionic/angular';
import { PerfilService } from '../services/perfil.service'; 
import { Router } from '@angular/router';
import {
  IonContent,
  IonIcon,
  IonAvatar,
  IonText,
  IonModal,
  IonHeader,
  IonToolbar,
  IonItem,
  IonInput,
  IonButton
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonIcon,
    IonAvatar,
    IonText,
    IonModal,
    IonHeader,
    IonToolbar,
    IonItem,
    IonInput,
    IonButton
  ]  
})
export class PerfilPage implements OnInit {
  username: string = '';
  newUsername: string = '';
  passwordActual: string = '';
  password: string = '';
  confirmPassword: string = '';
  showPassword: boolean = false;
  showPassword2: boolean = false;
  showPassword3: boolean = false;
  showPassword4: boolean = false;
  errorMessage: string = '';
  creationDate: string = ''; 

  isModalOpen = false;
  isSecondModalOpen = false;

  constructor(
    private navCtrl: NavController,
    private perfilService: PerfilService, 
    private router: Router,
    private alertController: AlertController,
    private zone: NgZone,
    private loadingCtrl: LoadingController
    ) { }

  // AGM 20/02/2024 - Abrir o cerrar el primer modal
  setOpen(isOpen: boolean) {
    this.errorMessage = '';
    this.newUsername = '';
    this.passwordActual = '';
    this.isModalOpen = isOpen;
  }

  setSecondOpen(isOpen: boolean) {
    this.errorMessage = '';
    this.password = '';
    this.confirmPassword = '';
    this.passwordActual = '';
    this.isSecondModalOpen = isOpen;
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
        this.navCtrl.navigateRoot('/login');
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
    if (!this.newUsername || !this.passwordActual) {
      this.errorMessage = 'Se requiere rellenar todos los campos.';
      return;
    }

    const alert = await this.alertController.create({
      header: 'Confirmar Cambios',
      message: '¿Estás seguro de efectuar los cambios a tu nombre de usuario? Una vez efectuado el cambio, no se puede deshacer esta acción.',
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
    this.loadingCtrl.create({
        message: 'Actualizando perfil...'
    }).then(loading => {
        loading.present(); 

        this.perfilService.updateUser(this.newUsername, this.passwordActual, undefined, undefined).subscribe({
            next: (response) => {
                loading.dismiss(); 
                if (response.error) {
                    this.errorMessage = response.message;
                    this.presentErrorAlert(this.errorMessage); 
                } else {
                    console.log('Perfil actualizado con éxito:', response.message);
                    this.setOpen(false);
                    this.presentUpdateSuccessAlert(); 
                }
            },
            error: (err) => {
                loading.dismiss(); 
                console.error('Error al actualizar el perfil:', err);
                this.errorMessage = err.error.message || 'Hay problemas de conexión a la hora de actualizar las credenciales. Por favor, inténtalo de nuevo o reinicia la aplicación.';
                this.presentErrorAlert(this.errorMessage); 
            }
        });
    });
  }
  
  // AGM 20/02/2024 - Confirmar a la hora de querer efectuar cambios en el password
  async presentConfirmEditPassword() {
    if (!this.passwordActual || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Todos los campos son requeridos.';
      this.presentErrorAlert(this.errorMessage); 
      return;
    }
  
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      this.presentErrorAlert(this.errorMessage); 
      return;
    }

    const alert = await this.alertController.create({
      header: 'Confirmar Cambios',
      message: '¿Estás seguro de efectuar los cambios a tu contraseña? Una vez efectuado el cambio, no se puede deshacer esta acción.',
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

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  togglePasswordVisibility2() {
    this.showPassword2 = !this.showPassword2;
  }

  togglePasswordVisibility3() {
    this.showPassword3 = !this.showPassword3;
  }

  togglePasswordVisibility4() {
    this.showPassword4 = !this.showPassword4;
  }

  // AGM 20/02/2024 - Lógica de manejo de edición de password
  editPassword() {
    this.loadingCtrl.create({
        message: 'Actualizando contraseña...'
    }).then(loading => {
        loading.present();

        this.perfilService.updateUser(undefined, this.passwordActual, this.password, this.confirmPassword).subscribe({
            next: (response) => {
                loading.dismiss(); 
                if (response.error) {
                    this.errorMessage = response.message;
                    this.presentErrorAlert(this.errorMessage); 
                } else {
                    console.log('Perfil actualizado con éxito:', response.message);
                    this.setSecondOpen(false);
                    this.presentUpdateSuccessAlert(); 
                }
            },
            error: (err) => {
                loading.dismiss(); 
                console.error('Error al actualizar el perfil:', err);
                this.errorMessage = err.error.message || 'Hay problemas de conexión a la hora de actualizar las credenciales. Por favor, inténtalo de nuevo o reinicia la aplicación.';
                this.presentErrorAlert(this.errorMessage); 
            }
        });
    });
  }

  // AGM 20/02/2024 - Alerta que confirma que el perfil ha sido actualizado
  async presentUpdateSuccessAlert() {
    const alert = await this.alertController.create({
      header: 'Actualización de credenciales exitosa:',
      message: 'Los cambios han sido efectuados en tu perfil, serás redirigido al login.',
      buttons: [{
        text: 'Aceptar',
        handler: () => {
          this.logOut();
        }
      }],
      backdropDismiss: false
    });
  
    await alert.present();
  
    const { role } = await alert.onDidDismiss();
    if (role === 'backdrop') {
      this.logOut();
    }
  }

  // AGM 20/02/2024 - Alerta para todos los errores
  async presentErrorAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error al modificar credenciales:',
      message: message,
      buttons: ['OK']
    });
  
    await alert.present();
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