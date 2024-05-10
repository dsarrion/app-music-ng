import { Component, OnInit, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import Validation from './utils/validation';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user/user.service';
import { User } from '../../interface/userModel';


@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent implements OnInit {

  @Input() edit: boolean = false;
  userData?: User;
  submitted = false;
  errorMessage:string = "";
  updateMessage: string = "Los datos se actualizaron correctamente";
  form: FormGroup = new FormGroup({});

  constructor(
    private formBuilder: FormBuilder, 
    private userService: UserService, 
    private router: Router
  ){ }

  ngOnInit(): void {

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

    if (this.edit) {
      //Recibir datos de usuario 
      this.userService.getUserData().subscribe({
        next: (userData) => {
          this.userData = userData;
          if (this.userData) {
            this.form.patchValue({
              name: this.userData.name,
              surname: this.userData.surname,
              nick: this.userData.nick,
              email: this.userData.email,
              avatar: this.userData.avatar
            })
          }
        },
        error: (errorData) => {
          this.errorMessage = errorData;
        },
        complete: () => {
          //console.log("completadoooOO", this.userData)
        }
      })
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  async onSubmit(form: void) {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    // Formulario de registro
    if (!this.edit) {
      if (this.form.valid) {
        this.userService.register(this.form.value).subscribe({
          next: (userData) => {
            console.log("Usuario registrado CORRECTAMENTE");
          },
          error: (errorData) => {
            console.error(errorData);
          },
          complete: () => {
            this.router.navigate(['/inicio']);
            this.form.reset();
          }
        })
      } else {
        return;
      }
    } else {   
      // Formulario de Update
      if (this.form.valid) {
        this.userService.update(this.form.value).subscribe({
          next: (userData) => {
            console.log(userData)
          },
          error: (errorData) => {
            console.error(errorData);
          },
          complete: () => {
            console.log("Usuario actualizado CORRECTAMENTE");
          }
        })
      } else {
        return;
      }
    }
  }

}
