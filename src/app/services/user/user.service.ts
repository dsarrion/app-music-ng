import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, throwError, tap, map } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { User } from '../../interface/userModel';
import { LoginModel } from '../../interface/loginModel';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  currentUserLoginOn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  currentUserData: BehaviorSubject<any> = new BehaviorSubject<any>({});

  constructor(private http: HttpClient) {
    this.inicializarSessionStorage();
  }

  getHeaders(){
    const token = sessionStorage.getItem('token_user');
    const headers = { Authorization: `Bearer ${token}` };
    return headers;
  }

  private inicializarSessionStorage(): void {
    if (typeof sessionStorage !== 'undefined') {
      const token = sessionStorage.getItem("token_user");
      if (token) {
        this.getUserData().subscribe({
          next: (userData) => {
            this.currentUserLoginOn.next(true);
            this.currentUserData.next(userData);
          },
          error: (error) => {
            console.error('Error al obtener los datos del usuario:', error);
            this.currentUserLoginOn.next(false);
            this.currentUserData.next(null);
          }
        });
      } else {
        this.currentUserLoginOn.next(false);
        this.currentUserData.next(null);
      }
    } else {
      console.warn('sessionStorage no está disponible.');
    }
  }

  login(form: LoginModel): Observable<any> {
    return this.http.post<any>(environment.apiUrlBase+"/auth/login", form).pipe(
      tap((userData) => {
        sessionStorage.setItem("token_user", userData.token)
        this.currentUserData.next(userData.data);
        this.currentUserLoginOn.next(true);
      }),
      map((userData) => userData),
      catchError(this.handleError)
    );
  }

  register(form: any) {
    return this.http.post<any>(`${environment.apiUrlBase}/auth/register`, form).pipe(
        catchError(this.handleError)
      )
  }

  update(form: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.put<any>(environment.apiUrlBase+"/user/update", form, { headers }).pipe(
        catchError(this.handleError)
      )
  }

  logout() {
    sessionStorage.removeItem('token_user');
    this.currentUserLoginOn.next(false);
  }

  getUserData(): Observable<User> {
    const token = sessionStorage.getItem('token_user');
    if(!token){
      return throwError(() => new Error('Token no encontrado.'));
    }
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<User>(environment.apiUrlBase+"/user", { headers }).pipe(
      catchError(this.handleError)
    )
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('Se ha producido un error ', error.error)
    } else {
      console.error('Backend devolvió el código de estado ', error);
    }
    return throwError(() => new Error('Algo falló. Por favor intente nuevamente.'));
  }
}
