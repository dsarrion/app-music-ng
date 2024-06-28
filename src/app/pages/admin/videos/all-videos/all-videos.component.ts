import { Component, OnDestroy, OnInit } from '@angular/core';
import { TracksService } from '../../../../services/tracks/tracks.service';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { PaginationComponent } from '../../../../components/pagination/pagination.component';

@Component({
  selector: 'app-all-videos',
  standalone: true,
  imports: [ RouterLink, PaginationComponent ],
  templateUrl: './all-videos.component.html',
  styleUrl: './all-videos.component.css'
})
export class AllVideosComponent implements OnInit, OnDestroy {

  videos?: any;
  errorMessage: string = "";
  private subscriptions: Subscription = new Subscription();

  // Variables de paginación
  currentPage: number = 1;
  totalPages: number = 1;
  videosPerPage: number = 12;

  constructor(private trackService: TracksService, private router: Router) { }

  ngOnInit(): void {
    this.allTracks(this.currentPage);
  }

  allTracks(page: number) {
    this.subscriptions.add(
      this.trackService.getAllTracksPaginate(page, this.videosPerPage).subscribe({
        next: (response) => {
          this.videos = response.data;
          this.totalPages = Math.ceil(response.total / this.videosPerPage);
        },
        error: (errorTracks) => {
          console.error(errorTracks);
          this.errorMessage = errorTracks;
        },
        complete: () => {
          //console.log("Videos recibidos correctamente", this.videos)
        }
      })
    )
  } 

  onPageChange(newPage: number) {
    this.currentPage = newPage;
    this.allTracks(this.currentPage);
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

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
