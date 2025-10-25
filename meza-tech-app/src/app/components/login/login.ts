// src/app/components/login/login.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginData = {
    usernameOrEmail: '',
    password: ''
  };
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    if (!this.loginData.usernameOrEmail || !this.loginData.password) {
      this.errorMessage = 'Por favor, llena todos los campos.';
      return;
    }
    
    this.authService.login(this.loginData).subscribe({
      next: () => {
        // El servicio se encarga de redirigir
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Error al iniciar sesión.';
      }
    });
  }
}