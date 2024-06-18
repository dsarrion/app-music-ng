import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { TracksService } from '../../services/tracks/tracks.service';
import { RouterLink } from '@angular/router';
import { NextComponent } from '../icon/next/next.component';
import { CategoryModel } from '../../Models/categoryModel';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [CommonModule , RouterLink, NextComponent],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css'
})
export class ContentComponent implements OnInit, OnChanges, OnDestroy {

  @Input() category!:CategoryModel;
  videos?: any;
  errorTracks:string = "";
  private subscriptions: Subscription = new Subscription();

  constructor(private trackService: TracksService) { }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['category'] && this.category) {
      this.getTracks(this.category.id);
    }
  }

  //Obtener tracks por categoria
  async getTracks(category_id:any){
    this.subscriptions.add(
      await this.trackService.getTracksByCategory(category_id).subscribe({
        next: (response) => {
          // Ordenar los videos por mas recientes primero
          this.videos = response.data.sort((a: any, b: any) => {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          // Limitar la cantidad de tracks a 5
          });
          this.videos = this.videos.slice(0, 6);
        },
        error: (errorTracks) => {
          console.error(errorTracks);
          this.errorTracks = errorTracks;
        }, 
        complete: () => {
          //console.log("Se han recibido correctamente los tracks", this.videos)
        }
      })
    )
  }

  getThumb(url: string, size: string) {
    var video, results, thumburl;

    if (url === null) {
      return '';
    }

    results = url.match('[\\?&]v=([^&#]*)');
    video = (results === null) ? url : results[1];

    if (size != null || size) {
      thumburl = 'http://img.youtube.com/vi/' + video + '/' + size + '.jpg';
    } else {
      thumburl = 'http://img.youtube.com/vi/' + video + '/mqdefault.jpg';
    }

    return thumburl;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}

/*     Tamaño de las miniaturas de Youtube
          Tamaño pequeño: default
          Tamaño mediano: hqdefault
          Tamaño estándar mqdefault
          Tamaño grande: sddefault
          Máxima calidad maxresdefault
 */