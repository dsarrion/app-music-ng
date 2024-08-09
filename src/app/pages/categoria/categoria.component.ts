import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TracksService } from '../../services/tracks/tracks.service';
import { Track } from '../../Models/trackModel';
import { BehaviorSubject, Observable, Subscription, map, switchMap} from 'rxjs';
import { CategoryModel } from '../../Models/categoryModel';
import { CommonModule, ViewportScroller } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { TrendsComponent } from '../../components/trends/trends.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';

@Component({
  selector: 'app-categoria',
  standalone: true,
  imports: [CommonModule, RouterLink, SpinnerComponent, TrendsComponent, PaginationComponent], 
  templateUrl: './categoria.component.html',
  styleUrl: './categoria.component.css'
})
export class CategoriaComponent implements OnInit, OnDestroy {

  videosCategory?: Track[];
  category! : CategoryModel;
  errorMessage: string = "";
  private subscriptions: Subscription = new Subscription();
  categoryIdSubject = new BehaviorSubject<string>('');

  // Variables de paginación
  currentPage: number = 1;
  totalPages: number = 1;
  videosPerPage: number = 8;

  @Input('id')
  set idCategory(value: string) {
    this.categoryIdSubject.next(value);
  }
  get idCategory(): string {
    return this.categoryIdSubject.value;
  }
  
  constructor(private trackService: TracksService, private viewportScroller: ViewportScroller) {}

  ngOnInit(): void {

    this.subscriptions.add(
      this.categoryIdSubject.pipe(
        switchMap(id => {
          if (id === '0') {
            this.tracksCategory(Number(id));
            // Devuelve un observable con el objeto category predefinido
            return new Observable<any>(observer => {
            observer.next({ name: 'Mas Populares' });
            observer.complete();
            });           
          } else if (id) {
            this.tracksCategory(Number(id));
            return this.trackService.getCategory(id).pipe(
              map(response => response.data)
            );
          }else{
            return new Observable<any>();
          }
        })
      ).subscribe({
        next: (category) => {
          this.category = category;
        },
        error: (error) => {
          console.error('error:', error);
          this.errorMessage = error;
        }
      })
    );
  }

  //Recibo los track para mostrar segun la categoria
  tracksCategory(id: number) {
    if(id === 0){
      this.getTrensTracks(this.currentPage); 
    }else{
      this.loadVideosByCategory(id, this.currentPage);
    }  
  }

  loadVideosByCategory(id: number, page:number) {
    this.subscriptions.add(
      this.trackService.getTracksByCategory(id, page, this.videosPerPage).subscribe({
        next: (response) => {
          this.videosCategory = response.data;
          this.totalPages = Math.ceil(response.total / this.videosPerPage);
          this.viewportScroller.scrollToPosition([0, 0]);
        },
        error: (errorTracks) => {
          console.error('error: ', errorTracks);
          this.errorMessage = errorTracks;
        }
      })
    );
  }

  //Obtener videos Mas Populares
  getTrensTracks(page: number){
    this.subscriptions.add(
      this.trackService.getTracksLikePaginate(page, this.videosPerPage).subscribe({
        next: (response) => {
          // Ordena los tracks por número de likes en orden descendente
          this.videosCategory = response.data;
          this.totalPages = Math.ceil(response.total / this.videosPerPage);
        },
        error: (errorTracks) => {
          console.error('error: ', errorTracks);
          this.errorMessage = errorTracks;
        }
      })
    )
  }

  onPageChange(newPage: number) {
    this.currentPage = newPage;
    this.tracksCategory(Number(this.idCategory));
    this.viewportScroller.scrollToPosition([0, 0]);
  }

  getThumb(url: string, size: string) {
    if (!url) {
      return '';
    }
    const results = url.match('[\\?&]v=([^&#]*)');
    const video = results ? results[1] : url;

    return `https://img.youtube.com/vi/${video}/${size}.jpg`;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
