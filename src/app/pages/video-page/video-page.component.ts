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
    this.auth.user$.subscribe(user => {
      const userId = user?.sub; // Obtém o ID do usuário (sub) do Auth0
      if (userId) {
        // Adiciona o vídeo aos favoritos
        this.addItem('favorites', {  'authId': userId, 'videoId': this.video.id }).subscribe(
          response => {
            window.alert('Adicionado à lista de favoritos');
          },
          error => {
            console.log('Erro ao adicionar à lista de favoritos:', error)
          }
        )
      }
    });
  }

  // Função para adicionar o vídeo à lista de "assistir depois"
  assistirDepois(): void {
    this.auth.user$.subscribe(user => {
      const userId = user?.sub; // Obtém o ID do usuário (sub) do Auth0
      if (userId) {
        // Adiciona o vídeo à lista "assistir depois"
        this.addItem('watchLater', { 'authId': userId, 'videoId': this.video.id }).subscribe(
          response => {
            window.alert('Adicionado à lista de assistir depois')
          },
          error => {
            console.error('Erro ao adicionar à lista de assistir depois:', error);
          }
        );
      }
    });
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
