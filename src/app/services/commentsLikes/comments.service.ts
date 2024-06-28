import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable, catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  constructor(private http: HttpClient) { }

  getHeaders(){
    const token = localStorage.getItem('token_user');
    const headers = { Authorization: `Bearer ${token}` };
    return headers;
  }

  //COMMENTS

  getCommentsByVideo(id:number): Observable<any>{
    return this.http.get<any>(environment.apiUrlBase+'/comments/by-video/'+id).pipe(
      catchError(this.handleError))
  }

  createComment(form: FormData): Observable<any>{
    return this.http.post<any>(environment.apiUrlBase+'/comments', form).pipe(
      catchError(this.handleError))
  }

  //LIKES

  createLike(userId: number, trackId: number): Observable<any>{
    const headers = this.getHeaders();
    const body = { user_id: userId, track_id: trackId };
    return this.http.post<any>(environment.apiUrlBase+'/likes', body, { headers }).pipe(
      catchError(this.handleError))
  }

  deleteLike(id:number){
    const headers = this.getHeaders();
    return this.http.delete<any>(environment.apiUrlBase+'/likes/'+ id, { headers }).pipe(
      catchError(this.handleError))
  }

  hasLike(userId: number, trackId: number): Observable<any>{
    const headers = this.getHeaders();
    return this.http.get<any>(environment.apiUrlBase+'/likes/user/'+userId+'/track/'+trackId, { headers }).pipe(
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
