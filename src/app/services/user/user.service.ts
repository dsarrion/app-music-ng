import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { User } from '../../interface/user';
import { LoginRequest } from '../../interface/loginRequest';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private httpClient = inject(HttpClient);

  constructor(private http: HttpClient) { }

  register(form: any) {
    return firstValueFrom(
      this.http.post<any>(`${environment.apiUrlBase}/auth/register`, form)
    )
  }

  login(form: LoginRequest) {
    return firstValueFrom(
      this.httpClient.post<any>(`${environment.apiUrlBase}/auth/login`, form)
    )
  }

  logout() {
    localStorage.removeItem('token_user');
    
  }

  update(form: any) {
    return firstValueFrom(
      this.httpClient.put<any>(`${environment.apiUrlBase}/user/update`, form)
    )
  }

  getUser(id: number): Observable<User> {
    return this.httpClient.get<User>(environment.apiUrlBase + "user/details" + id);
  }

  //Sacar los datos del usuario con el token de autentificación
  getUserData(): Observable<any> {
    // Verifica si localStorage está definido
    if (typeof localStorage !== 'undefined') {
      // Conseguir token
      const token = localStorage.getItem('token_user');
      if (!token) {
        throw new Error('No hay token de autentificación disponible');
      }

      // Envía el token al encabezado
      const headers = { Authorization: `Bearer ${token}` };

      // Realiza una solicitud al servidor para obtener los datos del usuario
      return this.httpClient.get<any>(`${environment.apiUrlBase}/user`, { headers });
    } else {
      // Si localStorage no está definido, lanza un error o devuelve un observable vacío según tus necesidades
      throw new Error('localStorage is not available');
      // O puedes devolver un observable vacío
      // return new Observable<any>();
    }
  }
}
