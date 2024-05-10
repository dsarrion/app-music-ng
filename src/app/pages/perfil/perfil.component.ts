import { Component } from '@angular/core';
import { RegistroComponent } from '../registro/registro.component';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [RegistroComponent],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {
  edit: boolean = true;
}
