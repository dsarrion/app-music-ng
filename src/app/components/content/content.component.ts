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

  ngOnInit(): void {
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.category.name == "Mas Populares"){
      this.getTrensTracks();
    }
      
    if (changes['category'] && this.category) {
      if(this.category.name == "Mas Populares"){
        this.getTrensTracks();
      }else{
        this.getTracks(this.category.id);
      }
    }
  }

  getTrensTracks(){
    this.subscriptions.add(
      this.trackService.getAllTracks().subscribe({
        next: (response) => {
          const tracks = response;
          // Ordena los tracks por número de likes en orden descendente
        const sortedTracks = tracks.sort((a: any, b: any) => b.likes - a.likes);
        this.videos = sortedTracks.slice(0, 6);
        }
      })
    )
  }

  //Obtener tracks por categoria
  getTracks(category_id:any){
    this.subscriptions.add(
      this.trackService.getTracksByCategory(category_id).subscribe({
        next: (response) => {
          // Ordenar los videos por mas recientes primero
          this.videos = response.data;
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