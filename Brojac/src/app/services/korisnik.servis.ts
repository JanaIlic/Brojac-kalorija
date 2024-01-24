import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Korisnik } from '../model/korisnik';


@Injectable({
  providedIn: 'root'
})

export class KorisnikServis {

  constructor(private http: HttpClient) { }
  url = 'https://localhost:7260/api/Korisnik/';


  korisnici(): Observable<Korisnik[]> {
    return this.http.get<Korisnik[]>(this.url + 'korisnici');
  }

  korisnikPoIDu(id: Number): Observable<Korisnik> {
    return this.http.get<Korisnik>(this.url + 'korisnikPoIDu/' + id);
  }

  prijavljen(): Observable<Korisnik> {
    return this.http.get<Korisnik>(this.url + 'prijavljen');
  }

  korisnikPoImenu(ime: string): Observable<Korisnik> {
    return this.http.get<Korisnik>(this.url + 'korisnikPoImenu/' + ime);
  }

  korisniciPoImenu(ime: string): Observable<Korisnik[]> {
    return this.http.get<Korisnik[]>(this.url + 'korisniciPoImenu/' + ime);
  }

  pratioci(): Observable<Korisnik[]> {
    return this.http.get<Korisnik[]>(this.url + 'pratioci');
  }

  pratilac(korisnikID: Number): Observable<Boolean> {
    return this.http.get<Boolean>(this.url + 'pratilac/' + korisnikID);
  }

  praceni(): Observable<Korisnik[]> {
    return this.http.get<Korisnik[]>(this.url + 'praceni');
  }

  pracen(korisnikID: Number): Observable<Boolean> {
    return this.http.get<Boolean>(this.url + 'pracen/' + korisnikID);
  }

  prijava(ime: string, sifra: string): Observable<string> {
    return this.http.post<string>(this.url + 'prijava/' + ime + '/' + sifra, { 'Response-Type': 'application/json' });
  }

  ponudiBrDana(mesec: Number) {
    return this.http.get<Number>(this.url + 'ponudiBrDana/' + mesec);
  }

  registracija(ime: string, sifra: string, godina: Number, mesec: Number, dan: Number, pol: Number, slika: string): Observable<string> {
    return this.http.post<string>(this.url + 'registracija/' + ime + '/' + sifra + '/' + godina + '/' + mesec + '/' + dan + '/' + pol + '/' + slika,
      { 'Response-Type': 'application/json' });
  }

  promeniIme(novoIme: string): Observable<Korisnik> {
    return this.http.put<Korisnik>(this.url + 'promeniIme/' + novoIme, { 'Response-Type': 'application/json' });
  }

  promeniSifru(novaSifra: string): Observable<Korisnik> {
    return this.http.put<Korisnik>(this.url + 'promeniSifru/' + novaSifra, { 'Response-Type': 'application/json' });
  }

  promeniSliku(novaSlika: string): Observable<Korisnik> {
    return this.http.put<Korisnik>(this.url + 'promeniSliku/' + novaSlika, { 'Response-Type': 'application/json' });
  }

  nadjiSliku(): Observable<string> {
    return this.http.get<string>(this.url + 'nadjiSliku');
  }

  promeniDatumRodjenja(godina: Number, mesec: Number, dan: Number): Observable<string> {
    return this.http.put<string>(this.url + 'promeniDatumRodjenja/' + godina + '/' + mesec + '/' + dan, { 'Response-Type': 'application/json' });
  }

  obrisiNalog(): Observable<string> {
    return this.http.delete<string>(this.url + 'obrisiSvojNalog');
  }





}



