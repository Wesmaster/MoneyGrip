import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BegrotingService
{
  private headers: HttpHeaders;
  private accessPointUrl: string = 'https://localhost:44378/api/begroting';

  constructor(private http: HttpClient)
  {
    this.headers = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
  }

  public getFilter(): Observable<number[]>
  {
    return this.http.get<number[]>(this.accessPointUrl, {headers: this.headers});
  }

  public get(jaar): Observable<any>
  {
    return this.http.get<any>(this.accessPointUrl + "/" + jaar, {headers: this.headers});
  }
}
