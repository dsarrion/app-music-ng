import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OnInit } from '@angular/core'; 
import { initFlowbite } from 'flowbite';

import { FooterComponent } from './components/footer/footer.component';
import { ContentComponent } from './components/content/content.component';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FooterComponent, ContentComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Talento DJs';

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
  }
}
