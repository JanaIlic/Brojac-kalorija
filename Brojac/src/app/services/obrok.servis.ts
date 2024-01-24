import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Jelo } from '../model/jelo';
import { Objava } from '../model/objava';
import { Obrok } from '../model/obrok';


@Injectable({
  providedIn: 'root'
})

export class ObrokServis {

  constructor(private http: HttpClient) { }
  url = 'https://localhost:7260/api/Obrok/';

  obroci(): Observable<Obrok[]> {
    return this.http.get<Obrok[]>(this.url + 'obroci');
  }

  obrokPoIDu(obrokID: Number): Observable<Obrok> {
    return this.http.get<Obrok>(this.url + 'obrokPoIDu/' + obrokID);
  }

  obrokPoNazivu(naziv: string): Observable<Obrok> {
    return this.http.get<Obrok>(this.url + 'obrokPoNazivu/' + naziv);
  }

  obrociPoNazivu(naziv: string): Observable<Obrok[]> {
    return this.http.get<Obrok[]>(this.url + 'obrociPoNazivu/' + naziv);
  }

  obrociDana(danID: Number): Observable<Obrok[]> {
    return this.http.get<Obrok[]>(this.url + 'obrociDana/' + danID);
  }

  danasnjiObroci(): Observable<Obrok[]> {
    return this.http.get<Obrok[]>(this.url + 'danasnjiObroci');
  }

  jeloObroka(obrokID: Number, jeloID: Number): Observable<Jelo> {
    return this.http.get<Jelo>(this.url + 'jeloObroka/' + obrokID + '/' + jeloID);
  }

  jelaObroka(obrokID: Number): Observable<Jelo[]> {
    return this.http.get<Jelo[]>(this.url + 'jelaObroka/' + obrokID);
  }

  maseJela(obrokID: Number): Observable<Number[]> {
    return this.http.get<Number[]>(this.url + 'maseJela/' + obrokID);
  }

  evJela(obrokID: Number): Observable<Number[]> {
    return this.http.get<Number[]>(this.url + 'evJela/' + obrokID);
  }

  opisObroka(obrokID: Number): Observable<string> {
    return this.http.get<string>(this.url + 'opisObroka/' + obrokID);
  }

  dodajObrok(naziv: string): Observable<Obrok> {
    return this.http.post<Obrok>(this.url + 'dodajObrok/' + naziv, { 'Response-Type': 'application/json' });
  }

  dodajObrokDanas(obrokID: Number): Observable<Obrok> {
    return this.http.put<Obrok>(this.url + 'dodajObrokDanas/' + obrokID, { 'Response-Type': 'application/json' });
  }

  objaviObrok(obrokID: Number): Observable<Objava> {
    return this.http.post<Objava>(this.url + 'objaviObrok/' + obrokID, { 'Response-Type': 'application/json' });
  }

  promeniNazivObroka(obrokID: Number, naziv: string): Observable<Obrok> {
    return this.http.put<Obrok>(this.url + 'promeniNaziv/' + obrokID + '/' + naziv, { 'Response-Type': 'application/json' });
  }

  promeniMasuObroka(obrokID: Number, masa: Number): Observable<Obrok> {
    return this.http.put<Obrok>(this.url + 'promeniMasu/' + obrokID + '/' + masa, { 'Response-Type': 'application/json' });
  }

  dodajJeloObroku(obrokID: Number, jeloID: Number, masa: Number): Observable<Obrok> {
    return this.http.put<Obrok>(this.url + 'dodajJeloObroku/' + obrokID + '/' + jeloID + '/' + masa, { 'Response-Type': 'application/json' });
  }

  promeniMasuJela(obrokID: Number, jeloID: Number, masa: Number): Observable<Obrok> {
    return this.http.put<Obrok>(this.url + 'promeniMasuJela/' + obrokID + '/' + jeloID + '/' + masa, { 'Response-Type': 'application/json' });
  }

  obrisiJeloIzObroka(obrokID: Number, jeloID: Number): Observable<Obrok> {
    return this.http.delete<Obrok>(this.url + 'obrisiJeloIzObroka/' + obrokID + '/' + jeloID);
  }

  obrisiObrok(obrokID: Number): Observable<string> {
    return this.http.delete<string>(this.url + 'obrisiObrok/' + obrokID);
  }

  obrisiDanasnjiObrok(obrokID: Number): Observable<string> {
    return this.http.delete<string>(this.url + 'obrisiDanasnjiObrok/' + obrokID);
  }

}


