import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { TracksService } from '../../../../services/tracks/tracks.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-add-category',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.css'
})
export class AddCategoryComponent implements OnInit {
  errorMessage: string = "";
  submitted: boolean = false;
  categories?: any;
  @Input() delete_cat:boolean = false;
  @Input() edit_cat:boolean = false;
  form: FormGroup = new FormGroup({});

  constructor(
    private trackService: TracksService, 
    private router: Router,
    private formBuilder: FormBuilder
  ){}

  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        name: ['', Validators.required],
        id: '',
      }
    )

    this.getCategories();

    console.log("edit: ",this.edit_cat);
    console.log("delete:", this.delete_cat);
  }

  getCategories(){
    this.trackService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories
      },
      error: (errorData) => {
        console.error(errorData);
        this.errorMessage = errorData;
      }, 
      complete: () => {}
    })
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    if(!this.edit_cat && !this.delete_cat !){
      if (this.form.valid) {
        this.trackService.addCategory(this.form.value).subscribe({
          next: (category) => {
            console.log(category)
          },
          error: (errorData) => {
            console.error(errorData);
            this.errorMessage = errorData;
          },
          complete: () => {
            this.router.navigate(['/admin_panel']);
            this.form.reset();
          }
        });
      } else {
        return;
      }
    } else if (this.delete_cat){
      if (this.form.valid) {
        const selectedCategoryId = this.form.value.name;
        this.trackService.deleteCategory(selectedCategoryId).subscribe({
          next: (category) => {
            console.log(category)
          },
          error: (errorData) => {
            console.error(errorData);
            this.errorMessage = errorData;
          },
          complete: () => {
            this.router.navigate(['/admin_panel']);
            this.form.reset();
          }
        });
      } else {
        return;
      }
    } else {
      if (this.form.valid) {
        const idCategory = this.form.value.id;
        this.trackService.editCategory(this.form.value, idCategory).subscribe({
          next: (category) => {
            console.log(category)
          },
          error: (errorData) => {
            console.error(errorData);
            this.errorMessage = errorData;
          },
          complete: () => {
            this.router.navigate(['/admin_panel']);
            this.form.reset();
          }
        });
      } else {
        return;
      }
    }
    
  }

}
