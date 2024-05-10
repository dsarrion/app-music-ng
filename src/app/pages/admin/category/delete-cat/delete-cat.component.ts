import { Component } from '@angular/core';
import { AddCategoryComponent } from '../add-category/add-category.component';

@Component({
  selector: 'app-delete-cat',
  standalone: true,
  imports: [AddCategoryComponent],
  templateUrl: './delete-cat.component.html',
  styleUrl: './delete-cat.component.css'
})
export class DeleteCatComponent {
delete_cat:boolean = true;
}
