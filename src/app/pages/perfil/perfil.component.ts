import { Component, OnDestroy, OnInit } from '@angular/core';
import { PerfilOptionComponent } from '../../components/perfil-option/perfil-option.component';
import { User } from '../../Models/userModel';
import { Subscription } from 'rxjs';
import { UserService } from '../../services/user/user.service';
import { AvatarComponent } from '../../components/avatar/avatar.component';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from '../../components/spinner/spinner.component';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [PerfilOptionComponent, AvatarComponent, CommonModule, SpinnerComponent],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit, OnDestroy{
  userData?: User;
  errorMessage: string = "";
  createdDate: Date | null = null;
  private subscriptions: Subscription = new Subscription;

  constructor(private userService: UserService){}

  ngOnInit(): void {
    
    //Recibir datos de usuario en Edicion
    this.subscriptions.add(
      this.userService.getUserData().subscribe({
        next: (userData) => {
          this.userData = userData;
          if (userData.created_at) {
            // Convertir tiempo Unix a objeto Date
            this.createdDate = new Date(userData.created_at);
          }
        },
        error: (errorData) => {
          this.errorMessage = errorData;
        },
        complete: () => {
          //console.log("completadoooOO", this.userData)
        }
      })
    )
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
