import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CategoriaComponent } from './pages/categoria/categoria.component';
import { ContactoComponent } from './pages/contacto/contacto.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { LoginComponent } from './pages/login/login.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { ErrorComponent } from './pages/error/error.component';
import { HeaderComponent } from './components/header/header.component';

export const routes: Routes = [
    {path: "", component: HomeComponent},
    {path: "categoria", component: CategoriaComponent},
    {path: "contacto", component: ContactoComponent},
    {path: "registro", component: RegistroComponent},
    {path: "login", component: LoginComponent},
    {path: "ajustes", component: PerfilComponent},
    {path: "logout", component: HeaderComponent},
    {path: "**", component: ErrorComponent}
];
