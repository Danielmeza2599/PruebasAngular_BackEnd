// src/app/components/navbar/navbar.component.ts
// src/app/components/navbar/navbar.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth'; // <-- Asegúrate que sea service
import { Observable } from 'rxjs'; // <-- Necesitas importar esto

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss']
})
export class NavbarComponent {
  
  // 1. Solo declara la variable y su tipo aquí
  user$: Observable<any | null>; 

  // 2. Inyécta el servicio y ASIGNA la variable dentro del constructor
  constructor(private authService: AuthService) {
    this.user$ = this.authService.currentUser$; // <-- La asignación va aquí
  }

  logout(): void {
    this.authService.logout();
  }
}