import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Korisnik } from '../model/korisnik';
import { Objava } from '../model/objava';
import { Ocena } from '../model/ocena';


@Injectable({
  providedIn: 'root'
})

export class ObjavaServis {

  constructor(private http: HttpClient) { }
  url = 'https://localhost:7260/api/Objava/';


  objave(): Observable<Objava[]> {
    return this.http.get<Objava[]>(this.url + 'objave');
  }

  vidljiveObjave(): Observable<Objava[]> {
    return this.http.get<Objava[]>(this.url + 'vidljiveObjave');
  }

  autori(): Observable<Korisnik[]> {
    return this.http.get<Korisnik[]>(this.url + 'autori');
  }

  autoriKomentara(objavaID: Number): Observable<Korisnik[]> {
    return this.http.get<Korisnik[]>(this.url + 'autoriKomentara/' + objavaID);
  }

  autoriOcena(objavaID: Number): Observable<Korisnik[]> {
    return this.http.get<Korisnik[]>(this.url + 'autoriOcena/' + objavaID);
  }

  objavaPoIDu(objavaID: Number): Observable<Objava> {
    return this.http.get<Objava>(this.url + 'objavaPoIDu/' + objavaID);
  }

  objavaPracenog(objavaID: Number): Observable<Objava> {
    return this.http.get<Objava>(this.url + 'objavaPracenog/' + objavaID);
  }

  objavePoTekstu(tekst: string): Observable<Objava[]> {
    return this.http.get<Objava[]>(this.url + 'objavePoTekstu/' + tekst);
  }

  komentari(objavaID: Number): Observable<Objava[]> {
    return this.http.get<Objava[]>(this.url + 'komentari/' + objavaID);
  }

  komentarPratioca(objavaID: Number): Observable<Objava> {
    return this.http.get<Objava>(this.url + 'komentarPratioca/' + objavaID);
  }

  mojKomentar(objavaID: Number): Observable<Objava> {
    return this.http.get<Objava>(this.url + 'komentarPrijavljenog/' + objavaID);
  }


  ocenaNaObjavu(objavaID: Number): Observable<Ocena> {
    return this.http.get<Ocena>(this.url + 'ocena/' + objavaID);
  }

  ocene(objavaID: Number): Observable<Ocena[]> {
    return this.http.get<Ocena[]>(this.url + 'ocene/' + objavaID);
  }

  prosek(objavaID: Number): Observable<Number> {
    return this.http.get<Number>(this.url + 'prosek/' + objavaID);
  }

  objavePracenog(autorID: Number): Observable<Objava[]> {
    return this.http.get<Objava[]>(this.url + 'sveObjavePracenog/' + autorID);
  }

  autorPrijavljen(objavaID: Number): Observable<Boolean> {
    return this.http.get<Boolean>(this.url + 'objavaPrijavljenogKorisnika/' + objavaID);
  }

  objaviTekst(tekst: string): Observable<Objava> {
    return this.http.post<Objava>(this.url + 'objavi/' + tekst, { 'Response-Type': 'application/json' });
  }

  objaviSaSlikom(tekst: String, slika: string): Observable<Objava> {
    return this.http.post<Objava>(this.url + 'objaviSaSlikom/' + tekst + '/' + slika, { 'Response-Type': 'application/json' });
  }

  komentarisiObjavu(objavaID: Number, tekst: string): Observable<Objava> {
    return this.http.put<Objava>(this.url + 'komentarisiPracenom/' + objavaID + '/' + tekst, { 'Response-Type': 'application/json' });
  }

  komentarisiSvojuObjavu(objavaID: Number, tekst: string): Observable<Objava> {
    return this.http.put<Objava>(this.url + 'komentarisiSvojuObjavu/' + objavaID + '/' + tekst, { 'Response-Type': 'application/json' });
  }


  oceni(objavaID: Number, vrednost: Number): Observable<Objava> {
    return this.http.put<Objava>(this.url + 'oceni/' + objavaID + '/' + vrednost, { 'Response-Type': 'application/json' });
  }

  prepraviObjavu(objavaID: Number, tekst: string): Observable<Objava> {
    return this.http.put<Objava>(this.url + 'prepraviObjavu/' + objavaID + '/' + tekst, { 'Response-Type': 'application/json' })
  }

  povuciOcenu(objavaID: Number): Observable<Objava> {
    return this.http.delete<Objava>(this.url + 'povuciOcenu/' + objavaID);
  }

  obrisiObjavu(objavaID: Number): Observable<string> {
    return this.http.delete<string>(this.url + 'obrisiObjavu/' + objavaID);
  }

  obrisiKomentar(objavaID: Number): Observable<Objava[]> {
    return this.http.delete<Objava[]>(this.url + 'obrisiKomentar/' + objavaID);
  }

  obrisiObjave(): Observable<string> {
    return this.http.delete<string>(this.url + 'obrisiObjave');
  }



}


