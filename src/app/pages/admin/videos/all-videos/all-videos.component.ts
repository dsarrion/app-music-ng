import { Component, OnInit } from '@angular/core';
import { TracksService } from '../../../../services/tracks/tracks.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-all-videos',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './all-videos.component.html',
  styleUrl: './all-videos.component.css'
})
export class AllVideosComponent implements OnInit {

  videos?: any;
  errorMessage: string = "";

  constructor(private trackService: TracksService, private router: Router) { }

  ngOnInit(): void {
    this.allTracks();
  }

  allTracks() {
    return this.trackService.getAllTracks().subscribe({
      next: (allTracks) => {
        this.videos = allTracks
      },
      error: (errorTracks) => {
        console.error(errorTracks);
        this.errorMessage = errorTracks;
      },
      complete: () => {
        //console.log("Videos recibidos correctamente", this.videos)
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
