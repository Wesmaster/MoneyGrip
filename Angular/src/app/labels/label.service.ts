import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Label } from './label/label';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class LabelService
{
  private headers: HttpHeaders;
  private accessPointUrl: string = environment.api_url + 'label';
  private data: Label[] = [];
  private dataStore: {[key: number]: string} = {};
  private dataStoreByName: {[key: string]: number} = {};
  private labelNames: string[] = [];
  
  constructor(private http: HttpClient)
  {
    this.headers = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
  }

  public async add(item)
  {
    return await this.http.post(this.accessPointUrl, item, {headers: this.headers}).toPromise();
  }

  public getAll(): Observable<Label[]>
  {
    return this.http.get<Label[]>(this.accessPointUrl, {headers: this.headers});
  }

  public get(id): Observable<Label>
  {
    return this.http.get<Label>(this.accessPointUrl + "/" + id, {headers: this.headers});
  }

  public async update(item)
  {
    return await this.http.put<Label>(this.accessPointUrl + "/" + item.id, item, {headers: this.headers}).toPromise();
  }

  public delete(id)
  {
    return this.http.delete(this.accessPointUrl + "/" + id, {headers: this.headers});
  }

  public loadAll()
  {
    this.getAll().subscribe(items => {
        items.forEach(item => {
            
           //this.mappedLabels[item.naam] = item.id;
            this.dataStore[item.id] = item.naam;
            this.dataStoreByName[item.naam] = item.id;
            this.labelNames.push(item.naam);
        })
    });
  }

  public grapLabelName(id: number): string
  {
    return this.dataStore[id];
  }

  public grapLabelNames(): string[]
  {
    return this.labelNames;
  }

  public grapLabelId(name: string): number
  {
    return this.dataStoreByName[name];
  }
}
