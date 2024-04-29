import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import Validation from './utils/validation';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent implements OnInit {

  userData?: any = {};
  errorMessage: String="";
  @Input() edit: boolean = false;
  submitted = false;
  form: FormGroup = new FormGroup({});

  constructor(private formBuilder: FormBuilder, private userService: UserService) {
    
      this.userService.getUserData().subscribe({
        next: (userData) => {
          this.userData = userData
        },
        error: (errorData) => {
          this.errorMessage = errorData
        },
        complete: () => {
          // Rellenamos el form con los datos del usuario
          if(this.edit){
            this.form.patchValue(this.userData);
          }
        }
      })
    
  }

  async ngOnInit(): Promise < void> {

      this.form = this.formBuilder.group(
        {
          name: ['', [Validators.required, Validators.maxLength(20)]],
          surname: ['', [Validators.required, Validators.maxLength(20)]],
          nick: ['', [Validators.required, Validators.maxLength(20)]],
          email: ['', [Validators.required, Validators.email]],
          password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(40)]],
          vpass: ['', Validators.required],
          avatar: null,
          acceptTerms: [false, Validators.requiredTrue]
        },
        {
          validators: [Validation.match('password', 'vpass')]
        })

  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }


  async onSubmit(form: void) {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }
    //Si es el formulario de registro
    if (!this.edit) {
      const response = await this.userService.register(this.form.value);

      console.log(response);
    } else {   //Si es el formulario de update
      const response = await this.userService.update(this.form.value);

      console.log(response);
    }
  }
}
