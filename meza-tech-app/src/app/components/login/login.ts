// src/app/components/login/login.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
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