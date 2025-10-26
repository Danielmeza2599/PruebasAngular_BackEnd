// src/app/components/video-item/video-item.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-video-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-item.html',
  styleUrls: ['./video-item.scss']
})
export class VideoItemComponent {
  // Recibe el objeto del video
  @Input() video: any; 
  
  // Recibe el tipo: 'search' (para añadir) o 'favorite' (para quitar)
  @Input() type: 'search' | 'favorite' = 'search';

  // Eventos que "dispara" al componente padre
  @Output() add = new EventEmitter<any>();
  @Output() remove = new EventEmitter<string>();

  onAddClick(): void {
    this.add.emit(this.video);
  }

  onRemoveClick(): void {
    // Si es un favorito, el ID está en video_id (de la DB)
    // Si es de búsqueda, está en videoId (de YouTube)
    const id = this.video.video_id || this.video.videoId;
    this.remove.emit(id);
  }
}