import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular/standalone';
import { DashboardMaestroService } from '../services/dashboard-maestro.service'; 

@Component({
  selector: 'app-dashboard-maestro',
  templateUrl: './dashboard-maestro.page.html',
  styleUrls: ['./dashboard-maestro.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class DashboardMaestroPage implements OnInit {
  groupName: string = '';
  groupDescription: string = '';
  message: string = '';
  password: string = '';
  grupos: any[] = []; 
  username: string = '';
  studentUsername: string = '';
  studentPassword: string = '';
  studentUsernameFile: string = '';
  studentPasswordFile: string = '';
  errorMessageArray: string[] = [];
  errorMessage: string = '';
  selectedGroup: any = { id: null, nombre: '', descripcion: '' };

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

  // AGM 30/01/2024 - Constructor de los módulos a utilizar
  constructor(
    private alertController: AlertController, 
    private router: Router,
    private dashboardMaestroService: DashboardMaestroService
  ) {}
  
  // AGM 19/02/2024 - Refrescar pagina
  handleRefresh() {
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }

  // AGM 30/01/2024 - Redireccionamiento a perfil, grupo y login (Logout)
  goToProfile() {
    this.router.navigate(['/perfil']);
  }
  
  // Reemplazando fetch en cerrarSesion por el método del servicio
  logOut() {
    this.dashboardMaestroService.logOutService().subscribe({
      next: (html) => {
        console.log(html); // Mostrar la respuesta HTML en consola
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }

  // AGM 17/02/2024 - Ir a un grupo especifico segun su id
  goToGroup(groupId: number) {
    this.setFifthOpen(false);
    this.dashboardMaestroService.getGroupService(groupId).subscribe({
      next: (data) => {
        if (data.error) {
          console.error('Error:', data.mensaje);
        } else {
          console.log('Grupo obtenido con éxito:', data.grupo);
          
          this.router.navigate(['/grupo-maestro'], { state: { groupId: groupId } });
        }
      },
      error: (error) => {
        console.error('Error al obtener el grupo:', error.message);
      }
    });
  }

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

  //AGM 30/01/2024 - Manejar la selección del archivo txt de los alumnos
  handleFileInput(event: Event) {
    const element = event.target as HTMLInputElement;
    const files = element.files;
    if (files && files.length > 0) {
      const file = files[0];
      this.fileName = file.name; 
    } else {
      this.fileName = null; 
    }
  }

  // AGM 30/01/2024 - Función para leer y mostrar el contenido del archivo txt
  readAndDisplayFileContent() {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = fileInput.files ? fileInput.files[0] : null;
  
    if (file) {
      const reader = new FileReader();
  
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          const content = e.target.result as string;
          
          // Separa el contenido por líneas y luego procesa cada línea
          const lines = content.split('\n');
          const alumnos = lines.map(line => {
            const [studentUsernameFile, passwordWithDot] = line.split(',');
            if (studentUsernameFile && passwordWithDot) {
              // Quita el punto del final de la contraseña y devuelve un objeto
              const studentPasswordFile = passwordWithDot.replace('.', '').trim();
              return { username: studentUsernameFile.trim(), password: studentPasswordFile };
            }
            // Si no hay username o passwordWithDot, retorna null para ser filtrado después
            return null;
          }).filter(alumno => alumno !== null); // Filtra elementos nulos

          this.dashboardMaestroService.registerStudentsBulkService(alumnos).subscribe({
            next: (response) => {
              // Limpiar errores previos
              this.errorMessageArray = [];
          
              // Asumiendo que la respuesta es un array de resultados
              response.forEach((resultado: any) => {
                if (resultado.error) {
                  // Si hay un error, añadir el mensaje de error al array
                  this.errorMessageArray.push(`${resultado.username}: ${resultado.error}`);
                }
              });
          
              if (this.errorMessageArray.length > 0) {
                // Si hay errores, mostrar la alerta de error
                this.presentAlertError();
              } else {
                // Si no hay errores, mostrar la alerta de éxito
                this.presentAlertSuccess();
              }
            },
            error: (err) => {
              console.error('Error al registrar alumnos:', err);
              this.presentAlertError();
            }
          });
          
  
          const json = {
            alumnos: alumnos
          };
  
          console.log(JSON.stringify(json, null, 2));
        }
      };
  
      reader.onerror = (error) => {
        console.error('Error al leer el archivo:', error);
      };
  
      reader.readAsText(file);
    } else {
      console.error('No se ha seleccionado ningún archivo.');
    }
  }  

  async presentAlertSuccess() {
    const alert = await this.alertController.create({
      header: 'Registro Exitoso',
      message: 'Los alumnos han sido registrados exitosamente, no olvides consultar tu archivo de texto para proporcionar credenciales',
      buttons: ['Aceptar']
    });
  
    await alert.present();
  }
  
  async presentAlertError() {
    const errorMessage = this.errorMessageArray.join('<br/>'); // Unir los mensajes de error con saltos de línea en HTML
  
    const alert = await this.alertController.create({
      header: 'Errores en el Registro',
      message: `Se encontraron errores al registrar algunos alumnos:<br/>${errorMessage}`,
      buttons: ['Aceptar']
    });
  
    await alert.present();
  }

  // AGM 17/02/2024 - Método para registrar un alumno
  registerStudent() {
    if (!this.studentUsername.trim() || !this.studentPassword) {
      this.errorMessage = 'Por favor, rellene todos los campos.';
      return;
    }

    this.dashboardMaestroService.registerStudentService(this.studentUsername, this.studentPassword).subscribe({
      next: async (response) => {
        if (response.error) {
          this.errorMessage = response.message;
        } else {
          this.studentUsername = '';
          this.studentPassword = '';

          const finalizeRegistration = () => {
            this.setSecondOpen(false);
            this.errorMessage = '';
          };

          const successAlert = await this.alertController.create({
            header: 'Operación exitosa',
            message: 'El alumno ha sido registrado en el sistema.',
            buttons: [{
              text: 'OK',
              role: 'confirm',
              handler: () => finalizeRegistration()
            }],
            backdropDismiss: true 
          });

          successAlert.onDidDismiss().then((detail) => {
            if (detail.role === 'backdrop' || detail.role === 'cancel' || detail.role === 'confirm') {
              finalizeRegistration();
            }
          });

          await successAlert.present();
        }
      },
      error: async (error) => {
        console.error('Error from server:', error);
        this.errorMessage = error.error?.message || 'Error al registrar al alumno.';
      }
    });
  }

  // AGM 08/02/2024 - Crear un grupo (maestro)
  createGroup() {
    this.dashboardMaestroService.createGroupService(this.groupName, this.groupDescription).subscribe({
      next: async (data) => {
        if (!data.error) {
          this.message = '';
          this.groupName = '';
          this.groupDescription = '';
  
          const handleClose = () => {
            this.setOpen(false);
            this.getGroups();
          };
  
          const alert = await this.alertController.create({
            header: 'Grupo Creado',
            message: `El código de acceso del grupo es: ${data.codigo_acceso}`,
            buttons: [{
              text: 'OK',
              handler: () => handleClose()
            }],
            backdropDismiss: true
          });
  
          alert.onDidDismiss().then((detail) => {
            if (detail.role === 'backdrop') {
              handleClose();
            }
          });
  
          await alert.present();
        } else {
          this.message = data.message;
        }
      },
      error: async (error) => {
        this.message = 'Error al conectar con el servidor';
      }
    });
  }  

  // AGM 11/02/2024 - Alerta antes de eliminar x grupo
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
  
  // AGM 11/02/2024 - Lógica a la hora de eliminar el grupo
  deleteGroup(groupId: number) {
    this.dashboardMaestroService.deleteGroupService(groupId).subscribe({
      next: async (data) => {
        console.log('Grupo eliminado con exito:', data);
  
        const handleAlertClose = () => {
          this.getGroups();
        };
  
        const alert = await this.alertController.create({
          header: 'Grupo eliminado',
          message: 'El grupo ha sido eliminado.',
          buttons: [{
            text: 'Aceptar',
            handler: () => handleAlertClose()
          }],
          backdropDismiss: true
        });
  
        alert.onDidDismiss().then((detail) => {
          if (detail.role === 'backdrop' || detail.role === 'cancel') {
            handleAlertClose();
          }
        });
  
        await alert.present();
      },
      error: async (error) => {
        console.error('Error al eliminar el grupo:', error);
      }
    });
  }  

  // AGM 11/02/2024 - Función para abrir el modal de edición y preparar los datos del grupo seleccionado
  prepareEditGroup(groupId: number) {
    const grupo = this.grupos.find(g => g.id === groupId);
    if(grupo) {
      this.selectedGroup = {...grupo}; 
      console.log('Editando el grupo con el ID:', this.selectedGroup.id); 
      this.setSixthOpen(true); 
    }
  }

  // AGM 11/02/2024 - Función para confirmar si se quiere efectuar la edicion de grupo
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
  
  // AGM 11/02/2024 - Lógica de edición de grupo
  updateGroup() {
    this.dashboardMaestroService.updateGroupService(this.selectedGroup.id, this.selectedGroup.nombre, this.selectedGroup.descripcion)
      .subscribe({
        next: async (data) => {
          console.log('Group updated successfully:', data);
  
          const handleAlertClose = () => {
            this.setSixthOpen(false);
            this.errorMessage = '';
            this.getGroups();
          };
  
          const alert = await this.alertController.create({
            header: 'Cambios realizados',
            message: 'Los cambios se han efectuado en el grupo.',
            buttons: [{
              text: 'Aceptar',
              handler: () => handleAlertClose()
            }],
            backdropDismiss: true
          });
  
          alert.onDidDismiss().then((detail) => {
            if (detail.role === 'backdrop' || detail.role === 'cancel') {
              handleAlertClose();
            }
          });
  
          await alert.present();
        },
        error: async (error) => {
          console.error('Error updating group:', error);
          this.errorMessage = error.error.message || 'Error al actualizar el grupo.';
        }
      });
  }  

  // AGM 13/02/2024 - Obtener los grupos creados o administrados por el maestro
  getGroups() {
    this.dashboardMaestroService.getGroupsService().subscribe({
      next: (json) => {
        console.log(json);
        this.grupos = json.grupos;
        this.username = json.username;
      },
      error: (error) => console.error('Error al obtener los grupos:', error)
    });
  }

  // AGM 08/02/2024 - Al iniciar la página, automáticamente obtiene los grupos del maestro
  ngOnInit() {
    this.getGroups();
  }
}