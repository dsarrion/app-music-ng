import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TracksService } from '../../services/tracks/tracks.service';
import { Track } from '../../Models/trackModel';
import { BehaviorSubject, Observable, Subscription, map, switchMap} from 'rxjs';
import { CategoryModel } from '../../Models/categoryModel';
import { CommonModule, ViewportScroller } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { TrendsComponent } from '../../components/trends/trends.component';

@Component({
  selector: 'app-categoria',
  standalone: true,
  imports: [CommonModule, RouterLink, SpinnerComponent, TrendsComponent], 
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
  totalVideos: number = 0;
  videosPerPage: number = 8;
  isLoading: boolean = false;

  @Input('id')
  set idCategory(value: string) {
    this.categoryIdSubject.next(value);
  }
  get idCategory(): string {
    return this.categoryIdSubject.value;
  }
  

  constructor(private trackService: TracksService, private viewportScroller: ViewportScroller) { }

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
      this.getTrensTracks(); 
    }else{
      this.loadVideosByCategory(id, this.currentPage);
    }  
  }

  loadVideosByCategory(id: number, page: number) {
    this.isLoading = true;
    this.subscriptions.add(
      this.trackService.getTracksByCategory(id, page, this.videosPerPage).subscribe({
        next: (response) => {
          this.videosCategory = response.data;
          this.currentPage = response.current_page;
          this.totalPages = response.last_page;
          this.totalVideos = response.total;
          this.isLoading = false;
        },
        error: (errorTracks) => {
          console.error('error: ', errorTracks);
          this.errorMessage = errorTracks;
          this.isLoading = false;
        }
      })
    );
  }

  //Obtener videos Mas Populares
  getTrensTracks(){
    this.subscriptions.add(
      this.trackService.getAllTracks().subscribe({
        next: (response) => {
          const tracks = response;
          // Ordena los tracks por número de likes en orden descendente
        const sortedTracks = tracks.sort((a: any, b: any) => b.likes - a.likes);
        this.videosCategory = sortedTracks
        }
      })
    )
  } 

  getThumb(url: string, size: string) {
    if (!url) {
      return '';
    }
    const results = url.match('[\\?&]v=([^&#]*)');
    const video = results ? results[1] : url;

    return `http://img.youtube.com/vi/${video}/${size}.jpg`;
  }

  loadNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadVideosByCategory(Number(this.idCategory), this.currentPage);
    }
  }

  loadPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadVideosByCategory(Number(this.idCategory), this.currentPage);
    }
  }

  scrollTop(){
    this.viewportScroller.scrollToPosition([0, 0]);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
