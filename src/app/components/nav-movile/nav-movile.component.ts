import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from '../../services/user/user.service';
import { AvatarComponent } from '../avatar/avatar.component';
import { TracksService } from '../../services/tracks/tracks.service';

@Component({
  selector: 'app-nav-movile',
  standalone: true,
  imports: [RouterLink, RouterLinkActive ,AvatarComponent],
  templateUrl: './nav-movile.component.html',
  styleUrl: './nav-movile.component.css'
})
export class NavMovileComponent implements OnInit, OnDestroy{
  userLoginOn:boolean = false;
  categories?: any;
  showCategories: boolean = false;
  private subscriptions: Subscription = new Subscription();

  constructor(private userService: UserService, private trackService: TracksService){}

  ngOnInit(): void {
    this.subscriptions.add(
      this.userService.currentUserLoginOn.subscribe({
        next: (userLoginOn) => {
          this.userLoginOn = userLoginOn;
        }
      })
    )

    this.getCategoriesWithTracks();
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
            },
            complete: () => {
              //console.log("Categorías recibidas correctamente", this.categories);
            }
          })
        },
        error: (errorData) => {
          console.error(errorData);
        }
      })
    )
  }

  toggleCategories(){
    this.showCategories = !this.showCategories;
  }

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: Event) {
    const targetElement = event.target as HTMLElement;
    const clickedInside = targetElement.closest('#categories-menu-button') || 
                          targetElement.closest('#categories-menu');
    if (!clickedInside) {
      this.showCategories = false;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
