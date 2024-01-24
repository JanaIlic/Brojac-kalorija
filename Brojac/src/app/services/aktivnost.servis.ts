import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Aktivnost } from '../model/aktivnost';


@Injectable({
  providedIn: 'root'
})

export class AktivnostServis {

  constructor(private http: HttpClient) { }
  url = 'https://localhost:7260/api/Aktivnost/';


  public aktivnosti(): Observable<Aktivnost[]> {
    return this.http.get<Aktivnost[]>(this.url + 'aktivnosti');
  }

  public aktivnostPoIDu(id: Number): Observable<Aktivnost> {
    return this.http.get<Aktivnost>(this.url + 'PoIDu/' + id);
  }

  public aktivnostiPoNazivu(naziv: string): Observable<Aktivnost[]> {
    return this.http.get<Aktivnost[]>(this.url + 'PoNazivu/' + naziv);
  }

  public potrosnja(id: Number, sati: Number): Observable<string> {
    return this.http.get<string>(this.url + 'potrosnja/' + id + '/' + sati);
  }

  public dodaj(naziv: string, nt: Number): Observable<Aktivnost> {
    return this.http.post<Aktivnost>(this.url + 'dodaj/' + naziv + '/' + nt, { 'Response-Type': 'application/json' });
  }

  public promeniNaziv(id: Number, naziv: string): Observable<Aktivnost> {
    return this.http.put<Aktivnost>(this.url + 'promeniNaziv/' + id + '/' + naziv, { 'Response-Type': 'application/json' });
  }

  public promeniNivoTezine(id: Number, nt: Number): Observable<Aktivnost> {
    return this.http.put<Aktivnost>(this.url + 'promeniNT/' + id + '/' + nt, { 'Response-Type': 'application/json' });
  }

  public obrisi(id: Number): Observable<string> {
    return this.http.delete<string>(this.url + 'obrisi/' + id);
  }



}





