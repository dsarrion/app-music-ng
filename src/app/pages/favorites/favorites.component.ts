import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Track } from '../../Models/trackModel';
import { RouterLink } from '@angular/router';
import { CommentsService } from '../../services/commentsLikes/comments.service';
import { Subscription } from 'rxjs';
import { UserService } from '../../services/user/user.service';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { CommonModule, ViewportScroller } from '@angular/common';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { TrendsComponent } from '../../components/trends/trends.component';
import { TracksService } from '../../services/tracks/tracks.service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [ RouterLink, SpinnerComponent, CommonModule, PaginationComponent, TrendsComponent ],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent implements OnInit, OnDestroy{
  userLoginOn: boolean = false;
  userId?: number;
  errorMessage: string = "";
  videosLikes?: Track[];
  countVideos: number = 0;
  private subscriptions: Subscription = new Subscription();

  // Variables de paginación
  currentPage: number = 1;
  totalPages: number = 1;
  videosPerPage: number = 8;

  constructor(private tracksService: TracksService, private userService:  UserService, private viewportScroller: ViewportScroller){}

  ngOnInit(): void {
    this.getUserLoginOn();

  }

  getUserLoginOn(){
    this.subscriptions.add(
      this.userService.currentUserLoginOn.subscribe({
        next:(response) => {
          this.userLoginOn = response;
          if(this.userLoginOn){
            this.getUserData();
          }
        },
      })
    )
  }

  getUserData(){
    this.subscriptions.add(
      this.userService.currentUserData.subscribe({
        next: (response) => {
          this.userId = response?.id
          if(this.userId){
            this.getVideosLikes(this.userId, this.currentPage);
          }
          //console.log('Datos de usuario:', response)
        }
      })
    )
  }

  getVideosLikes(id: number, page: number){
    this.subscriptions.add(
      this.tracksService.getUserTracksLikes(id, page, this.videosPerPage).subscribe({
        next:(response) => {
          this.videosLikes = response.tracks.data;
          if(this.videosLikes){
            this.countVideos = this.videosLikes.length;
          } 
          this.totalPages = Math.ceil(response.tracks.total / this.videosPerPage);
          this.viewportScroller.scrollToPosition([0, 0]);
        }, error: (errorData) => {
          console.error('Error:', errorData);
          this.errorMessage = errorData;
        }     
      })
    )
  }

  onPageChange(newPage: number) {
    this.currentPage = newPage;
    this.getVideosLikes(this.userId!, newPage);
  }

  getThumb(url: string, size: string) {
    if (!url) {
      return '';
    }
    const results = url.match('[\\?&]v=([^&#]*)');
    const video = results ? results[1] : url;

    return `http://img.youtube.com/vi/${video}/${size}.jpg`;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

}
