import { Component, Input, OnInit } from '@angular/core';
import { TracksService } from '../../services/tracks/tracks.service';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css'
})
export class ContentComponent implements OnInit {

  @Input() category!:any;
  videos?: any;
  errorTracks:string = "";

  constructor(private trackService: TracksService) { }

  ngOnInit(): void {
    this.getTracks(this.category.id)
  }

  getTracks(category_id:number){
    this.trackService.getTracksByCategory(category_id).subscribe({
      next: (videos) => {
        this.videos = videos.data;
      },
      error: (errorTracks) => {
        console.error(errorTracks);
        this.errorTracks = errorTracks;
      }, 
      complete: () => {
        //console.log("Se han recibido correctamente los tracks", this.videos)
      }
    })
  }

  getThumb(url: string, size: string) {
    var video, results, thumburl;

    if (url === null) {
      return '';
    }

    results = url.match('[\\?&]v=([^&#]*)');
    video = (results === null) ? url : results[1];

    if (size != null) {
      thumburl = 'http://img.youtube.com/vi/' + video + '/' + size + '.jpg';
    } else {
      thumburl = 'http://img.youtube.com/vi/' + video + '/mqdefault.jpg';
    }

    return thumburl;
  }

}

/*     Tamaño de las miniaturas de Youtube
          Tamaño pequeño: default
          Tamaño mediano: hqdefault
          Tamaño estándar mqdefault
          Tamaño grande: sddefault
          Máxima calidad maxresdefault
 */