// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { DashboardComponent } from './components/dashboard/dashboard';

import { AuthGuard } from './guards/auth-guard';
import { LoginGuard } from './guards/login-guard';

const routes: Routes = [
  // Si ya estás logueado, no puedes ver el login/registro
  { 
    path: 'login', 
    component: LoginComponent, 
    canActivate: [LoginGuard] 
  },
  { 
    path: 'register', 
    component: RegisterComponent, 
    canActivate: [LoginGuard] 
  },
  
  // Para ver el dashboard, DEBES estar logueado
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [AuthGuard] 
  },

  // Rutas por defecto
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' } // Redirige cualquier otra cosa
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
