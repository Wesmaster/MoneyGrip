import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import BasisBeheerOverzicht from '../basisBeheerOverzicht';

@Injectable({
  providedIn: 'root'
})

export class BasisService
{
  private headers: HttpHeaders;
  private accessPointUrl: string;

  constructor(private http: HttpClient)
  {
    this.headers = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
  }

  public setAccessPointUrl(urlLink: string)
  {
    this.accessPointUrl = environment.api_url + urlLink;
  }

  public async add(item)
  {
    return await this.http.post(this.accessPointUrl, item, {headers: this.headers}).toPromise();
  }

  public getAll(): Observable<BasisBeheerOverzicht[]>
  {
    return this.http.get<BasisBeheerOverzicht[]>(this.accessPointUrl, {headers: this.headers});
  }

  public get(id): Observable<BasisBeheerOverzicht>
  {
    return this.http.get<BasisBeheerOverzicht>(this.accessPointUrl + '/' + id, {headers: this.headers});
  }

  public async update(item)
  {
    return await this.http.put<BasisBeheerOverzicht>(this.accessPointUrl + '/' + item.id, item, {headers: this.headers}).toPromise();
  }

  public delete(id)
  {
    return this.http.delete(this.accessPointUrl + '/' + id, {headers: this.headers});
  }
}
