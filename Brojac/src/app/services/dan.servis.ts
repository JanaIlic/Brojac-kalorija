import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Dan } from '../model/dan';
import { Izvestaj } from '../model/izvestaj';


@Injectable({
  providedIn: 'root'
})

export class DanServis {

  constructor(private http: HttpClient) { }
  url = 'https://localhost:7260/api/Dan/';



  dani(): Observable<Dan[]> {
    return this.http.get<Dan[]>(this.url + 'dani');
  }

  danas(): Observable<Dan> {
    return this.http.get<Dan>(this.url + 'danas');
  }

  jeLiDanas(dID: Number): Observable<Boolean> {
    return this.http.get<Boolean>(this.url + 'jeLiDanas/' + dID);
  }

  danPoIDu(id: Number): Observable<Dan> {
    return this.http.get<Dan>(this.url + 'danPoIDu/' + id);
  }

  danPoDatumu(godina: Number, mesec: Number, dan: Number): Observable<Dan> {
    return this.http.get<Dan>(this.url + 'danPoDatumu/' + godina + '/' + mesec + '/' + dan);
  }

  izvestaji(): Observable<Izvestaj[]> {
    return this.http.get<Izvestaj[]>(this.url + 'izvestaji');
  }

  prikazIzvestaja(): Observable<String[]> {
    return this.http.get<String[]>(this.url + 'prikazIzvestaja');
  }

  izvestaj(danID: Number): Observable<Izvestaj> {
    return this.http.get<Izvestaj>(this.url + 'nadjiIzvestaj/' + danID);
  }


  danasnjiIzvestaj(): Observable<Izvestaj> {
    return this.http.get<Izvestaj>(this.url + 'danasnjiIzvestaj');
  }

  dodajDan(): Observable<string> {
    return this.http.post<string>(this.url + 'dodajDan', { 'Response-Type': 'application/json' });
  }


  upisiRezultat(): Observable<Dan> {
    return this.http.put<Dan>(this.url + 'rezultat', { 'Response-Type': 'application/json' });
  }

  iskljuciIzvestaje(): Observable<Dan> {
    return this.http.put<Dan>(this.url + 'iskljuciIzvestaje', { 'Response-Type': 'application/json' });
  }

  ukljuciIzvestaje(): Observable<Dan> {
    return this.http.put<Dan>(this.url + 'ukljuciIzvestaje', { 'Response-Type': 'application/json' });
  }

  obrisiDan(id: Number): Observable<string> {
    return this.http.delete<string>(this.url + 'obrisiDan/' + id);
  }






}


