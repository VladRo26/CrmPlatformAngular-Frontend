import { Component, OnInit } from '@angular/core';
import { ImageService } from '../../_services/image.service';
import { ImageDTO } from '../../_models/image';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-homeimgaes',
  standalone: true,
  imports: [CarouselModule,NgFor],
  templateUrl: './homeimages.component.html',
  styleUrl: './homeimages.component.css'
})
export class HomeimgaesComponent  implements OnInit{
  images: ImageDTO[] = [];

  constructor(private imageService: ImageService) { }

  ngOnInit(): void {
    this.loadImages();
  }

  loadImages() {
    this.imageService.getImages().subscribe(images => {
      this.images = images;
    })
  }
}
