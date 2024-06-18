import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user/user.service';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../Models/userModel';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  loginError: string = "";
  userData?: User;
  submitted = false;
  loginOn?: boolean;
  form: FormGroup = new FormGroup({});

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService
  ){}

  ngOnInit(): void {

    this.userLoginOn();

    this.form = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]]
      })
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  userLoginOn(){
    this.userService.currentUserLoginOn.subscribe({
      next: (value: boolean) => {
        this.loginOn = value;
        if(this.loginOn){
          this.router.navigate(['/inicio']);
        }
      }
    })
  }

  async onSubmit(form: void) {
    this.submitted = true;

    if (this.form.valid) {
      this.userService.login(this.form.value).subscribe({
        next: (userData) => { 
          console.log(userData.message)
        },
        error: (errorData) => {
          console.error(errorData);
          this.loginError = errorData;
        },
        complete: () => {
          this.router.navigate(['/inicio']);
          this.form.reset();
        }
      });
    } else {
      return;
    }
  }

}
