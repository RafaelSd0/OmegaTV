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
        const novoTotalDeViews = this.video.views + 1;
        this.updateItem('videos', this.video.id, { views: novoTotalDeViews }).subscribe(() => {
          this.video.views = novoTotalDeViews;
        });
      }
    });

  }

  favoritar(): void {
    this.auth.user$.subscribe(user => {
      const userId = user?.sub;
      if (userId) {
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

  assistirDepois(): void {
    this.auth.user$.subscribe(user => {
      const userId = user?.sub;
      if (userId) {
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

  // adicionar e modificar dados do db.json
  addItem(endpoint: string, data: any): Observable<any> {
    const url = `${this.baseUrl}/${endpoint}`;
    return this.http.post(url, data);
  }

  updateItem(endpoint: string, id: string | number, data: any): Observable<any> {
    const url = `${this.baseUrl}/${endpoint}/${id}`;
    return this.http.patch(url, data);
  }

  // funções para colocar video no Iframe
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
