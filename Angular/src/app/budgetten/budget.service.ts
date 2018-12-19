import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, observable } from 'rxjs';
import { Budget } from './budget/budget';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  private headers: HttpHeaders;
  private accessPointUrl: string = environment.api_url + 'budget';

  constructor(private http: HttpClient)
  {
    this.headers = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
  }

  public async add(item)
  {
    return await this.http.post(this.accessPointUrl, item, {headers: this.headers}).toPromise();
  }

  public getAll(): Observable<Budget[]>
  {
    return this.http.get<Budget[]>(this.accessPointUrl, {headers: this.headers});
  }

  public get(id): Observable<Budget>
  {
    return this.http.get<Budget>(this.accessPointUrl + "/" + id, {headers: this.headers});
  }

  public async update(item)
  {
    return await this.http.put<Budget>(this.accessPointUrl + "/" + item.id, item, {headers: this.headers}).toPromise();
  }

  public delete(id)
  {
    return this.http.delete(this.accessPointUrl + "/" + id, {headers: this.headers});
  }
}
