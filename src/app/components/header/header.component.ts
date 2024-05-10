import { Component, Input, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { User } from '../../interface/userModel';
import { Router } from '@angular/router';
import { TracksService } from '../../services/tracks/tracks.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  @Input() userData?:User;
  @Input() userLoginOn: boolean = false;
  categories?: any;
  errorMessage: string ="";

  constructor(
    private userService: UserService, 
    private router: Router,
    private trackService: TracksService
  ) {}

  ngOnInit(){
    this.getCategories();
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
      complete: () => {
        //console.log("Categorias recibidas correctamente", this.categories)
      }
    })
  }

  logout(){
    this.userService.logout();
    this.router.navigate(['/inicio']);
  }

  expandCollapse() {
    const dropdown = document.getElementById('user-dropdown');
    if (dropdown) {
      dropdown.classList.toggle('hidden');
    }
  }
}

  

