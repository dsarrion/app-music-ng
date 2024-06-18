import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { Subscription } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-avatar-icon',
  standalone: true,
  imports: [ AsyncPipe ],
  templateUrl: './avatar-icon.component.html',
  styleUrl: './avatar-icon.component.css'
})
export class AvatarIconComponent implements OnInit, OnDestroy{
  @Input() ImageName!: string;
  urlImage = environment.apiUrlBase +'/avatar/';
  isLoading: boolean = true;
  private subcriptions: Subscription = new Subscription();

  constructor(private userService: UserService){}
  
 ngOnInit(): void {
   this.getIconAvatar(this.ImageName);
 }

  async getIconAvatar(name: string | undefined){
    this.subcriptions.add(
      await this.userService.getIconAvatar(name).subscribe({
        next: (data: any) => {
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error al cargar la imagen:', err);
          setTimeout(() => {
            this.getIconAvatar(name);
          }, 1000);
        }
      })
    ) 
  }

  ngOnDestroy(): void {
    this.subcriptions.unsubscribe();
  }
}
