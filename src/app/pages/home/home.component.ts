import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabViewModule } from 'primeng/tabview';
import { HttpClient } from '@angular/common/http';
import { NavegationService } from '../../navegation.service';
import { RouterLink } from '@angular/router';

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

  constructor(private http: HttpClient, private navegationService: NavegationService) {}

  ngOnInit(): void {
    // Carregar os vídeos quando o componente for inicializado
    this.getVideos()

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

}
