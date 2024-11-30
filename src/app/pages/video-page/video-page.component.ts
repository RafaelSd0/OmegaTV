import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { NavegationService } from '../../navegation.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '@auth0/auth0-angular';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-video-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-page.component.html',
  styleUrls: ['./video-page.component.css']
})

export class VideoPageComponent implements OnInit {
  private baseUrl = 'http://localhost:3000';
  video: any;
  usuarioFavoritou: boolean = false;
  usuarioAssisteDepois: boolean = false;

  constructor(
    private navegationService: NavegationService,
    private http: HttpClient,
    private auth: AuthService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {

    this.video = this.navegationService.getVideo();

    this.auth.isAuthenticated$.subscribe(isAuthenticated => {
      if (isAuthenticated) {
        const novoTotalDeViews = this.video.views + 1; // Calcula o novo total de visualizações
        this.updateItem('videos', this.video.id, { views: novoTotalDeViews }).subscribe(() => {
          // Atualiza localmente o valor para refletir o que foi enviado
          this.video.views = novoTotalDeViews;
        });
      }
    });

  }

  // Função para favoritar o vídeo
  favoritar(): void {
    this.usuarioFavoritou = true;
    this.auth.user$.subscribe(user => {
      const userId = user?.sub; // Obtém o ID do usuário (sub) do Auth0
      if (userId) {
        this.usuarioFavoritou = true;
        // Adiciona o vídeo aos favoritos
        this.addItem('favorites', {  'videoId': this.video.id, 'authId': userId });
      }
    });
  }

  // Função para adicionar o vídeo à lista de "assistir depois"
  assistirDepois(): void {
    this.auth.user$.subscribe(user => {
      const userId = user?.sub; // Obtém o ID do usuário (sub) do Auth0
      if (userId) {
        this.usuarioAssisteDepois = true;
        // Adiciona o vídeo à lista "assistir depois"
        this.addItem('watchLater', {   'videoId': this.video.id, 'authId': userId });
      }
    });
  }

  // Função para remover o vídeo da lista "assistir depois"
  naoassistirDepois(): void {
    this.usuarioAssisteDepois = false;
    this.deleteItem('watchLater', this.video.id);
  }

  // Função para desfavoritar o vídeo
  desfavoritar(): void {
    this.usuarioFavoritou = false;
    this.deleteItem('favorites', this.video.id);
  }

  // Método para adicionar um item (vídeo) a qualquer endpoint
  addItem(endpoint: string, data: any): Observable<any> {
    const url = `${this.baseUrl}/${endpoint}`;
    return this.http.post(url, data);
  }

  // Método para atualizar um item (vídeo) no banco de dados
  updateItem(endpoint: string, id: string | number, data: any): Observable<any> {
    const url = `${this.baseUrl}/${endpoint}/${id}`;
    return this.http.patch(url, data); // Altere de PUT para PATCH
  }


  // Método para remover um item (vídeo) no banco de dados
  deleteItem(endpoint: string, id: number): Observable<any> {
    const url = `${this.baseUrl}/${endpoint}/${id}`;
    return this.http.delete(url);
  }


  getEmbedUrl(url: string): SafeResourceUrl {
    const videoId = this.extractYoutubeId(url);
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  extractYoutubeId(url: string): string | null {
    const regExp = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  }
}
