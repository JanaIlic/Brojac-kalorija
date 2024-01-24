import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Stanje } from '../model/stanje';


@Injectable({
  providedIn: 'root'
})

export class StanjeServis {

  constructor(private http: HttpClient) { }
  url = 'https://localhost:7260/api/Stanje/';


  stanja(): Observable<Stanje[]> {
    return this.http.get<Stanje[]>(this.url + 'stanja');
  }

  ponudiBrDana(mesec: Number) {
    return this.http.get<number>(this.url + 'ponudiBrDana/' + mesec);
  }

  stanjePoDatumu(godina: Number, mesec: Number, dan: Number): Observable<Stanje> {
    return this.http.get<Stanje>(this.url + 'stanjePoDatumu/' + godina + '/' + mesec + '/' + dan);
  }

  stanjePoIDu(id: number): Observable<Stanje> {
    return this.http.get<Stanje>(this.url + 'stanjePoIDu/' + id);
  }

  prvoStanje(): Observable<Stanje> {
    return this.http.get<Stanje>(this.url + 'prvoStanje');
  }

  aktuelnoStanje(): Observable<Stanje> {
    return this.http.get<Stanje>(this.url + 'aktuelnoStanje');
  }

  prikazBmi(stanjeID: Number): Observable<String> {
    return this.http.get<String>(this.url + 'prikazBmi/' + stanjeID);
  }

  upisiStanje(visina: Number, tezina: Number, nt: Number): Observable<Stanje> {
    return this.http.post<Stanje>(this.url + 'upisiStanje/' + visina + '/' + tezina + '/' + nt, { 'Response-Type': 'application/json' });
  }

  zadajCilj(cilj: Number): Observable<string> {
    return this.http.put<string>(this.url + 'zadajCilj/' + cilj, { 'Response-Type': 'application/json' });
  }

  ponudiPeriode(): Observable<string[]> {
    return this.http.get<string[]>(this.url + 'ponudiPeriode');
  }

  zadajVreme(vreme: Number): Observable<string> {
    return this.http.put<string>(this.url + 'zadajVreme/' + vreme, { 'Response-Type': 'application/json' });
  }

  promeniVisinu(visina: Number): Observable<Stanje> {
    return this.http.put<Stanje>(this.url + 'promeniVisinu/' + visina, { 'Response-Type': 'application/json' });
  }

  promeniTezinu(tezina: Number): Observable<Stanje> {
    return this.http.put<Stanje>(this.url + 'promeniTezinu/' + tezina, { 'Response-Type': 'application/json' });
  }

  obrisiStanje(): Observable<string> {
    return this.http.delete<string>(this.url + 'obrisiStanje');
  }

  parsirajPeriod(s: string): Observable<number> {
    return this.http.get<number>(this.url + 'parsiraj/' + s)
  }

}


