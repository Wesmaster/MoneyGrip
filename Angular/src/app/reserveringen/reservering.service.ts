import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Reservering } from './reservering/reservering';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReserveringService
{
  private headers: HttpHeaders;
  private accessPointUrl: string = environment.api_url + 'reservering';

  constructor(private http: HttpClient)
  {
    this.headers = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
  }

  public async add(item)
  {
    return await this.http.post(this.accessPointUrl, item, {headers: this.headers}).toPromise();
  }

  public getAll(): Observable<Reservering[]>
  {
    return this.http.get<Reservering[]>(this.accessPointUrl, {headers: this.headers});
  }

  public get(id): Observable<Reservering>
  {
    return this.http.get<Reservering>(this.accessPointUrl + "/" + id, {headers: this.headers});
  }

  public async update(item)
  {
    return await this.http.put<Reservering>(this.accessPointUrl + "/" + item.id, item, {headers: this.headers}).toPromise();
  }

  public delete(id)
  {
    return this.http.delete(this.accessPointUrl + "/" + id, {headers: this.headers});
  }
}
