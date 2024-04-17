import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import Validation from './utils/validation';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent implements OnInit {

  usersService = inject(UserService);

  form: FormGroup = new FormGroup({
    name: new FormControl(''),
    surname: new FormControl(''),
    nick: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    vpass: new FormControl(''),
    acceptTerms: new FormControl(false),
  });
  submitted = false;

  constructor(private formBuilder: FormBuilder){}

  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        name: ['', [Validators.required, Validators.maxLength(20)]],
        surname: ['', [Validators.required, Validators.maxLength(20)]],
        nick: ['', [Validators.required, Validators.maxLength(20)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(40)]],
        vpass: ['', Validators.required],
        acceptTerms: [false, Validators.requiredTrue]
      },
      {
        validators: [Validation.match('password', 'vpass')]
      })
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  async onSubmit(form:void){
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    const response = await this.usersService.register(this.form.value);

    console.log(response);
  }
}
