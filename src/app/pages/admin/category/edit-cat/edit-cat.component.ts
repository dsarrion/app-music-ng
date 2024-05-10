import { Component } from '@angular/core';
import { AddCategoryComponent } from '../add-category/add-category.component';

@Component({
  selector: 'app-edit-cat',
  standalone: true,
  imports: [AddCategoryComponent],
  templateUrl: './edit-cat.component.html',
  styleUrl: './edit-cat.component.css'
})
export class EditCatComponent {
  edit_cat:boolean = true;
}
