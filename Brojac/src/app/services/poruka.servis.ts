import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Korisnik } from '../model/korisnik';
import { Poruka } from '../model/poruka';


@Injectable({
  providedIn: 'root'
})

export class PorukaServis {

  constructor(private http: HttpClient) { }
  url = 'https://localhost:7260/api/Poruka/';


  poslataPoruka(porukaID: Number): Observable<Poruka> {
    return this.http.get<Poruka>(this.url + 'poslataPoruka/' + porukaID);
  }

  poslatePoruke(): Observable<Poruka[]> {
    return this.http.get<Poruka[]>(this.url + 'poslatePoruke');
  }

  primljenePoruke(): Observable<Poruka[]> {
    return this.http.get<Poruka[]>(this.url + 'primljenePoruke');
  }

  razgovor(korisnikID: Number): Observable<Poruka[]> {
    return this.http.get<Poruka[]>(this.url + 'razgovor/' + korisnikID);
  }

  sagovornici(): Observable<Korisnik[]> {
    return this.http.get<Korisnik[]>(this.url + 'sagovornici');
  }

  autoriPoruka(korisnikID: Number): Observable<Boolean[]> {
    return this.http.get<Boolean[]>(this.url + 'autoriPoruka/' + korisnikID);
  }

  posaljiPoruku(primalacID: Number, tekst: string): Observable<Poruka> {
    return this.http.post<Poruka>(this.url + 'posaljiPoruku/' + primalacID + '/' + tekst, { 'Response-Type': 'application/json' });
  }

  prepraviPoruku(porukaID: Number, tekst: string): Observable<Poruka> {
    return this.http.put<Poruka>(this.url + 'prepraviPoruku/' + porukaID + '/' + tekst, { 'Response-Type': 'application/json' });
  }

  obrisiPoruku(porukaID: Number): Observable<string> {
    return this.http.delete<string>(this.url + 'obrisiPoruku/' + porukaID);
  }

  obrisiRazgovor(korisnikID: Number): Observable<string> {
    return this.http.delete<string>(this.url + 'obrisiRazgovor/' + korisnikID);
  }

  obrisiRazgovore(): Observable<string> {
    return this.http.delete<string>(this.url + 'obrisiRazgovore');
  }

  obrisiPoslatePoruke(): Observable<string> {
    return this.http.delete<string>(this.url + 'obrisiPoslatePoruke');
  }

}


