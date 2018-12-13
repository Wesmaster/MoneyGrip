import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Contract } from './contract/contract';

@Injectable({
  providedIn: 'root'
})
export class ContractService 
{
  private headers: HttpHeaders;
  private accessPointUrl: string = 'https://localhost:44378/api/contract';

  constructor(private http: HttpClient)
  {
    this.headers = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
  }

  public async add(item)
  {
    return await this.http.post(this.accessPointUrl, item, {headers: this.headers}).toPromise();
  }

  public getAll(): Observable<Contract[]>
  {
    return this.http.get<Contract[]>(this.accessPointUrl, {headers: this.headers});
  }

  public get(id): Observable<Contract>
  {
    return this.http.get<Contract>(this.accessPointUrl + "/" + id, {headers: this.headers});
  }

  public async update(item)
  {
    return await this.http.put<Contract>(this.accessPointUrl + "/" + item.id, item, {headers: this.headers}).toPromise();
  }

  public delete(id)
  {
    return this.http.delete(this.accessPointUrl + "/" + id, {headers: this.headers});
  }
}
