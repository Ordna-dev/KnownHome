import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'folder/:id',
    loadComponent: () =>
      import('./folder/folder.page').then((m) => m.FolderPage),
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'perfil',
    loadComponent: () => import('./perfil/perfil.page').then( m => m.PerfilPage)
  },
  {
    path: 'dashboard-maestro',
    loadComponent: () => import('./dashboard-maestro/dashboard-maestro.page').then( m => m.DashboardMaestroPage)
  },
  {
    path: 'dashboard-alumno',
    loadComponent: () => import('./dashboard-alumno/dashboard-alumno.page').then( m => m.DashboardAlumnoPage)
  },
  {
    path: 'grupo-maestro',
    loadComponent: () => import('./grupo-maestro/grupo-maestro.page').then( m => m.GrupoMaestroPage)
  },
  {
    path: 'grupo-alumno',
    loadComponent: () => import('./grupo-alumno/grupo-alumno.page').then( m => m.GrupoAlumnoPage)
  },
];
