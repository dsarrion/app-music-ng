import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { User } from '../../interface/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  userData?:User;
  errorMessage: string = "";
  userLoginOn: boolean = true;

  constructor(private userService: UserService, private router: Router) {

    this.userService.getUser(1).subscribe({
      next: (userData) => {
        this.userData = userData
      },
      error: (errorData) => {
        this.errorMessage = errorData
      },
      complete: () => {
        if (this.userData) {
          this.userLoginOn = true;
          console.log(this.userData);
        }
      }
    })
  }

  logout(){
    this.userService.logout();
    this.router.navigate(['']);
  }





}

  

