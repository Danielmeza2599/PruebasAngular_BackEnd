// src/app/components/register/register.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

// Validador customizado
function passwordMatcher(c: AbstractControl): { [key: string]: boolean } | null {
  const passwordControl = c.get('password');
  const confirmControl = c.get('confirmPassword');
  if (passwordControl?.pristine || confirmControl?.pristine) {
    return null;
  }
  if (passwordControl?.value === confirmControl?.value) {
    return null;
  }
  return { 'match': true };
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  recaptchaSiteKey = environment.recaptchaSiteKey;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      passwordGroup: this.fb.group({
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      }, { validator: passwordMatcher }),
      recaptchaToken: ['', Validators.required] // El token de ReCaptcha
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.errorMessage = 'Por favor, completa el formulario correctamente.';
      return;
    }

    // Aplanar el formulario para el backend
    const formData = {
      ...this.registerForm.value,
      password: this.registerForm.value.passwordGroup.password,
      confirmPassword: this.registerForm.value.passwordGroup.confirmPassword
    };
    // No necesitamos enviar el 'passwordGroup'
    delete formData.passwordGroup; 

    this.authService.register(formData).subscribe({
      next: (response) => {
        this.successMessage = `${response.message} Serás redirigido al login...`;
        this.errorMessage = null;
        setTimeout(() => this.router.navigate(['/login']), 3000);
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Error en el registro.';
        this.successMessage = null;
      }
    });
  }
}