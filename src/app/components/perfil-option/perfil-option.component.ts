import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-perfil-option',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './perfil-option.component.html',
  styleUrl: './perfil-option.component.css'
})
export class PerfilOptionComponent {
  showModal = false;

  constructor(private userService: UserService, private router: Router){}

  toggleModal() {
    this.showModal = !this.showModal;
  }

  confirmLogout() {
    this.logout();
    this.showModal = false; // Ocultar modal después de cerrar sesión
  }

  logout(){
    this.userService.logout();
    this.router.navigate(['/inicio']);
    console.log("Usuario LOGOUT correcto");
  }

}
