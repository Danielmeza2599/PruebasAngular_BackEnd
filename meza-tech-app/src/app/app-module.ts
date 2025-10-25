// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxCaptchaModule } from 'ngx-captcha';

import { AppRoutingModule } from './app-routing-module';
import { AppComponent } from './app';

// Componentes
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { DashboardComponent } from './components/dashboard/dashboard';
import { NavbarComponent } from './components/navbar/navbar';
import { VideoItemComponent } from './components/video-item/video-item';

// Guardias e Interceptor
import { AuthInterceptor } from './interceptors/auth-interceptor';
import { AuthGuard } from './guards/auth-guard';
import { LoginGuard } from './guards/login-guard';
import { Environment } from './environments/environment/environment';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    NavbarComponent,
    VideoItemComponent,
    Environment
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule, // <-- ¡Crucial para peticiones API!
    FormsModule,        // <-- Para formularios simples (Login)
    ReactiveFormsModule, // <-- Para formularios avanzados (Registro)
    NgxCaptchaModule    // <-- Para ReCaptcha
  ],
  providers: [
    AuthGuard,
    LoginGuard,
    // Aquí le decimos a Angular que use nuestro Interceptor
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }