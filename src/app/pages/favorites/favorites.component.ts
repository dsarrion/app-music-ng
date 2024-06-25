import { Component, OnInit } from '@angular/core';
import { Track } from '../../Models/trackModel';
import { RouterLink } from '@angular/router';
import { CommentsService } from '../../services/commentsLikes/comments.service';
import { Subscription } from 'rxjs';
import { UserService } from '../../services/user/user.service';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { CommonModule, ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [ RouterLink, SpinnerComponent, CommonModule ],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent implements OnInit{
  userLoginOn: boolean = false;
  userId?: number;
  errorMessage: string = "";
  videosLikes?: Track[];
  countVideos?: number;
  private subscriptions: Subscription = new Subscription();

  // Variables de paginación
  currentPage: number = 1;
  totalPages: number = 1;
  totalVideos: number = 0;
  videosPerPage: number = 8;
  isLoading: boolean = false;

  constructor(private commentService: CommentsService, private userService:  UserService, private viewportScroller: ViewportScroller){}

  ngOnInit(): void {
    this.getUserLoginOn();

    this.getUserData();
  }

  getUserLoginOn(){
    this.subscriptions.add(
      this.userService.currentUserLoginOn.subscribe({
        next:(response) => {
          this.userLoginOn = response;
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
    this.isLoading = true;
    this.subscriptions.add(
      this.commentService.getTracksLikes(id, page, this.videosPerPage).subscribe({
        next:(response) => {
          console.log(response.tracks);
          this.countVideos = response.tracks.length;
          this.videosLikes = response.tracks.data;
          this.currentPage = response.tracks.current_page;
          this.totalPages = response.tracks.last_page;
          this.totalVideos = response.tracks.total;
          this.isLoading = false;
          console.log(this.totalVideos);
        }, error: (errorData) => {
          console.error('error', errorData);
          this.errorMessage = errorData;
        }
      })
    )
  }

  loadNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.getVideosLikes(Number(this.userId), this.currentPage);
    }
  }

  loadPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getVideosLikes(Number(this.userId), this.currentPage);
    }
  }

  scrollTop(){
    this.viewportScroller.scrollToPosition([0, 0]);
  }

  getThumb(url: string, size: string) {
    if (!url) {
      return '';
    }
    const results = url.match('[\\?&]v=([^&#]*)');
    const video = results ? results[1] : url;

    return `http://img.youtube.com/vi/${video}/${size}.jpg`;
  }

}
