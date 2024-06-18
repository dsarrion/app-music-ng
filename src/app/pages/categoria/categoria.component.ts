import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TracksService } from '../../services/tracks/tracks.service';
import { Track } from '../../Models/trackModel';
import { BehaviorSubject, Observable, Subscription, map, switchMap} from 'rxjs';
import { CategoryModel } from '../../Models/categoryModel';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-categoria',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './categoria.component.html',
  styleUrl: './categoria.component.css'
})
export class CategoriaComponent implements OnInit, OnDestroy {

  videosCategory?: Track[];
  category$! : Observable<CategoryModel>;
  errorMessage: string = "";
  private subscriptions: Subscription = new Subscription();
  private categoryIdSubject = new BehaviorSubject<string>('');

  @Input('id')
  set idCategory(value: string) {
    this.categoryIdSubject.next(value); 
  }

  get idCategory(): string {
    return this.categoryIdSubject.value;
  }

  constructor(private trackService: TracksService) { }

  ngOnInit(): void {

    this.subscriptions.add(
      this.categoryIdSubject.pipe(
        switchMap(id => {
          if (id) {
            this.tracksCategory(id);
            return this.trackService.getCategory(id).pipe(
              map(response => response.data)
            );
          } else {
            return new Observable<any>();
          }
        })
      ).subscribe({
        next: (category) => {
          this.category$ = new Observable((observer) => observer.next(category));
        },
        error: (error) => {
          console.error('error:', error);
          this.errorMessage = error;
        }
      })
    );

  }

  //Recibo los track para mostrar segun la categoria
  tracksCategory(id: string) {
    this.subscriptions.add(
      this.trackService.getTracksByCategory(id).subscribe({
        next: (response) => {
          // Ordenar videos por mas recientes primero
          this.videosCategory = response.data.sort((a: any, b: any) => {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          });
        },
        error: (errorTracks) => {
          console.error('error: ', errorTracks);
          this.errorMessage = errorTracks;
        },
        complete: () => {
          //console.log("Videos recibidos correctamente", this.videosCategory)
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

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
