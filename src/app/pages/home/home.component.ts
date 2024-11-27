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

  constructor(private http: HttpClient, private navegationService:NavegationService) {}

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:3000/videos').subscribe({
      next: (data) => {
        this.videos = data; // Armazena os vídeos
      },
      error: (err) => {
        console.error('Erro ao carregar vídeos:', err); // Trata erros
      }
    });
  }

  setVideo(video: any): void {
    this.navegationService.setVideo(video); // Armazena o vídeo no serviço
  }
}
