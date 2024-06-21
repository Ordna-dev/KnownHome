import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login-alumno',
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
  {
    path: 'login-alumno',
    loadComponent: () => import('./login-alumno/login-alumno.page').then( m => m.LoginAlumnoPage)
  },
  {
    path: 'tutorial-maestro-dashboard',
    loadComponent: () => import('./tutorial-maestro-dashboard/tutorial-maestro-dashboard.page').then( m => m.TutorialMaestroDashboardPage)
  },
  {
    path: 'tutorial-maestro-grupos',
    loadComponent: () => import('./tutorial-maestro-grupos/tutorial-maestro-grupos.page').then( m => m.TutorialMaestroGruposPage)
  },
  {
    path: 'tutorial-alumno-dashboard',
    loadComponent: () => import('./tutorial-alumno-dashboard/tutorial-alumno-dashboard.page').then( m => m.TutorialAlumnoDashboardPage)
  },
  {
    path: 'tutorial-alumno-grupos',
    loadComponent: () => import('./tutorial-alumno-grupos/tutorial-alumno-grupos.page').then( m => m.TutorialAlumnoGruposPage)
  }
];
