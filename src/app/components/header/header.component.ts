import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { User } from '../../Models/userModel';
import { Router } from '@angular/router';
import { TracksService } from '../../services/tracks/tracks.service';
import { Subscription } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { AvatarComponent } from '../avatar/avatar.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterOutlet, AvatarComponent, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy, OnChanges {
  @Input() userData?: User;
  @Input() userLoginOn: boolean = false;
  title: string = "DJsConTalento";
  categories?: any;
  errorMessage: string ="";
  urlImage: string = environment.apiUrlBase+'/user/avatar/';
  imageName: string | undefined;
  isDropdownOpen: boolean = false;
  hideTimeout: any;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private userService: UserService, 
    private router: Router,
    private trackService: TracksService
  ) {}

  ngOnInit(){
    this.imageName = this.userData?.avatar;

    this.getCategoriesWithTracks();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userData']) {
      if (changes['userData'].currentValue) {
        this.imageName = changes['userData'].currentValue.avatar;
        //console.log('userData ha cambiado: ', this.userData);
      } else if (changes['userData'].previousValue) {
        this.imageName = undefined;
        //console.log('userData ha cambiado a undefined');
      }
    }
  }

  getCategoriesWithTracks() {
    this.subscriptions.add(
      this.trackService.getCategories().subscribe({
        next: (categories) => {
          this.trackService.getAllTracks().subscribe({
            next: (tracks) => {
              const idsCategories = new Set(tracks.map((track: any) => track.category_id)); // Sacar los ids de las categorias
              this.categories = categories.filter((category: any) => idsCategories.has(category.id)); // Filtrar las categorías con tracks
            },
            error: (errorData) => {
              console.error(errorData);
              this.errorMessage = errorData;
            },
            complete: () => {
              //console.log("Categorías recibidas correctamente", this.categories);
            }
          })
        },
        error: (errorData) => {
          console.error(errorData);
          this.errorMessage = errorData;
        }
      })
    )
  }

  logout(){
    this.userService.logout();
    this.router.navigate(['/inicio']);
    console.log("Usuario LOGOUT correcto");
  }

  expandCollapse() {
    const dropdown = document.getElementById('user-dropdown');
    if (dropdown) {
      dropdown.classList.toggle('hidden');
    }
  }

  showDropdown() {
    // Cancelar la ocultacion si vuelve el mouse
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
    this.isDropdownOpen = true;
  }

  hideDropdown() {
    // Retrasar la acción de ocultar
    this.hideTimeout = setTimeout(() => {
      this.isDropdownOpen = false;
    }, 200);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}

  

