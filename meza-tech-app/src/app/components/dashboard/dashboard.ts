// src/app/components/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';
import { Observable } from 'rxjs';
import { NavbarComponent } from '../navbar/navbar';
import { VideoItemComponent } from '../video-item/video-item';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, VideoItemComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit {
  // Observable de favoritos
  favorites$: Observable<any[]>;
  
  // Array de resultados de búsqueda
  searchResults: any[] = [];
  
  // Términos de búsqueda (vinculados al HTML con ngModel)
  youtubeSearchTerm: string = '';
  favoriteSearchTerm: string = ''; // (Este lo usaremos en el HTML con un pipe)

  constructor(private apiService: ApiService) {
    this.favorites$ = this.apiService.favorites$;
  }

  ngOnInit(): void {
    // Al cargar el dashboard, cargamos los favoritos
    this.apiService.loadFavorites().subscribe();
  }

  // --- Sección Principal (YouTube) ---
  onSearchYouTube(): void {
    if (this.youtubeSearchTerm.trim() === '') return;

    this.apiService.searchVideos(this.youtubeSearchTerm).subscribe({
      next: (videos) => {
        this.searchResults = videos;
      },
      error: (err) => {
        console.error('Error buscando videos', err);
      }
    });
  }

  onAddFavorite(video: any): void {
    this.apiService.addFavorite(video).subscribe({
      next: () => {
        // La lista de favoritos se actualiza sola gracias al servicio
      },
      error: (err) => {
        if (err.status === 409) {
          alert('Este video ya está en tus favoritos.');
        } else {
          alert('Error al añadir favorito.');
        }
      }
    });
  }

  // --- Sección de Favoritos ---
  onRemoveFavorite(videoId: string): void {
    this.apiService.removeFavorite(videoId).subscribe();
  }
}