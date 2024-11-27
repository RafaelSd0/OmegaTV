import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class NavegationService {
  private nameSubject = new BehaviorSubject<string>(''); // Inicializa o nome da pesquisa
  nameChanged = this.nameSubject.asObservable(); // Observable para ser escutado

  private video: any;

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
}
