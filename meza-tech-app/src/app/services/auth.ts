// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  
  // Un "Subject" para guardar la información del usuario logueado
  private userSubject = new BehaviorSubject<any | null>(this.getUserFromStorage());
  public currentUser$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        // Guardamos el token y los datos del usuario
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.userSubject.next(response.user);
        this.router.navigate(['/dashboard']);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  // --- Helpers ---

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    // Es autenticado si existe un token
    return !!this.getToken(); 
  }

  private getUserFromStorage(): any | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}