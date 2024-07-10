import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { environment } from '../../../environments/environment';
import { UserService } from '../../services/user/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.css'
})
export class AvatarComponent implements OnInit, OnChanges, OnDestroy {
 
  @Input() size?:number;
  urlImage = environment.apiUrlBase +'/user/avatar/';
  @Input() ImageName?: string | undefined;
  Image!: string;
  @Input() userName?: string;
  isLoading: boolean = true;
  userLoginOn:boolean = false;
  private subcriptions: Subscription = new Subscription();

  constructor(private userService: UserService){}

  ngOnInit(): void {
    this.LoginOn();

    if(!this.ImageName){
      this.getImageName();
    }else{
      this.getAvatar(this.ImageName);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ImageName'] && !changes['ImageName'].isFirstChange()) {

      if(this.ImageName){
        this.getAvatar(this.ImageName);
        //console.log("Hay cambios: " ,this.ImageName)
      }
    }
  }

  async getImageName(){
    this.subcriptions.add(
      await this.userService.currentUserData.subscribe({
        next: (data) => {
          this.ImageName = data?.avatar;    
          if(this.ImageName){
            this.getAvatar(this.ImageName);
          }
        },
        error: (err) => {
          console.error('Error:', err);
        }
      })
    )
  }

  async getAvatar(name: string | undefined){
    this.subcriptions.add(
      await this.userService.getAvatar(name).subscribe({
        next: (data: any) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            this.Image = reader.result as string;
            this.isLoading = false;
          };
          reader.readAsDataURL(data);
        },
        error: (err) => {
          console.error('Error al cargar la imagen:', err);
          setTimeout(() => {
            this.getAvatar(name);
          }, 1000);
        }
      })
    ) 
  }

  LoginOn(){
    this.subcriptions.add(
      this.userService.currentUserLoginOn.subscribe({
        next: (data:boolean) => {
          this.userLoginOn = data;
        }
      })
    )  
  }

  ngOnDestroy(): void {
    this.subcriptions.unsubscribe();
  }
}
