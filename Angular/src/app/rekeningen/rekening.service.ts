import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Rekening } from './rekening/rekening';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class RekeningService
{
  private headers: HttpHeaders;
  private accessPointUrl: string = environment.api_url + 'rekening';
  private data: Rekening[] = [];
  
  constructor(private http: HttpClient)
  {
    this.headers = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
  }

  public getAll(): Observable<Rekening[]>
  {
    return this.http.get<Rekening[]>(this.accessPointUrl, {headers: this.headers});
  }

  public loadAll()
  {
    this.getAll().subscribe(items => {
        this.data = items;
    });
  }

  public getData(): Rekening[]
  {
    return this.data;
  }

  public getHoofdrekening(): Rekening
  {
      var rekening: Rekening;
      this.data.forEach(item => {
          if(item.hoofdrekening)
          {
              rekening = item;
          }
      });

      return rekening;
  }
}
