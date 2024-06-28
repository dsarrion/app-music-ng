import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css'
})
export class AdminPanelComponent implements OnChanges, OnDestroy {
  admin: boolean = false;

  constructor( private userService: UserService, private router: Router){}

  ngOnChanges(changes: SimpleChanges): void {
    this.isAdmin();
  }

  isAdmin(){
    this.userService.currentUserData.subscribe({
      next: (response) => {
        if(response && response.role === "ADMIN_1"){
          this.admin = true;
          
        } 
        if(!this.admin){
          this.router.navigate(['/inicio']);
        }
      }   
    })
  }

  ngOnDestroy(): void {
    this.userService.currentUserData.unsubscribe();
  }
}
