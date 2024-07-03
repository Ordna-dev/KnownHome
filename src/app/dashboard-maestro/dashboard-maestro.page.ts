import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular/standalone';
import { DashboardMaestroService } from '../services/dashboard-maestro.service'; 
import {
  IonMenu,
  IonHeader,
  IonAvatar,
  IonContent,
  IonText,
  IonIcon,
  IonRefresher,
  IonRefresherContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonButton,
  IonModal,
  IonToolbar,
  IonTitle,
  IonItem,
  IonTextarea,
  IonInput,
  IonSearchbar,
  IonButtons,
  IonMenuButton,
  IonLoading
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-dashboard-maestro',
  templateUrl: './dashboard-maestro.page.html',
  styleUrls: ['./dashboard-maestro.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, 
    IonMenu,
    IonHeader,
    IonAvatar,
    IonContent,
    IonText,
    IonIcon,
    IonRefresher,
    IonRefresherContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonButton,
    IonModal,
    IonToolbar,
    IonTitle,
    IonItem,
    IonTextarea,
    IonInput,
    IonSearchbar,
    IonButtons,
    IonMenuButton,
    IonLoading
  ]  
})
export class DashboardMaestroPage implements OnInit {
  groupName: string = '';
  groupDescription: string = '';
  message: string = '';
  password: string = '';
  grupos: any[] = []; 
  groupsModal: any[] = []; 
  username: string = '';
  students: any[] = [];
  inactiveStudents: any[] = [];
  studentUsername: string = '';
  studentPassword: string = '';
  showPassword: boolean = false;
  showPassword2: boolean = false;
  studentUsernameFile: string = '';
  studentPasswordFile: string = '';
  errorMessageArray: string[] = [];
  successMessageArray: string[] = [];
  errorMessage: string = '';
  selectedGroup: any = { id: null, nombre: '', descripcion: '' };
  selectedStudent: any = { id: null, username: '', password: '' };

  // AGM 30/01/2024 - Declaración de variables bandera para cerrar o abrir los modal
  isModalOpen = false;
  isSecondModalOpen = false;
  isThirdModalOpen = false; 
  isFourthModalOpen = false; 
  isFifthModalOpen = false;
  isSixthModalOpen = false;
  isSeventhModalOpen = false;
  isEighthModalOpen = false;
  isOptionsModalTeacherOpen = false;

  // AGM 30/01/2024 - Declarar la variable del archivo txt
  fileName: string | null = null;

  // AGM 30/01/2024 - Declarar la variable de alerta de ayuda
  helpMessage: string = `Nombre usuario, Contraseña.
  Alejandro Guerrero, Test12345?.
  Carlos Medina, Test12345?.`;

  // AGM 30/01/2024 - Constructor de los módulos a utilizar
  constructor(
    private alertController: AlertController, 
    private router: Router,
    private loadingCtrl: LoadingController,
    private dashboardMaestroService: DashboardMaestroService,
    private ngZone: NgZone
  ) {}

  // AGM 30/01/2024 - Abrir o cerrar el primer modal
  setOpen(isOpen: boolean) {
    this.errorMessage = "";
    this.groupName = '';
    this.groupDescription = '';
    this.isModalOpen = isOpen;
  }

  // AGM 30/01/2024 - Abrir o cerrar el segundo modal
  setSecondOpen(isOpen: boolean) {
    this.errorMessage = "";
    this.isSecondModalOpen = isOpen;
  }

  // AGM 30/01/2024 - Abrir o cerrar el tercer modal
  setThirdOpen(isOpen: boolean) {
    this.errorMessage = "";
    this.errorMessageArray = [];
    this.successMessageArray = [];
    this.fileName = null; 
    this.isThirdModalOpen = isOpen; 
  }

  // AGM 30/01/2024 - Abrir o cerrar el cuarto modal
  setFourthOpen(isOpen: boolean) {
    this.errorMessage = "";
    this.isFourthModalOpen = isOpen;
    this.getActiveStudents();
  }

  // AGM 31/01/2024 - Abrir o cerrar el quinto modal
  setFifthOpen(isOpen: boolean) {
    this.errorMessage = "";
    this.isFifthModalOpen = isOpen; 
  }

  // AGM 31/01/2024 - Abrir o cerrar el sexto modal
  setSixthOpen(isOpen: boolean) {
    console.log("Pasa por aqui 1")
    this.isSixthModalOpen = isOpen; 
    this.getGroupsForModal();
    this.errorMessage = "";
    console.log("Pasa por aqui 2")
  }

  //AGM 30/01/2024 - Cerrar el segundo modal cuando se abre el tercer modal
  handleDocumentIconClick() {
    this.errorMessage = "";
    this.setThirdOpen(true);   
  }

  setSeventhOpen(isOpen: boolean) {
    this.errorMessage = "";
    this.getActiveStudents();
    this.getInactiveStudents();
    this.isSeventhModalOpen = isOpen;
  }

  setEighthOpen(isOpen: boolean) {
    this.errorMessage = "";
    this.getActiveStudents();
    this.getInactiveStudents();
    this.isEighthModalOpen = isOpen;
  }

  setOptionsModalTeacherOpen(isOpen: boolean) {
    this.isOptionsModalTeacherOpen = isOpen;
  }
  
  // AGM 19/02/2024 - Refrescar pagina
  handleRefresh() {
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }

  // AGM 30/01/2024 - Redireccionamiento a perfil, grupo y login (Logout)
  async goToProfile() {
    this.setOptionsModalTeacherOpen(false);  
  
    const loading = await this.loadingCtrl.create({
      message: 'Cargando perfil...',
      duration: 2000  
    });
  
    await loading.present();

    setTimeout(() => {
      loading.dismiss();  
      this.router.navigateByUrl('/perfil', {skipLocationChange: true}).then(()=>
      this.router.navigate(['/perfil', { timestamp: Date.now() }]));
    }, 2000);
  }

  // AGM 20/06/2024 - Redireccionamiento al tutorial de dashboard del maestro
  async goToTutorialMaestroDashboard() {
    this.setOptionsModalTeacherOpen(false);
  
    const loading = await this.loadingCtrl.create({
      message: 'Cargando tutorial principal...',
      duration: 2000
    });
  
    await loading.present();
  
    setTimeout(() => {
      loading.dismiss();
      this.router.navigateByUrl('/tutorial-maestro-dashboard', {skipLocationChange: true}).then(() =>
        this.router.navigate(['/tutorial-maestro-dashboard', { timestamp: Date.now() }]));
    }, 2000);
  }
  
  async goToTutorialMaestroGrupos() {
    this.setOptionsModalTeacherOpen(false);
  
    const loading = await this.loadingCtrl.create({
      message: 'Cargando tutorial de grupos...',
      duration: 2000
    });
  
    await loading.present();
  
    setTimeout(() => {
      loading.dismiss();
      this.router.navigateByUrl('/tutorial-maestro-grupos', {skipLocationChange: true}).then(() =>
        this.router.navigate(['/tutorial-maestro-grupos', { timestamp: Date.now() }]));
    }, 2000);
  }  
  
  // AGM 20/06/2024 - Logout
  logOut() {
    this.setOptionsModalTeacherOpen(false);

    this.loadingCtrl.create({
      message: 'Cerrando sesión...'
    }).then(loading => {
      loading.present(); 
  
      this.dashboardMaestroService.logOutService().subscribe({
        next: (html) => {
          console.log(html); 
          loading.dismiss(); 
          this.router.navigateByUrl('/login', {skipLocationChange: true}).then(() =>
            this.router.navigate(['/login', { timestamp: Date.now() }]));
        },
        error: async (error) => {
          console.error('Error:', error);
          loading.dismiss(); 
          const alert = await this.alertController.create({
            header: 'Error al cerrar sesión:',
            message: 'No se pudo cerrar sesión correctamente debido a problemas de conexión. Por favor, inténtalo de nuevo o reinicie la aplicación.',
            buttons: ['Aceptar']
          });
          await alert.present();
        }
      });
    });
  }

  // AGM 17/02/2024 - Ir a un grupo especifico segun su id
  goToGroup(groupId: number) {
    this.setFifthOpen(false);
    this.loadingCtrl.create({
      message: 'Obteniendo información del grupo...'
    }).then(loading => {
      loading.present(); // Mostrar el recuadro de carga
  
      this.dashboardMaestroService.getGroupService(groupId).subscribe({
        next: (data) => {
          loading.dismiss(); // Ocultar el recuadro de carga independientemente del resultado
          if (data.error) {
            const alert = this.alertController.create({
              header: 'Error al obtener información del grupo:',
              message: data.mensaje,
              buttons: ['Aceptar']
            });
          } else {
            console.log('Grupo obtenido con éxito:', data.grupo);
            this.router.navigate(['/grupo-maestro'], { state: { groupId: groupId } });
          }
        },
        error: async (error) => {
          console.error('Error al obtener el grupo:', error.message);
          loading.dismiss(); 
          const alert = await this.alertController.create({
            header: 'Error al obtener información del grupo:',
            message: 'No se pudo obtener la información del grupo debido a problemas de conexión. Por favor, inténtalo de nuevo o reinicia la aplicación.',
            buttons: ['Aceptar']
          });
          await alert.present();
        }
      });
    });
  }

  async helpAlert() {
    const alert = await this.alertController.create({
      header: '¿Cómo debo estructurar mi texto del archivo .txt?',
      subHeader: 'El formato sugerido es el siguiente: ',
      message: this.helpMessage,
      buttons: ['Cerrar'],
    });
    await alert.present();
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
  async readAndDisplayFileContent() {
    this.errorMessageArray = [];
    this.successMessageArray = [];
    // Crear el recuadro de carga
    const loading = await this.loadingCtrl.create({
      message: 'Registrando alumnos en la plataforma...',
      spinner: 'circles',
    });
    
    await loading.present(); // Mostrar el recuadro de carga

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = fileInput.files ? fileInput.files[0] : null;

    if (file) {

      if (!file.name.endsWith('.txt')) {
        console.error('Archivo no soportado:', file.name);
        this.errorMessageArray = ['El archivo seleccionado no es un archivo .txt.'];

        await loading.dismiss();
        await this.presentErrorAlert('Por favor, selecciona un archivo .txt.');
        return;
      }

      const reader = new FileReader();

      reader.onload = async (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          const content = e.target.result as string;
          const lines = content.split('\n');
          const alumnos = lines.map(line => {
            const [studentUsernameFile, passwordWithDot] = line.split(',');
            if (studentUsernameFile && passwordWithDot) {
              const studentPasswordFile = passwordWithDot.replace('.', '').trim();
              return { username: studentUsernameFile.trim(), password: studentPasswordFile };
            }
            return null;
          }).filter(alumno => alumno !== null);

          // Enviar la lista de alumnos al servicio para registrarlos en masa
          this.dashboardMaestroService.registerStudentsBulkService(alumnos).subscribe({
            next: async (response) => {
              // Limpiar errores previos
              this.errorMessageArray = [];
              this.successMessageArray = [];

              // Procesar la respuesta para encontrar éxitos y errores
              response.forEach((item: any) => {
                if (item.message === "Alumno registrado exitosamente") {
                  // Si hay un mensaje de éxito, añadir al array de éxitos
                  this.successMessageArray.push(`${item.username}: ${item.message}`);
                } else if (item.error) {
                  // Si hay un error, añadir al array de errores
                  this.errorMessageArray.push(`${item.username}: ${item.error}`);
                }
              });

              console.log(this.successMessageArray);
              console.log(this.errorMessageArray);

              // Despedir el recuadro de carga al completar la operación
              await loading.dismiss();

              // Si hay errores, actualiza la propiedad del componente con ellos y muestra en plantilla
              // Si no hay errores, muestra la alerta de éxito
              if (this.errorMessageArray.length > 0) {
                await this.presentErrorAlert('Hubo errores al registrar algunos alumnos.');
              } else {
                await this.presentAlertSuccess();
              }
            },
            error: async (err) => {
              console.error('Error al registrar alumnos:', err);
              // Actualizar la propiedad del componente con el mensaje de error general
              this.errorMessageArray = ['Error al registrar los alumnos, revisa tu archivo de texto y consulta ayuda'];
              
              // Despedir el recuadro de carga al completar la operación
              await loading.dismiss();

              await this.presentErrorAlert('Error al registrar los alumnos.');
            }
          });
        }
      };

      reader.onerror = async (error) => {
        console.error('Error al leer el archivo:', error);
        // Actualizar la propiedad del componente con el mensaje de error de lectura
        this.errorMessageArray = ['Error al leer el archivo. Asegúrate de que el formato sea correcto.'];

        // Despedir el recuadro de carga al completar la operación
        await loading.dismiss();

        await this.presentErrorAlert('Error al leer el archivo.');
      };

      // Comienza la lectura del archivo
      reader.readAsText(file);
    } else {
      console.error('No se ha seleccionado ningún archivo.');
      // Actualizar la propiedad del componente para reflejar que no se seleccionó un archivo
      this.errorMessageArray = ['No se ha seleccionado ningún archivo.'];

      // Despedir el recuadro de carga si no hay archivo
      await loading.dismiss();

      await this.presentErrorAlert('No se ha seleccionado ningún archivo.');
    }
  }

  async presentAlertSuccess() {
    const alert = await this.alertController.create({
      header: 'Registro Exitoso:',
      message: 'Los alumnos han sido registrados exitosamente, no olvides consultar tu archivo de texto para proporcionar credenciales',
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

    this.loadingCtrl.create({
        message: 'Registrando al alumno...'
    }).then(loading => {
        loading.present();

        this.dashboardMaestroService.registerStudentService(this.studentUsername, this.studentPassword).subscribe({
          next: async (response) => {
            loading.dismiss();
            if (response.error) {
              this.errorMessage = response.message;
              const errorAlert = await this.alertController.create({
                header: 'Error en el registro del alumno:',
                message: this.errorMessage,
                buttons: ['Aceptar'],
                backdropDismiss: false
              });
              await errorAlert.present();
            } else {
              this.studentUsername = '';
              this.studentPassword = '';

              const finalizeRegistration = () => {
                this.setSecondOpen(false);
                this.errorMessage = '';
              };

              const successAlert = await this.alertController.create({
                header: 'Operación exitosa:',
                message: 'El alumno ha sido registrado en el sistema.',
                buttons: [{
                  text: 'Aceptar',
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
            loading.dismiss(); 
            console.error('Error from server:', error);
            this.errorMessage = error.error?.message || 'No se pudo obtener la registrar al alumno debido a problemas de conexión. Por favor, inténtalo de nuevo o reinicia la aplicación.';

            const errorAlert = await this.alertController.create({
              header: 'Error en el registro del alumno:',
              message: this.errorMessage,
              buttons: ['Aceptar'],
              backdropDismiss: false
            });
            await errorAlert.present();
          }
        });
    });
  }

  // AGM 17/06/2024 - Ver contraseña del alumno
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // AGM 17/06/2024 - Ver contraseña del alumno cuando se editan sus credenciales
  togglePasswordVisibilityFromEditingStudent() {
    this.showPassword2 = !this.showPassword2;
  }

  // AGM 08/02/2024 - Crear un grupo (maestro)
  createGroup() {
    this.loadingCtrl.create({
      message: 'Creando grupo...'
    }).then(loading => {
      loading.present();
  
      this.dashboardMaestroService.createGroupService(this.groupName, this.groupDescription).subscribe({
        next: async (data) => {
          loading.dismiss();
          if (!data.error) {
            this.errorMessage = '';
            const groupNameTemp = this.groupName;
    
            this.groupName = '';
            this.groupDescription = '';
    
            const handleClose = () => {
              this.setOpen(false);
              this.getGroups();
              this.getGroupsForModal();
            };
    
            const alert = await this.alertController.create({
              header: 'El grupo ha sido creado con éxito:',
              message: `El grupo "${groupNameTemp}" ha sido creado. El código de acceso del grupo es: ${data.codigo_acceso}`,
              buttons: [{
                text: 'OK',
                handler: () => handleClose()
              }],
              backdropDismiss: false
            });
    
            alert.onDidDismiss().then((detail) => {
              if (detail.role === 'backdrop') {
                handleClose();
              }
            });
    
            await alert.present();
          } else {
            this.errorMessage = data.message;
            const errorAlert = await this.alertController.create({
              header: 'Error al crear el grupo:',
              message: this.errorMessage,
              buttons: ['Aceptar']
            });
            await errorAlert.present();
          }
        },
        error: async (error) => {
          loading.dismiss(); 
          this.errorMessage = 'Error de conexión';
          const connectionAlert = await this.alertController.create({
            header: 'Error de conexión:',
            message: 'Hay problemas de conexión a la hora de crear el grupo. Por favor, inténtalo de nuevo o reinicia la aplicación.',
            buttons: ['Aceptar']
          });
          await connectionAlert.present();
        }
      });
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
    this.loadingCtrl.create({
      message: 'Eliminando grupo...'
    }).then(loading => {
      loading.present(); 
  
      this.dashboardMaestroService.deleteGroupService(groupId).subscribe({
        next: async (data) => {
          console.log('Grupo eliminado con éxito:', data);
          loading.dismiss(); 
  
          this.getGroupsForModal();
          this.getGroups();
  
          const handleAlertClose = () => {
            this.getGroupsForModal();
            this.getGroups();
          };
  
          const alert = await this.alertController.create({
            header: 'Operación exitosa:',
            message: 'El grupo ha sido eliminado.',
            buttons: [{
              text: 'Aceptar',
              handler: () => handleAlertClose()
            }],
            backdropDismiss: false
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
          loading.dismiss(); // También ocultar el recuadro de carga en caso de error
  
          // Crear y mostrar una alerta de error
          const errorAlert = await this.alertController.create({
            header: 'Error al eliminar el grupo:',
            message: 'No se pudo eliminar el grupo debido a problemas de conexión. Por favor, inténtalo de nuevo más tarde o reinicia la aplicación.',
            buttons: ['Aceptar']
          });
          await errorAlert.present();
        }
      });
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
    this.loadingCtrl.create({
        message: 'Actualizando grupo...'
    }).then(loading => {
        loading.present(); // Mostrar el recuadro de carga

        this.dashboardMaestroService.updateGroupService(this.selectedGroup.id, this.selectedGroup.nombre, this.selectedGroup.descripcion)
            .subscribe({
                next: async (data) => {
                    console.log('Group updated successfully:', data);
                    loading.dismiss();

                    const handleAlertClose = () => {
                      this.ngZone.run(() => {
                        this.errorMessage = '';
                        this.getGroups();
                        this.getGroupsForModal();
                        this.setSixthOpen(false); // Asegurar que Angular detecta el cambio
                      });
                    };

                    const alert = await this.alertController.create({
                        header: 'Cambios realizados',
                        message: 'Los cambios se han efectuado en el grupo.',
                        buttons: [{
                            text: 'Aceptar',
                            handler: () => handleAlertClose()
                        }],
                        backdropDismiss: false
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
                    loading.dismiss(); // También ocultar el recuadro de carga en caso de error

                    this.errorMessage = error.error && error.error.mensaje ? error.error.mensaje : 'Hay problemas de conexión a la hora de modificar la información del grupo. Por favor, inténtalo de nuevo o reinicia la aplicación.';
                    const errorMessageFromEditGroup = error.error && error.error.mensaje ? error.error.mensaje : 'Hay problemas de conexión a la hora de modificar la información del grupo. Por favor, inténtalo de nuevo o reinicia la aplicación.';
                    const alert = await this.alertController.create({
                        header: 'Error al actualizar la información del grupo:',
                        message: `${errorMessageFromEditGroup}`,
                        buttons: ['Aceptar'],
                        cssClass: 'error-alert'
                    });

                    await alert.present();
                }
            });
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

  getGroupsForModal() { // Nuevo método para obtener los grupos del modal
    this.dashboardMaestroService.getGroupsService().subscribe({
      next: (json) => {
        console.log(json);
        this.groupsModal = json.grupos; // Guardar los grupos en la nueva lista
      },
      error: (error) => console.error('Error al obtener los grupos para el modal:', error)
    });
  }

  // AGM 13/02/2024 - Buscar los grupos creados o administrados por el maestro
  handleSearchInput(event: CustomEvent) {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    if (query && query.trim() !== '') {
      this.dashboardMaestroService.getGroupsByQuery(query).subscribe({
        next: (response) => {
          if (!response.error) {
            console.log(this.grupos);
            this.grupos = response.grupos;
          } else {
            this.grupos = [];
            console.error(response.message || 'No se encontraron grupos.');
          }
        },
        error: (error) => console.error('Error al buscar grupos:', error),
      });
    } else {
      this.getGroups();  
    }
  }

  // AGM 06/06/2024 - Nuevo método para manejar la búsqueda en el modal
  handleModalSearchInput(event: CustomEvent) {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    if (query && query.trim() !== '') {
      this.dashboardMaestroService.getGroupsByQuery(query).subscribe({
        next: (response) => {
          if (!response.error) {
            console.log(this.groupsModal);
            this.groupsModal = response.grupos;
          } else {
            this.groupsModal = [];
            console.error(response.message || 'No se encontraron grupos.');
          }
        },
        error: (error) => console.error('Error al buscar grupos:', error),
      });
    } else {
      this.getGroupsForModal();  
    }
  }

  // AGM 04/06/2024 - Mostrar los alumnos activos registrados por el maestro
  getActiveStudents() {
    this.dashboardMaestroService.getActiveStudents().subscribe({
      next: (response) => {
        console.log('Response received:', response); 
        if (!response.error) {
          this.students = response.estudiantes;
          console.log('Active students found:', this.students); 
        } else {
          this.students = [];
          console.error(response.message || 'No se encontraron alumnos activos.');
          console.log('No active students found or error:', response.message); 
        }
      },
      error: (error) => {
        console.error('Error al buscar alumnos activos:', error);
        console.log('HTTP request error:', error); 
      },
    });
  }

  // AGM 04/06/2024 - Buscar los alumnos activos registrados por el maestro
  handleSearchInputStudents(event: CustomEvent) {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    if (query && query.trim() !== '') {
        this.dashboardMaestroService.getStudentsByQuery(query).subscribe({
            next: (response) => {
                if (!response.error) {
                    console.log('Students found:', response.estudiantes);
                    this.students = response.estudiantes;
                } else {
                    this.students = [];
                    console.error(response.message || 'No se encontraron alumnos.');
                }
            },
            error: (error) => console.error('Error al buscar alumnos:', error),
        });
    } else {
        this.getActiveStudents();
    }
  }

  // AGM 04/06/2024 - Dar de baja a los alumnos
  async deleteStudent(studentId: number) {
    const confirmAlert = await this.alertController.create({
        header: 'Confirmar eliminación',
        message: '¿Está seguro de dar de baja al alumno de la plataforma?',
        buttons: [
            {
                text: 'No',
                role: 'cancel',
                handler: () => {
                    console.log('Cancelado');
                },
            },
            {
                text: 'Sí',
                handler: async () => {
                    const loading = await this.loadingCtrl.create({
                        message: 'Eliminando alumno...'
                    });
                    await loading.present();

                    console.log('Eliminando alumno con ID:', studentId);
                    try {
                        await this.dashboardMaestroService.deactivateStudent(studentId).toPromise();
                        this.getActiveStudents();

                        const successAlert = await this.alertController.create({
                            header: 'Operación exitosa:',
                            message: 'Este estudiante ha sido dado de baja.',
                            buttons: ['Aceptar'],
                            backdropDismiss: false
                        });
                        await successAlert.present();
                    } catch (error) {
                        console.error('Error al eliminar al alumno:', error);
                        await this.alertController.create({
                            header: 'Error:',
                            message: 'Hay problemas de conexión a la hora de dar de baja al alumno. Por favor, inténtalo de nuevo o reinicia la aplicación.',
                            buttons: ['Aceptar']
                        }).then(alert => alert.present());
                    } finally {
                        await loading.dismiss();
                    }
                },
            },
        ],
    });
    await confirmAlert.present();
  }

  // AGM 04/06/2024 - Editar las credenciales del estudiante
  prepareEditStudentCredentials(studentId: number) {
    const student = this.students.find(s => s.id === studentId);
    if (student) {
      this.selectedStudent = { ...student };
      this.setEighthOpen(true);
    }
  }

  // AGM 04/06/2024 - Editar las credenciales del estudiante, parte 2
  async modifyStudentCredentials() {
    if (!this.selectedStudent.username.trim() || !this.selectedStudent.password) {
      this.errorMessage = 'Por favor, rellene todos los campos.';
      return;
    }
  
    this.confirmModifyCredentials();
  }
  
  // AGM 04/06/2024 - Editar las credenciales del estudiante, parte 3
  async confirmModifyCredentials() {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Está seguro de editar las credenciales de este alumno?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Continuar',
          role: 'confirm',
          handler: () => {
            this.modifyStudentCredentialsConfirmed();
          }
        }
      ]
    });
  
    await alert.present();
  }

  // AGM 04/06/2024 - Lógica al editar las credenciales del estudiante
  async modifyStudentCredentialsConfirmed() {
    const loading = await this.loadingCtrl.create({
        message: 'Actualizando credenciales del alumno...'
    });
    await loading.present(); 

    try {
        const response = await this.dashboardMaestroService.editStudentCredentials(
            this.selectedStudent.id,
            this.selectedStudent.username,
            this.selectedStudent.password
        ).toPromise();

        if (response.error) {
            throw new Error(response.message || 'Error desconocido');
        }

        const finalizeModification = () => {
          this.ngZone.run(() => {
            this.setEighthOpen(false);
            this.errorMessage = '';
          });
        };

        const successAlert = await this.alertController.create({
            header: 'Operación exitosa:',
            message: 'El alumno ha sido actualizado exitosamente.',
            buttons: [{
                text: 'Aceptar',
                role: 'confirm',
                handler: () => finalizeModification()
            }],
            backdropDismiss: false
        });

        successAlert.onDidDismiss().then((detail) => {
            if (detail.role === 'backdrop' || detail.role === 'cancel' || detail.role === 'confirm') {
                finalizeModification();
            }
        });

        await successAlert.present();
    } catch (error) {
        console.error('Error from server:', error);
        const errorMessageFromServer = this.extractErrorMessage(error);
        this.errorMessage = errorMessageFromServer;
        await this.presentErrorAlert(errorMessageFromServer);
    } finally {
        await loading.dismiss();
    }
  }

  // AGM 04/06/2024 - Extraer el error de raiz de parte del server
  extractErrorMessage(error: any): string {
    if (error && error.error && typeof error.error.message === 'string') {
      return error.error.message;
    } else if (error instanceof Error) {
      return error.message;
    } else {
      return 'Hay problemas de conexión a la hora de modificar la información del alumno. Por favor, inténtalo de nuevo o reinicia la aplicación.';
    }
  }

  // AGM 04/06/2024 - Alerta de error a la hora de manipular las crdenciales de un alumno
  async presentErrorAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error al actualizar las credenciales del alumno:',
      message: message,
      buttons: ['Aceptar']
    });

    await alert.present();
  }

  // AGM 04/06/2024 - Obtener lista de alumnos inactivos
  getInactiveStudents() {
    this.dashboardMaestroService.getInactiveStudents().subscribe({
      next: (response) => {
        console.log('Response received:', response);
        if (!response.error) {
          this.inactiveStudents = response.estudiantes;
          console.log('Inactive students found:', this.inactiveStudents);
        } else {
          this.inactiveStudents = [];
          console.error(response.message || 'No se encontraron alumnos inactivos.');
        }
      },
      error: (error) => {
        console.error('Error al buscar alumnos inactivos:', error);
      },
    });
  }

  // AGM 04/06/2024 - Buscar alumnos inactivos
  handleSearchInputInactiveStudents(event: CustomEvent) {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    if (query && query.trim() !== '') {
      this.dashboardMaestroService.getInactiveStudentsByQuery(query).subscribe({
        next: (response) => {
          if (!response.error) {
            console.log('Inactive students found:', response.estudiantes);
            this.inactiveStudents = response.estudiantes;
          } else {
            this.inactiveStudents = [];
            console.error(response.message || 'No se encontraron alumnos inactivos.');
          }
        },
        error: (error) => console.error('Error al buscar alumnos inactivos:', error),
      });
    } else {
      this.getInactiveStudents();
    }
  }

  // AGM 04/06/2024 - Dar de alta a estudiante que ha sido dado de baja
  async reactivateStudent(studentId: number) {
    console.log('Reactivating student with ID:', studentId);
    const confirmAlert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Está seguro de dar de alta al alumno?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          },
        },
        {
          text: 'Sí',
          handler: async () => { 
            const loading = await this.loadingCtrl.create({
              message: 'Reactivando alumno...'
            });
            await loading.present();

            this.dashboardMaestroService.activateStudent(studentId).subscribe({
              next: async (response) => {
                await loading.dismiss(); 
                if (!response.error) {
                  const reactivationAlert = await this.alertController.create({
                    header: 'Operación exitosa:',
                    message: 'El alumno ha sido dado de alta.',
                    buttons: ['Aceptar'],
                    backdropDismiss: false
                  });
                  await reactivationAlert.present();
                  console.log(`Student with ID ${studentId} reactivated`);
                  this.getInactiveStudents();
                } else {
                  console.error('Error reactivating student:', response.message);
                  await this.presentErrorAlert('Error al reactivar el alumno: ' + response.message);
                }
              },
              error: async (error) => {
                await loading.dismiss(); 
                console.error('Error reactivating student:', error);
                await this.presentErrorAlertUp('Error de conexión al reactivar al alumno. Por favor, inténtelo de nuevo o reinicie la aplicación.');
              }
            });
          },
        },
      ],
    });

    await confirmAlert.present();
  }

  // AGM 04/06/2024 - Error al reactivar al alumno
  async presentErrorAlertUp(message: string) {
      const errorAlert = await this.alertController.create({
        header: 'Error al reactivar al alumno:',
        message: message,
        buttons: ['OK']
      });
      await errorAlert.present();
  }

  updatePage() {
    this.loadingCtrl.create({
      message: 'Cargando datos...',
      spinner: 'circles'
    }).then(loading => {
      loading.present(); // Mostrar el recuadro de carga
  
      const groupsPromise = this.dashboardMaestroService.getGroupsService().toPromise();
      const activeStudentsPromise = this.dashboardMaestroService.getActiveStudents().toPromise();
      const inactiveStudentsPromise = this.dashboardMaestroService.getInactiveStudents().toPromise();
  
      Promise.all([groupsPromise, activeStudentsPromise, inactiveStudentsPromise])
        .then(([groupsResponse, activeStudentsResponse, inactiveStudentsResponse]) => {
          if (!groupsResponse.error) {
            this.grupos = groupsResponse.grupos;
            this.username = groupsResponse.username;
            console.log('Grupos:', this.grupos);
          } else {
            console.error('Error al cargar grupos:', groupsResponse.error);
          }
  
          if (!activeStudentsResponse.error) {
            this.students = activeStudentsResponse.estudiantes;
            console.log('Estudiantes activos:', this.students);
          } else {
            console.error('Error al cargar estudiantes activos:', activeStudentsResponse.error);
            this.students = [];
          }
  
          if (!inactiveStudentsResponse.error) {
            this.inactiveStudents = inactiveStudentsResponse.estudiantes;
            console.log('Estudiantes inactivos:', this.inactiveStudents);
          } else {
            console.error('Error al cargar estudiantes inactivos:', inactiveStudentsResponse.error);
            this.inactiveStudents = [];
          }
  
          loading.dismiss(); 
        })
        .catch(error => {
          console.error('Error durante la carga de datos:', error);
          loading.dismiss(); 
          this.presentNetworkErrorAlert(); 
        });
    });
  }

  async presentNetworkErrorAlert() {
    const alert = await this.alertController.create({
        header: 'Error de conexión:',
        message: 'Error de conexión al actualizar la información del dashboard. Por favor, intente de nuevo o reinicie la aplicación.',
        buttons: ['Aceptar']
    });
    await alert.present();
  }

  // AGM 08/02/2024 - Al iniciar la página, automáticamente obtiene los grupos del maestro
  ngOnInit() {
    this.getGroups();
    this.getGroupsForModal();
    this.getActiveStudents();
    this.getInactiveStudents();
  }
}