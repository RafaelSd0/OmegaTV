import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabViewModule } from 'primeng/tabview';
import { HttpClient } from '@angular/common/http';
import { NavegationService } from '../../navegation.service';
import { RouterLink } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TabViewModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  videos: any[] = [];
  pesquisa: string = '';
  isAuthenticated: boolean = false;
  user: any;

  constructor(private http: HttpClient, private navegationService: NavegationService, public auth: AuthService) {}

  ngOnInit(): void {

    this.getVideos()
    this.navegationService.getFavorites();
    this.navegationService.getWatchLater();

    // Escutar mudanças no nome da pesquisa
    this.pesquisa = this.navegationService.getName();
    console.log('Pesquisa inicial:', this.pesquisa);

    this.navegationService.nameChanged.subscribe(newName => {
      console.log('Novo nome de pesquisa recebido:', newName);
      this.pesquisa = newName;
      this.pesquisarPorNome();
      if(this.pesquisa === ''){
        this.getVideos()
      }
    });

    this.auth.isAuthenticated$.subscribe((authenticated) => {
      this.isAuthenticated = authenticated;
      console.log('Usuário autenticado:', this.isAuthenticated);
    });

    this.auth.user$.subscribe({
      next: (profile) => {
        this.user = profile;
        console.log('Usuário autenticado:', this.user);
        if (this.user) {
          this.addUserToDatabase(this.user);
        }
      },
      error: (err) => {
        console.error('Erro ao obter dados do usuário:', err);
      }
    });

  }

  addUserToDatabase(user: any): void {
    this.http.post('http://localhost:3000/users', user).subscribe({
      next: (response) => {
        console.log('Usuário adicionado com sucesso:', response);
      },
      error: (err) => {
        console.error('Erro ao adicionar usuário ao banco de dados:', err);
      }
    });
  }

  getVideos(){
    this.http.get<any[]>('http://localhost:3000/videos').subscribe({
      next: (data) => {
        this.videos = data;
        console.log('Vídeos carregados:', this.videos);
        this.pesquisarPorNome();
      },
      error: (err) => {
        console.error('Erro ao carregar vídeos:', err);
      }
    });
  }

  pesquisarPorNome(): void {
    console.log('Pesquisando por nome:', this.pesquisa);
    if (this.pesquisa) {
      this.videos = this.videos.filter(video =>
        video.title.toLowerCase().includes(this.pesquisa.toLowerCase())
      );
    }
  }

  setVideo(video: any): void {
    this.navegationService.setVideo(video);
  }

  filtrarFavoritos(): void {
    if (this.isAuthenticated) {
      this.auth.user$.subscribe(user => {
        const userId = user?.sub;
        if (!userId) {
          window.alert("Erro: usuário não autenticado.");
          return;
        }


        this.navegationService.getFavorites();

        this.videos = this.videos.filter(video =>
          this.navegationService.listaFavoritos.some(fav =>
            fav.authId === userId && fav.videoId === video.id
          )
        );

        console.log('Vídeos Favoritos do Usuário:', this.videos);
      });
    } else {
      window.alert("É necessário fazer login para acessar 'Favoritos'");
    }
  }


  filtrarMaisTarde(){
    if (this.isAuthenticated) {
      this.auth.user$.subscribe(user => {
        const userId = user?.sub;
        if (!userId) {
          window.alert("Erro: usuário não autenticado.");
          return;
        }

        this.navegationService.getWatchLater();

        this.videos = this.videos.filter(video =>
          this.navegationService.listaAssistir.some(fav =>
            fav.authId === userId && fav.videoId === video.id
          )
        );

        console.log('Vídeos Favoritos do Usuário:', this.videos);
      });
    } else {
      window.alert("É necessário fazer login para acessar 'Assistir mais tarde'");
    }
  }

}
