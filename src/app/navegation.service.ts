import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class NavegationService {
  
  private nameSubject = new BehaviorSubject<string>('');
  nameChanged = this.nameSubject.asObservable();
  listaAssistir: any[] = [];
  listaFavoritos: any[] =[];
  private video: any;


  constructor(
    private http: HttpClient,
  ) {}

  setName(name: string): void {
    console.log('Setando novo nome: ', name);
    this.nameSubject.next(name);
  }

  getName(): string {
    return this.nameSubject.getValue();
  }

  setVideo(video: any): void {
    this.video = video;
  }

  getVideo(): any {
    return this.video;
  }

  getWatchLater(){
    this.http.get<any[]>('http://localhost:3000/watchLater').subscribe({
      next: data => {
        this.listaAssistir = data;
      },
      error: (err) => {
        console.error('Erro ao carregar assistir:', err);
      }
    })
  }

  getFavorites(){
    this.http.get<any[]>('http://localhost:3000/favorites').subscribe({
      next: data => {
        this.listaFavoritos = data;
      },
      error: (err) => {
        console.error('Erro ao carregar favoritos:', err);
      }
    })
  }

}
