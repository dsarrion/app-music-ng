import { Component, OnDestroy, OnInit } from '@angular/core';
import { ContentComponent } from '../../components/content/content.component';
import { TracksService } from '../../services/tracks/tracks.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ContentComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy{

  categories?:any;
  errorMessage:string = "";
  private subscriptions: Subscription = new Subscription(); 

  constructor(private trackService: TracksService){}

  ngOnInit(): void {
    this.getCategoriesWithTracks();
  }

  async getCategoriesWithTracks() {
    this.subscriptions.add(
      await this.trackService.getCategories().subscribe({
        next: (categories) => {
          this.trackService.getAllTracks().subscribe({
            next: (tracks) => {
              const idsCategories = new Set(tracks.map((track: any) => track.category_id)); // Sacar los ids de las categorias
              this.categories = categories.filter((category: any) => idsCategories.has(category.id)); // Filtrar las categorías con tracks
            },
            error: (errorData) => {
              console.error(errorData);
              this.errorMessage = errorData;
            },
            complete: () => {
              //console.log("Categorías recibidas correctamente", this.categories);
            }
          })
        },
        error: (errorData) => {
          console.error(errorData);
          this.errorMessage = errorData;
        }
      })
    )
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
