import { Component, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OnInit } from '@angular/core'; 
import { initFlowbite } from 'flowbite';

import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { User } from './Models/userModel';
import { UserService } from './services/user/user.service';
import { Subscription } from 'rxjs';
import { NavMovileComponent } from './components/nav-movile/nav-movile.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FooterComponent, HeaderComponent, NavMovileComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Talento DJs';
  userLoginOn:boolean = false;
  userData?: User;
  private subscriptions: Subscription = new Subscription();

  constructor(private userService: UserService){}

  ngOnInit(): void {
    if (typeof document !== 'undefined') {
      // Importar flowbite solo si estamos en un entorno de navegador
      import('flowbite').then(flowbite => {
        // Lógica de inicialización de flowbite
        initFlowbite();
      }).catch(error => {
        console.error('Error al importar flowbite:', error);
      });
    }

    this.subscriptions.add(
      this.userService.currentUserLoginOn.subscribe({
        next: (userLoginOn) => {
          this.userLoginOn = userLoginOn;
        }
      })
    )
  
    this.subscriptions.add(
      this.userService.currentUserData.subscribe({
        next: (userData) => {
          if(userData){
            this.userData = userData;
            //console.log('Datos de usuario en AppComponent: ', this.userData)
          }else{
            this.userData = undefined;
          }
        },
        error: (error) => {
          console.error('Error al obtener los datos del usuario: ', error);
        }
      })
    )
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
