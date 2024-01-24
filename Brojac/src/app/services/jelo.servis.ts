import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';
import { Jelo } from '../model/jelo';
import { Namirnica } from '../model/namirnica';
import { Objava } from '../model/objava';


@Injectable({
  providedIn: 'root'
})

export class JeloServis {

  constructor(private http: HttpClient) { }
  url = 'https://localhost:7260/api/Jelo/';


  jela(): Observable<Jelo[]> {
    return this.http.get<Jelo[]>(this.url + 'jela');
  }

  jeloPoIDu(id: Number): Observable<Jelo> {
    return this.http.get<Jelo>(this.url + 'jeloPoIDu/' + id);
  }

  jeloPoNazivu(naziv: string): Observable<Jelo> {
    return this.http.get<Jelo>(this.url + 'jeloPoNazivu/' + naziv);
  }

  jelaPoNazivu(naziv: string): Observable<Jelo[]> {
    return this.http.get<Jelo[]>(this.url + 'jelaPoNazivu/' + naziv);
  }

  namirniceJela(jeloID: Number): Observable<Namirnica[]> {
    return this.http.get<Namirnica[]>(this.url + 'namirniceJela/' + jeloID);
  }

  skalirajJelo(jeloID: Number, masa: Number): Observable<Jelo> {
    return this.http.get<Jelo>(this.url + 'skalirajJelo/' + jeloID + '/' + masa)
  }

  masaNamirnice(jeloID: Number, namirnicaID: Number): Observable<number> {
    return this.http.get<number>(this.url + 'masaNamirnice/' + jeloID + '/' + namirnicaID);
  }

  maseNamirnica(jeloID: Number): Observable<number[]> {
    return this.http.get<number[]>(this.url + 'maseNamirnica/' + jeloID);
  }


  dodajNovoJelo(naziv: string): Observable<Jelo> {
    return this.http.post<Jelo>(this.url + 'dodajNovoJelo/' + naziv, { 'Response-Type': 'application/json' });
  }

  objaviJelo(jeloID: Number): Observable<Objava> {
    return this.http.post<Objava>(this.url + 'objaviJelo/' + jeloID, { 'Response-Type': 'application/json' });
  }

  promeniNaziv(id: Number, naziv: string): Observable<Jelo> {
    return this.http.put<Jelo>(this.url + 'promeniNazivJela/' + id + '/' + naziv, { 'Response-Type': 'application/json' });
  }

  dodajNamirnicuJelu(jeloID: Number, namirnicaID: Number, masa: Number, pre: Boolean): Observable<Jelo> {
    return this.http.put<Jelo>(this.url + 'dodajNamirnicuJelu/' + jeloID + '/' + namirnicaID + '/' + masa + '/' + pre, { 'Response-Type': 'application/json' });
  }

  promeniMasuNamirnice(jeloID: Number, namirnicaID: Number, masa: Number): Observable<Jelo> {
    return this.http.put<Jelo>(this.url + 'promeniMasuNamirnice/' + jeloID + '/' + namirnicaID + '/' + masa, { 'Response-Type': 'application/json' });
  }

  ispisiRecept(jeloID: Number): Observable<string> {
    return this.http.put<string>(this.url + 'ispisiRecept/' + jeloID, { 'Response-Type': 'application/json' });
  }

  obrisiNamirnicuIzJela(jeloID: Number, namirnicaID: Number): Observable<Jelo> {
    return this.http.delete<Jelo>(this.url + 'obrisiNamirnicuIzJela/' + jeloID + '/' + namirnicaID);
  }

  obrisiJelo(jeloID: Number): Observable<string> {
    return this.http.delete<string>(this.url + 'obrisiJelo/' + jeloID);
  }


}



