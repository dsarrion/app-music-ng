import { Component } from '@angular/core';
import { RegistroComponent } from '../registro/registro.component';
import { PerfilOptionComponent } from '../../components/perfil-option/perfil-option.component';

@Component({
  selector: 'app-ajustes',
  standalone: true,
  imports: [RegistroComponent, PerfilOptionComponent],
  templateUrl: './ajustes.component.html',
  styleUrl: './ajustes.component.css'
})
export class AjustesComponent {
  edit: boolean = true;
}
