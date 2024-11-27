import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavegationService {
  video:any

  getVideo(): any{
    return this.video;
  }

  setVideo(video:any): void{
    this.video = video;
  }
}
