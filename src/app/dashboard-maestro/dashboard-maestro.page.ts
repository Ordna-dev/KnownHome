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

  irGrupo(groupId: number) {
    fetch(`http://localhost:5000/maestro/group/${groupId}`, {
        method: 'GET',
        credentials: 'include' // Si tu API requiere autenticación
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.error) {
            console.error('Error:', data.mensaje);
        } else {
            console.log('Grupo obtenido con éxito:', data.grupo);
            // Redirige y pasa los datos del grupo a la nueva página
            this.router.navigate(['/grupo-maestro'], { state: { grupo: data.grupo } });
        }
    })
    .catch(error => {
        console.error('Error al obtener el grupo:', error.message);
    });
  }

  /* 
  irGrupo() {
    this.router.navigate(['/grupo-maestro']);
  }
  */

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
              this.getGrupos();
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

  // AGM 11/02/2024 - Eliminar x grupo
  async confirmDeletion(groupId: number) {
    const alert = await this.alertController.create({
      header: '¿Estas seguro de eliminar el grupo? Una vez eliminado, no se puede volver a recuperar.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.deleteGroup(groupId);
          },
        },
      ],
    });
  
    await alert.present();
  }
  
  async deleteGroup(groupId: number) {
    fetch(`http://localhost:5000/maestro/delete-group/${groupId}`, {
      method: 'DELETE',
      credentials: 'include'
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(async data => {
      console.log('Group deleted successfully:', data);
      this.setFifthOpen(false);
  
      const alert = await this.alertController.create({
        header: 'Grupo eliminado',
        message: 'El grupo ha sido eliminado.',
        buttons: [{
          text: 'Aceptar',
          handler: () => {
            this.getGrupos();
          }
        }]
      });
  
      await alert.present();
    })
    .catch(error => {
      console.error('Error al eliminar el grupo:', error);
    });
  }  

  // AGM 11/02/2024 - Editar grupo
  errorMessage: string = '';
  grupoSeleccionado: any = { id: null, nombre: '', descripcion: '' };

  // Función para abrir el modal de edición y preparar los datos del grupo seleccionado
  prepareEditGroup(groupId: number) {
    const grupo = this.grupos.find(g => g.id === groupId);
    if(grupo) {
      this.grupoSeleccionado = {...grupo}; 
      console.log('Editing group with ID:', this.grupoSeleccionado.id); 
      this.setSixthOpen(true); 
    }
  }

  async showEditConfirmation() {
    const alert = await this.alertController.create({
      header: '¿Está seguro de modificar las propiedades del grupo?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Modificación cancelada');
          }
        },
        {
          text: 'Sí',
          handler: () => {
            this.updateGroup();
          }
        }
      ]
    });
  
    await alert.present();
  }
  

  updateGroup() {
    let formData = new FormData();
    formData.append('nombre', this.grupoSeleccionado.nombre);
    formData.append('descripcion', this.grupoSeleccionado.descripcion);

    fetch(`http://localhost:5000/maestro/update-group/${this.grupoSeleccionado.id}`, {
        method: 'PUT',
        body: formData,
        credentials: 'include',
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => Promise.reject(data));
        }
        return response.json();
    })
    .then(async data => {
        console.log('Group updated successfully:', data);
        
        const alert = await this.alertController.create({
            header: 'Cambios realizados',
            message: 'Los cambios se han efectuado en el grupo.',
            buttons: [{
                text: 'Aceptar',
                handler: () => {
                    this.setSixthOpen(false); 
                    this.errorMessage = ''; 
                    this.getGrupos();
                }
            }]
        });

        await alert.present();
    })
    .catch(async error => {
        console.error('Error updating group:', error);
        this.errorMessage = error.mensaje || 'Error al actualizar el grupo.';
    }); 
  }

  // AGM 08/02/2024 - Al iniciar la página, automáticamente obtiene los grupos del maestro
  ngOnInit() {
    this.getGrupos();
  }
}
