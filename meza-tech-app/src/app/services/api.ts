// src/app/services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  // Un "Subject" para mantener la lista de favoritos actualizada
  private favoritesSubject = new BehaviorSubject<any[]>([]);
  public favorites$ = this.favoritesSubject.asObservable();

  constructor(private http: HttpClient) { }

  // --- YouTube ---
  searchVideos(query: string): Observable<any[]> {
    const params = new HttpParams().set('q', query);
    return this.http.get<any[]>(`${this.apiUrl}/youtube/search`, { params });
  }

  // --- Favoritos ---
  loadFavorites(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/favorites`).pipe(
      tap(favorites => this.favoritesSubject.next(favorites))
    );
  }

  addFavorite(video: any): Observable<any> {
    const favoriteData = {
      videoId: video.videoId,
      title: video.title,
      thumbnailUrl: video.thumbnail
    };
    return this.http.post<any>(`${this.apiUrl}/favorites`, favoriteData).pipe(
      // Después de añadir, recargamos la lista
      tap(() => this.loadFavorites().subscribe()) 
    );
  }

  removeFavorite(videoId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/favorites/${videoId}`).pipe(
      // Después de borrar, recargamos la lista
      tap(() => this.loadFavorites().subscribe())
    );
  }
}