import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from '../../services/user/user.service';
import { AvatarComponent } from '../avatar/avatar.component';

@Component({
  selector: 'app-nav-movile',
  standalone: true,
  imports: [RouterLink, AvatarComponent],
  templateUrl: './nav-movile.component.html',
  styleUrl: './nav-movile.component.css'
})
export class NavMovileComponent implements OnInit, OnDestroy{
  userLoginOn:boolean = false;
  private subscriptions: Subscription = new Subscription();

  constructor(private userService: UserService){}

  ngOnInit(): void {
    this.subscriptions.add(
      this.userService.currentUserLoginOn.subscribe({
        next: (userLoginOn) => {
          this.userLoginOn = userLoginOn;
        }
      })
    )
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
