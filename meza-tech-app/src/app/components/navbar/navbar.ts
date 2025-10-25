// src/app/components/navbar/navbar.component.ts
import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  user$ = this.authService.currentUser$; // Observable del usuario

  constructor(private authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}