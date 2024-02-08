import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-dashboard-maestro',
  templateUrl: './dashboard-maestro.page.html',
  styleUrls: ['./dashboard-maestro.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class DashboardMaestroPage implements OnInit {

  // AGM 30/01/2024 - Constructor de alertas y routers
  constructor(private alertController: AlertController, private router: Router) {}

  // AGM 30/01/2024 - Redireccionamiento a perfil, grupo y login (Logout)
  irAPerfil() {
    // Lógica adicional antes de la navegación
    this.router.navigate(['/perfil']);
  }
  
  cerrarSesion() {
    fetch('http://localhost:5000/auth/logout', {
      credentials: 'include'
    })
      .then(response => response.text()) // Obtener respuesta como texto
      .then(html => {
        console.log(html); // Mostrar la respuesta HTML en consola
      })
      .catch(error => {
        console.error('Error:', error);
    });
    this.router.navigate(['/login']);
  }

  irGrupo() {
    // Acciones como limpiar datos de sesión
    this.router.navigate(['/grupo-maestro']);
  }

  // AGM 30/01/2024 - Declaración de variables bandera para cerrar o abrir los modal
  isModalOpen = false;
  isSecondModalOpen = false;
  isThirdModalOpen = false; 
  isFourthModalOpen = false; 
  isFifthModalOpen = false;
  isSixthModalOpen = false;

  // AGM 30/01/2024 - Declarar la variable del archivo txt
  fileName: string | null = null;

  // AGM 30/01/2024 - Declarar la variable de alerta de ayuda
  helpMessage: string = `Nombre usuario, Contraseña,
  Alejandro Guerrero, 12345,
  Carlos Daniel Medina, 125,`;

  async helpAlert() {
    const alert = await this.alertController.create({
      header: '¿Cómo debo estructurar mi archivo txt?',
      subHeader: 'El formato sugerido es el siguiente: ',
      message: this.helpMessage,
      buttons: ['Cerrar'],
    });
    await alert.present();
  }
  
  // AGM 30/01/2024 - Abrir o cerrar el primer modal
  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  // AGM 30/01/2024 - Abrir o cerrar el segundo modal
  setSecondOpen(isOpen: boolean) {
    this.isSecondModalOpen = isOpen;
  }

  // AGM 30/01/2024 - Abrir o cerrar el tercer modal
  setThirdOpen(isOpen: boolean) {
    this.isThirdModalOpen = isOpen; 
  }

  // AGM 30/01/2024 - Abrir o cerrar el cuarto modal
  setFourthOpen(isOpen: boolean) {
    this.isFourthModalOpen = isOpen; 
  }

  // AGM 31/01/2024 - Abrir o cerrar el quinto modal
  setFifthOpen(isOpen: boolean) {
    this.isFifthModalOpen = isOpen; 
  }

  // AGM 31/01/2024 - Abrir o cerrar el sexto modal
  setSixthOpen(isOpen: boolean) {
    this.isSixthModalOpen = isOpen; 
  }

  //AGM 30/01/2024 - Cerrar el segundo modal cuando se abre el tercer modal
  handleDocumentIconClick() {
    this.setSecondOpen(false); 
    this.setThirdOpen(true);   
  }

  //AGM 30/01/2024 - Manejar la data del archivo txt de los alumnos
  handleFileInput(event: Event) {
    const element = event.target as HTMLInputElement;
    const files = element.files;
    if (files && files.length > 0) {
      const file = files[0];
      this.fileName = file.name; 
      // Procesar el archivo .txt aquí
    } else {
      this.fileName = null; 
    }
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
         // Muestra la alerta de grupo eliminado
      }
    },
  ];

  // AGM 31/01/2024 - Botones de la alerta de modificación del grupo
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
        this.presentChangesMadeAlert();
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
            window.location.reload(); 
          }
        }
      ]
    });
  
    await alert.present();
  }

  // AGM 08/02/2024 - Obtener grupos del maestro
  grupos: any[] = []; 
  username: string = '';

  getGrupos() {
    fetch('http://localhost:5000/maestro', {
      credentials: 'include'  
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((json) => {
      console.log(json);
      this.grupos = json.grupos;
      this.username = json.username;
    })
    .catch((error) => console.error('Error al obtener los grupos:', error));
  }

  // AGM 08/02/2024 - Crear un grupo (maestro)
  nombreGrupo: string = '';
  descripcionGrupo: string = '';
  message: string = '';

  crearGrupo() {
    const formData = new FormData();
    formData.append('nombre', this.nombreGrupo);
    formData.append('descripcion', this.descripcionGrupo);
  
    fetch('http://localhost:5000/maestro/create-group', {
      method: 'POST',
      body: formData,
      credentials: 'include'
    })
    .then(response => response.json())
    .then(async data => {
      if (!data.error) {
        this.message = '';
        const alert = await this.alertController.create({
          header: 'Grupo Creado',
          message: `El código de acceso del grupo es: ${data.codigo_acceso}`,
          buttons: [{
            text: 'OK',
            handler: () => {
              this.setOpen(false); 
              window.location.reload();
            }
          }]
        });
        
        await alert.present();
      } else {
        this.message = data.message;
      }
    })
    .catch(error => {
      this.message = 'Error al conectar con el servidor';
    });
  }

  // AGM 08/02/2024 - Al iniciar la página, automáticamente obtiene los grupos del maestro
  ngOnInit() {
    this.getGrupos();
  }
}
