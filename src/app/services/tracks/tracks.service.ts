import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class TracksService {

  constructor(private http: HttpClient) {}

  getTracksByCategory(category_id: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrlBase}/tracks/by-category/${category_id}`);
  }
}
