import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Afschrijving, AfschrijvingAlgemeen } from './afschrijving/afschrijving';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AfschrijvingenService
{
  private headers: HttpHeaders;
  private accessPointUrl: string = environment.api_url + 'afschrijving';

  constructor(private http: HttpClient)
  {
    this.headers = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
  }

  public getAll(): Observable<Afschrijving[]>
  {
    return this.http.get<Afschrijving[]>(this.accessPointUrl, {headers: this.headers});
  }

  public getAlgemeen(): Observable<AfschrijvingAlgemeen>
  {
    return this.http.get<AfschrijvingAlgemeen>(this.accessPointUrl + '/algemeen', {headers: this.headers});
  }
}
