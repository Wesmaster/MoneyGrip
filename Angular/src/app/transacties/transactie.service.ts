import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Transactie } from './transactie/transactie';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransactieService 
{
  private headers: HttpHeaders;
  private accessPointUrl: string = environment.api_url + 'transactie';

  constructor(private http: HttpClient)
  {
    this.headers = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
  }

  public async add(item)
  {
    return await this.http.post(this.accessPointUrl, item, {headers: this.headers}).toPromise();
  }

  public getAll(jaar: number, maand: number): Observable<Transactie[]>
  {
    return this.http.get<Transactie[]>(this.accessPointUrl + "/" + jaar + "/" + maand, {headers: this.headers});
  }

  public get(id): Observable<Transactie>
  {
    return this.http.get<Transactie>(this.accessPointUrl + "/" + id, {headers: this.headers});
  }

  public async update(item)
  {
    return await this.http.put<Transactie>(this.accessPointUrl + "/" + item.id, item, {headers: this.headers}).toPromise();
  }

  public delete(id)
  {
    return this.http.delete(this.accessPointUrl + "/" + id, {headers: this.headers});
  }

  public getJaarFilter(): Observable<number[]>
  {
    return this.http.get<number[]>(this.accessPointUrl, {headers: this.headers});
  }
}
