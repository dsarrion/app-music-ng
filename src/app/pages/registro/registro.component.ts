import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { User } from '../../models/user';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
  public user: User;

  constructor(){
    this.user = new User( 1, 'ROLE_USER','', '', '', '', '','','');
  }

  onSubmit(form:any){
    console.log(this.user);
  }
}
