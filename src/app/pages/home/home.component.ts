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
  videos: any[] = []; // Armazenar os vídeos
  pesquisa: string = ''; // Variável para armazenar o termo de pesquisa
  isAuthenticated: boolean = false;
  user: any;

  constructor(private http: HttpClient, private navegationService: NavegationService, public auth: AuthService) {}

  ngOnInit(): void {
    // Carregar os vídeos quando o componente for inicializado
    this.getVideos()
    this.navegationService.getFavorites();
    this.navegationService.getWatchLater();

    // Escutar mudanças no nome da pesquisa
    this.pesquisa = this.navegationService.getName(); // Inicializa com o valor atual
    console.log('Pesquisa inicial:', this.pesquisa); // Logando o valor inicial

    this.navegationService.nameChanged.subscribe(newName => {
      console.log('Novo nome de pesquisa recebido:', newName); // Verificando o nome recebido
      this.pesquisa = newName; // Atualiza a pesquisa quando o valor mudar
      this.pesquisarPorNome(); // Chama a função de filtro
      if(this.pesquisa === ''){
        this.getVideos()
      }
    });

    this.auth.isAuthenticated$.subscribe((authenticated) => {
      this.isAuthenticated = authenticated; // Atualiza o estado de autenticação
      console.log('Usuário autenticado:', this.isAuthenticated);
    });

    // Obtém os dados do usuário autenticado
    this.auth.user$.subscribe({
      next: (profile) => {
        this.user = profile; // Armazena os dados do usuário
        console.log('Usuário autenticado:', this.user);
        if (this.user) {
          this.addUserToDatabase(this.user); // Adiciona ao banco de dados
        }
      },
      error: (err) => {
        console.error('Erro ao obter dados do usuário:', err);
      }
    });

  }


  // Adiciona o usuário ao db.json
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
        this.videos = data; // Armazena os vídeos
        console.log('Vídeos carregados:', this.videos); // Adicionando log
        this.pesquisarPorNome(); // Chama a função de filtro logo após carregar os vídeos
      },
      error: (err) => {
        console.error('Erro ao carregar vídeos:', err); // Trata erros
      }
    });
  }

  pesquisarPorNome(): void {
    console.log('Pesquisando por nome:', this.pesquisa); // Verificando a pesquisa atual
    if (this.pesquisa) {
      this.videos = this.videos.filter(video =>
        video.title.toLowerCase().includes(this.pesquisa.toLowerCase())
      );
    }
  }

  setVideo(video: any): void {
    this.navegationService.setVideo(video); // Armazena o vídeo no serviço
  }

  filtrarFavoritos(): void {
    if (this.isAuthenticated) {
      this.auth.user$.subscribe(user => {
        const userId = user?.sub; // Obtém o ID do usuário autenticado
        if (!userId) {
          window.alert("Erro: usuário não autenticado.");
          return;
        }

        // Aguarda a lista de favoritos ser carregada antes de filtrar
        this.navegationService.getFavorites(); // Certifique-se de que a lista está carregada antes de filtrar

        // Agora filtramos os vídeos com base no usuário autenticado
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
        const userId = user?.sub; // Obtém o ID do usuário autenticado
        if (!userId) {
          window.alert("Erro: usuário não autenticado.");
          return;
        }

        // Aguarda a lista de favoritos ser carregada antes de filtrar
        this.navegationService.getWatchLater(); // Certifique-se de que a lista está carregada antes de filtrar

        // Agora filtramos os vídeos com base no usuário autenticado
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
