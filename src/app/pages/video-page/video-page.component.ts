import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavegationService } from '../../navegation.service';

@Component({
  selector: 'app-video-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-page.component.html',
  styleUrls: ['./video-page.component.css']
})
export class VideoPageComponent implements OnInit {
  video: any;

  constructor(private navegationService: NavegationService,) {}

  ngOnInit(): void {
    this.video = this.navegationService.getVideo();

  }


}
