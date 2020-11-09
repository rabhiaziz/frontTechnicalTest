import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class FileService {

  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    }),
  };

  baseUrl: string = 'http://localhost:8080';
  
  constructor(private http: HttpClient) { }

  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error("An error occurred:", error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    return throwError(error.error);
  }


  get(): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/api/items', this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getById(uri: string) {
    return this.http
    .get<any>(this.baseUrl + uri, this.httpOptions)
    .pipe(catchError(this.handleError));
  }

  download(uri: string) : Observable <Blob>{
    return this.http.get(this.baseUrl + uri, {responseType: 'blob'}).pipe(catchError(this.handleError));
  }

  upload(uri, formData) {
    return this.http.post<any>(this.baseUrl + uri, formData, {  
        reportProgress: true,  
        observe: 'events'  
      }).pipe(catchError(this.handleError));  
  }
  
}
