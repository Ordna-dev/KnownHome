import { Component, OnInit } from '@angular/core';
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
  IonButtons
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-dashboard-maestro',
  templateUrl: './dashboard-maestro.page.html',
  styleUrls: ['./dashboard-maestro.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, // Si estás usando ngModel dentro de tu plantilla
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
    IonButtons
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

  // AGM 30/01/2024 - Declarar la variable del archivo txt
  fileName: string | null = null;

  // AGM 30/01/2024 - Declarar la variable de alerta de ayuda
  helpMessage: string = `Nombre usuario, Contraseña.
  Alejandro Guerrero, Test12345?.
  Carlos Daniel Medina, Test12345?.`;

  // AGM 30/01/2024 - Constructor de los módulos a utilizar
  constructor(
    private alertController: AlertController, 
    private router: Router,
    private loadingCtrl: LoadingController,
    private dashboardMaestroService: DashboardMaestroService
  ) {}

  // AGM 30/01/2024 - Abrir o cerrar el primer modal
  setOpen(isOpen: boolean) {
    this.errorMessage = "";
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
    this.getGroupsForModal();
    this.errorMessage = "";
    this.isSixthModalOpen = isOpen; 
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
  
  // AGM 19/02/2024 - Refrescar pagina
  handleRefresh() {
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }

  // AGM 30/01/2024 - Redireccionamiento a perfil, grupo y login (Logout)
  goToProfile() {
    this.router.navigateByUrl('/perfil', {skipLocationChange: true}).then(()=>
    this.router.navigate(['/perfil', { timestamp: Date.now() }]));
  }

  // AGM 20/06/2024 - Redireccionamiento al tutorial de dashboard del maestro
  goToTutorialMaestroDashboard() {
    this.router.navigateByUrl('/tutorial-maestro-dashboard', {skipLocationChange: true}).then(()=>
    this.router.navigate(['/tutorial-maestro-dashboard', { timestamp: Date.now() }]));
  }

  // AGM 20/06/2024 - Redireccionamiento al tutorial de grupos del maestro
  goToTutorialMaestroGrupos() {
    this.router.navigateByUrl('/tutorial-maestro-grupos', {skipLocationChange: true}).then(()=>
    this.router.navigate(['/tutorial-maestro-grupos', { timestamp: Date.now() }]));
  }
  
  // Reemplazando fetch en cerrarSesion por el método del servicio
  logOut() {
    this.dashboardMaestroService.logOutService().subscribe({
      next: (html) => {
        console.log(html); // Mostrar la respuesta HTML en consola
        this.router.navigateByUrl('/login', {skipLocationChange: true}).then(()=>
        this.router.navigate(['/login', { timestamp: Date.now() }]));
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
    // Crear el recuadro de carga
    const loading = await this.loadingCtrl.create({
      message: 'Registrando alumnos en la plataforma...',
      spinner: 'circles',
    });
    
    await loading.present(); // Mostrar el recuadro de carga

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = fileInput.files ? fileInput.files[0] : null;

    if (file) {
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
      header: 'Registro Exitoso',
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
    this.dashboardMaestroService.createGroupService(this.groupName, this.groupDescription).subscribe({
      next: async (data) => {
        if (!data.error) {
          this.errorMessage = '';
          // Guarda el nombre del grupo antes de restablecer los campos
          const groupNameTemp = this.groupName;
  
          // Restablece los campos
          this.groupName = '';
          this.groupDescription = '';
  
          const handleClose = () => {
            this.setOpen(false);
            this.getGroups();
            this.getGroupsForModal();
          };
  
          // Crea el alert con el nombre del grupo
          const alert = await this.alertController.create({
            header: 'El grupo ha sido creado con éxito',
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
        }
      },
      error: async (error) => {
        this.errorMessage = 'Error al conectar con el servidor';
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

        this.getGroupsForModal();
        this.getGroups();
  
        const handleAlertClose = () => {
          this.getGroupsForModal();
          this.getGroups();
        };
  
        const alert = await this.alertController.create({
          header: 'Grupo eliminado',
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
            this.getGroupsForModal();
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
  
          // Accede correctamente al mensaje de error
          const errorMessageFromEditGroup = error.error && error.error.mensaje ? error.error.mensaje : 'Error al actualizar la información del grupo.';
  
          const alert = await this.alertController.create({
            header: 'Error',
            message: `Error al actualizar la información del grupo: ${errorMessageFromEditGroup}`,
            buttons: ['Aceptar'],
            cssClass: 'error-alert' // Añade una clase CSS personalizada
          });
  
          await alert.present();
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

  // AGM 17/06/2024 - Invocacion del metodo de partición de string de la descripcion
  getSplitDescription(description: string, length: number): string[] {
    return this.splitDescription(description, length);
  }

  // AGM 17/06/2024 - Hacer que la descripción de particione en máximo 20 caracteres
  splitDescription(description: string, length: number): string[] {
    const result = [];
    let startIndex = 0;
    let endIndex = length;

    while (startIndex < description.length) {
      // Encuentra el último espacio en el rango actual
      let sliceEnd = description.lastIndexOf(' ', endIndex);
      // Si no hay espacio, corta en el final del rango
      if (sliceEnd === -1 || sliceEnd <= startIndex) {
        sliceEnd = endIndex;
      }

      // Añadir el segmento a la lista de resultados
      result.push(description.slice(startIndex, sliceEnd).trim());
      startIndex = sliceEnd;
      endIndex = startIndex + length;
    }

    return result;
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

  // Nuevo método para manejar la búsqueda en el modal
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
        console.log('Response received:', response); // Log the full response
        if (!response.error) {
          this.students = response.estudiantes;
          console.log('Active students found:', this.students); // Log the students found
        } else {
          this.students = [];
          console.error(response.message || 'No se encontraron alumnos activos.');
          console.log('No active students found or error:', response.message); // Log the error message
        }
      },
      error: (error) => {
        console.error('Error al buscar alumnos activos:', error);
        console.log('HTTP request error:', error); // Log the HTTP request error
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
                    console.log('Eliminando alumno con ID:', studentId);
                    try {
                        await this.dashboardMaestroService.deactivateStudent(studentId).toPromise(); // Realiza la eliminación
                        this.getActiveStudents(); // Actualiza la lista de estudiantes activos

                        // Mostrar alerta de éxito
                        const successAlert = await this.alertController.create({
                            header: 'Operación exitosa',
                            message: 'Este estudiante ha sido dado de baja.',
                            buttons: ['OK'],
                            backdropDismiss: false
                        });
                        await successAlert.present();
                    } catch (error) {
                        console.error('Error al eliminar al alumno:', error);
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

  async modifyStudentCredentials() {
    if (!this.selectedStudent.username.trim() || !this.selectedStudent.password) {
      this.errorMessage = 'Por favor, rellene todos los campos.';
      return;
    }
  
    this.confirmModifyCredentials();
  }
  
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

  async modifyStudentCredentialsConfirmed() {
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
        this.setEighthOpen(false);
        this.errorMessage = '';
      };

      const successAlert = await this.alertController.create({
        header: 'Operación exitosa',
        message: 'El alumno ha sido actualizado exitosamente.',
        buttons: [{
          text: 'OK',
          role: 'confirm',
          handler: () => finalizeModification()
        }],
        backdropDismiss: true
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
    }
  }

  extractErrorMessage(error: any): string {
    if (error && error.error && typeof error.error.message === 'string') {
      return error.error.message;
    } else if (error instanceof Error) {
      return error.message;
    } else {
      return 'Error al actualizar al alumno.';
    }
  }

  async presentErrorAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error al actualizar las credenciales del alumno.',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

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

  async reactivateStudent(studentId: number) {
    console.log('Reactivating student with ID:', studentId);
    const alert = await this.alertController.create({
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
          handler: () => {
            this.dashboardMaestroService.activateStudent(studentId).subscribe({
              next: async (response) => {
                if (!response.error) {
                  const reactivationAlert = await this.alertController.create({
                    header: 'Operación exitosa',
                    message: 'El alumno ha sido dado de alta.',
                    buttons: ['OK'],
                    backdropDismiss: false
                  });
                  await reactivationAlert.present();
                  console.log(`Student with ID ${studentId} reactivated`);
                  this.getInactiveStudents();  
                } else {
                  console.error('Error reactivating student:', response.message);
                }
              },
              error: (error) => {
                console.error('Error reactivating student:', error);
              }
            });
          },
        },
      ],
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