import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Persoon } from './persoon/persoon';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class PersoonService
{
  private headers: HttpHeaders;
  private accessPointUrl: string = environment.api_url + 'persoon';

  constructor(private http: HttpClient)
  {
    this.headers = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
  }

  public async add(item)
  {
    return await this.http.post(this.accessPointUrl, item, {headers: this.headers}).toPromise();
  }

  public getAll(): Observable<Persoon[]>
  {
    return this.http.get<Persoon[]>(this.accessPointUrl, {headers: this.headers});
  }

  public get(id): Observable<Persoon>
  {
    return this.http.get<Persoon>(this.accessPointUrl + "/" + id, {headers: this.headers});
  }

  public async update(item)
  {
    return await this.http.put<Persoon>(this.accessPointUrl + "/" + item.id, item, {headers: this.headers}).toPromise();
  }

  public delete(id)
  {
    return this.http.delete(this.accessPointUrl + "/" + id, {headers: this.headers});
  }
}
