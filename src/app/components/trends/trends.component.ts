import { Component } from '@angular/core';
import { ContentComponent } from '../content/content.component';
import { SpinnerComponent } from '../spinner/spinner.component';
import { CategoryModel } from '../../Models/categoryModel';

@Component({
  selector: 'app-trends',
  standalone: true,
  imports: [ ContentComponent, SpinnerComponent ],
  templateUrl: './trends.component.html',
  styleUrl: './trends.component.css'
})
export class TrendsComponent {
trends:CategoryModel;

constructor(){
  this.trends = {
    'id': 0,
    'name': 'Mas Populares'
  }
}
}
