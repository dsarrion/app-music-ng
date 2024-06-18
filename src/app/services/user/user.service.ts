import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, throwError, tap, map } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { User } from '../../Models/userModel';
import { LoginModel } from '../../Models/loginModel';
import { Blob } from 'buffer';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  currentUserLoginOn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  currentUserData: BehaviorSubject<User | null> = new BehaviorSubject<User |null >(null);

  constructor(private http: HttpClient) {
    this.inicializarLocalStorage();
  }

  getHeaders(): HttpHeaders{
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token_user')}`
    });
  }

  private inicializarLocalStorage(): void {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem("token_user");
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
      console.warn('localStorage no está disponible.');
    }
  }

  login(form: LoginModel): Observable<any> {
    return this.http.post<any>(environment.apiUrlBase+"/auth/login", form).pipe(
      tap((userData) => {
        localStorage.setItem("token_user", userData.token)
        this.currentUserData.next(userData.data);
        this.currentUserLoginOn.next(true);
      }),
      map((userData) => userData),
      catchError(this.handleError)
    );
  }

  register(form: FormData): Observable<any> {
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
    localStorage.removeItem('token_user');
    this.currentUserLoginOn.next(false);
    this.currentUserData.next(null);
  }

  getUserData(): Observable<User> {
    const token = localStorage.getItem('token_user');
    if(!token){
      return throwError(() => new Error('Token no encontrado.'));
    }
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<User>(environment.apiUrlBase+"/user", { headers }).pipe(
      catchError(this.handleError)
    )
  }

  uploadAvatar(formData: FormData): Observable<any>{
    return this.http.post<any>(environment.apiUrlBase+"/user/upload/avatar", formData).pipe(
      catchError(this.handleError)
    )
  }

  getAvatar(name: string |undefined): Observable<Blob> {
    let httpHeaders = new HttpHeaders({'Authorization': `Bearer ${localStorage.getItem('token_user')}`})
                      .set('Accept', "image/webp,*/*");

    return this.http.get<Blob>(environment.apiUrlBase+'/user/avatar/'+name, { headers: httpHeaders, responseType: 'blob' as 'json' }).pipe(
      catchError(this.handleError))
  }

  getIconAvatar(name: string |undefined): Observable<Blob> {
    return this.http.get<Blob>(environment.apiUrlBase+'/avatar/'+name, { responseType: 'blob' as 'json' }).pipe(
      catchError(this.handleError))
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
