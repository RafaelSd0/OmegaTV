import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class NavegationService {
  private nameSubject = new BehaviorSubject<string>(''); // Inicializa o nome da pesquisa
  nameChanged = this.nameSubject.asObservable(); // Observable para ser escutado
  listaAssistir: any[] = [];
  listaFavoritos: any[] =[];
  private video: any;


  constructor(
    private http: HttpClient,
  ) {}

  setName(name: string): void {
    console.log('Setando novo nome: ', name); // Adicionando log
    this.nameSubject.next(name); // Atualiza o valor da pesquisa
  }

  getName(): string {
    return this.nameSubject.getValue(); // Retorna o valor atual
  }

  setVideo(video: any): void {
    this.video = video;
  }

  getVideo(): any {
    return this.video;
  }

    // Busca todos os objetos do endpoint "watchLater"
    getWatchLater(){
      this.http.get<any[]>('http://localhost:3000/watchLater').subscribe({
        next: data => {
          this.listaAssistir = data;
        },
        error: (err) => {
          console.error('Erro ao carregar assistir:', err); // Trata erros
        }
      })
    }

    // Busca todos os objetos do endpoint "favorites"
    getFavorites(){

      this.http.get<any[]>('http://localhost:3000/favorites').subscribe({
        next: data => {
          this.listaFavoritos = data;
        },
        error: (err) => {
          console.error('Erro ao carregar favoritos:', err); // Trata erros
        }
      })
    }

}
