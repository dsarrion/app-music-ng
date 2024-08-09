import { Component, OnDestroy } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-perfil-option',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './perfil-option.component.html',
  styleUrl: './perfil-option.component.css'
})
export class PerfilOptionComponent implements OnDestroy {
  showModal = false;
  private subscriptions: Subscription = new Subscription();

  constructor(private userService: UserService, private router: Router){}

  toggleModal() {
    this.showModal = !this.showModal;
  }

  confirmLogout() {
    this.logout();
    this.showModal = false; // Ocultar modal después de cerrar sesión
  }

  logout() {
    this.subscriptions.add(
      this.userService.logout().subscribe({
        next:(data) => {
          this.router.navigate(['/inicio']);
          console.log("Usuario LOGOUT correcto");
        },
        error: (err) => {
          console.error("Error al realizar logout", err);
        }
      })
    )   
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
