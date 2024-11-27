import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { NavegationService } from '../../navegation.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-video-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-page.component.html',
  styleUrls: ['./video-page.component.css']
})

export class VideoPageComponent implements OnInit {
  video: any;

  constructor(private navegationService: NavegationService) {}

  // Método correto do ciclo de vida
  ngOnInit(): void {
    this.video = this.navegationService.getVideo();
    console.log("video: ",this.video);
  }
}
