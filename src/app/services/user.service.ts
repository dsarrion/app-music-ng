import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private httpClient = inject(HttpClient);
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = 'http://www.api-music-laravel.com.devel/api';
  }

  register(form:any){
    return firstValueFrom(
      this.httpClient.post<any>(`${this.apiUrl}/auth/register` ,form)
    ) 
  }

  login(form:any){
    return firstValueFrom(
      this.httpClient.post<any>(`${this.apiUrl}/auth/login` ,form)
    ) 
  }
}
