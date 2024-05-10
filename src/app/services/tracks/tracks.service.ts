import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Track } from '../../interface/trackModel';
import { CategoryModel } from '../../interface/categoryModel';

@Injectable({
  providedIn: 'root'
})
export class TracksService {

  constructor(private http: HttpClient) {}

  getHeaders(){
    const token = sessionStorage.getItem('token_user');
    const headers = { Authorization: `Bearer ${token}` };
    return headers;
  }

  createVideo(form: Track): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<any>(environment.apiUrlBase+'/tracks', form, { headers }).pipe(
      catchError(this.handleError)
    )
  }

  updateTrack(form:Track , id:number): Observable<Track> {
    const headers = this.getHeaders();
    return this.http.put<Track>(environment.apiUrlBase+'/tracks/'+id, form, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  getTrack(id:number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(environment.apiUrlBase+'/tracks/'+id, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  getAllTracks(): Observable<any> {
    return this.http.get<any>(environment.apiUrlBase+'/tracks').pipe(
      catchError(this.handleError)
    );
  }

  deleteTrack(id:number) {
    const headers = this.getHeaders();
    return this.http.delete(environment.apiUrlBase+'/tracks/'+id, { headers }).pipe(
      catchError(this.handleError)
    );
  }

      //CATEGORIAS

  getTracksByCategory(category_id: number): Observable<any> {
    return this.http.get<any>(environment.apiUrlBase+'/tracks/by-category/'+category_id).pipe(
      catchError(this.handleError)
    );
  }

  getCategories(): Observable<any>{
    return this.http.get<any>(environment.apiUrlBase+'/categories').pipe(
      catchError(this.handleError)
    )
  }

  addCategory(form: CategoryModel): Observable<any>{
    return this.http.post<any>(environment.apiUrlBase+'/categories', form).pipe(
      catchError(this.handleError)
    )
  }

  editCategory(form: CategoryModel, id:number): Observable<any> {
    return this.http.put<any>(environment.apiUrlBase+'/categories/'+id, form).pipe(
      catchError(this.handleError)
    )
  }

  deleteCategory(id:number): Observable<any>{
    return this.http.delete<any>(environment.apiUrlBase+'/categories/'+id).pipe(
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
