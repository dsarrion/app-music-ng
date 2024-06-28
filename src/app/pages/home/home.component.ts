import { Component, OnDestroy, OnInit } from '@angular/core';
import { ContentComponent } from '../../components/content/content.component';
import { TracksService } from '../../services/tracks/tracks.service';
import { Subscription } from 'rxjs';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { TrendsComponent } from '../../components/trends/trends.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ContentComponent, SpinnerComponent, TrendsComponent],
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

  getCategoriesWithTracks() {
    this.subscriptions.add(
      this.trackService.getCategories().subscribe({
        next: (categories) => {
          //console.log("categorias:",categories);
          this.trackService.getAllTracks().subscribe({
            next: (response) => {
              const idsCategories = new Set(response.map((track: any) => track.category_id)); // Sacar los ids de las categorias
              this.categories = categories.filter((category: any) => idsCategories.has(category.id)); // Filtrar las categorías con tracks
            },
            error: (errorData) => {
              console.error(errorData);
              this.errorMessage = errorData;
            },
          })
        },
        error: (errorData) => {
          console.error(errorData);
          this.errorMessage = errorData;
        },
      })
    )
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
