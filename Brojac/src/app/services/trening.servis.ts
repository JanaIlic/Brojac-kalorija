import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Aktivnost } from '../model/aktivnost';
import { Objava } from '../model/objava';
import { Trening } from '../model/trening';


@Injectable({
  providedIn: 'root'
})

export class TreningServis {

  constructor(private http: HttpClient) { }
  url = 'https://localhost:7260/api/Trening/';


  treninzi(): Observable<Trening[]> {
    return this.http.get<Trening[]>(this.url + 'treninzi');
  }

  treningPoIDu(treningID: Number): Observable<Trening> {
    return this.http.get<Trening>(this.url + 'treningPoIDu/' + treningID);
  }

  treningPoNazivu(naziv: string): Observable<Trening> {
    return this.http.get<Trening>(this.url + 'treningPoNazivu/' + naziv);
  }

  treninziPoNazivu(naziv: string): Observable<Trening[]> {
    return this.http.get<Trening[]>(this.url + 'treninziPoNazivu/' + naziv);
  }

  opisiTrening(treningID: Number): Observable<string> {
    return this.http.get<string>(this.url + 'opisiTrening/' + treningID);
  }

  vremeAktivnosti(treningID: Number, aktivnostID: Number): Observable<Number> {
    return this.http.get<Number>(this.url + 'vremeAktivnosti/' + treningID + '/' + aktivnostID);
  }

  vremenaAktivnosti(treningID: Number): Observable<Number[]> {
    return this.http.get<Number[]>(this.url + 'vremenaAktivnosti/' + treningID);
  }

  potrosnjePriAktivnostima(treningID: Number): Observable<Number[]> {
    return this.http.get<Number[]>(this.url + 'potrosnjePriAktivnostima/' + treningID);
  }

  aktivnostiTreninga(treningID: Number): Observable<Aktivnost[]> {
    return this.http.get<Aktivnost[]>(this.url + 'aktivnostiTreninga/' + treningID);
  }

  treninziDana(danID: Number): Observable<Trening[]> {
    return this.http.get<Trening[]>(this.url + 'treninziDana/' + danID);
  }

  danasnjiTreninzi(): Observable<Trening[]> {
    return this.http.get<Trening[]>(this.url + 'danasnjiTreninzi');
  }

  dodajTrening(naziv: string): Observable<Trening> {
    return this.http.post<Trening>(this.url + 'dodajTrening/' + naziv, { 'Response-Type': 'application/json' });
  }

  dodajAktivnostTreningu(treningID: Number, aktivnostID: Number, vreme: Number): Observable<Trening> {
    return this.http.put<Trening>(this.url + 'dodajAktivnostTreningu/' + treningID + '/' + aktivnostID + '/' + vreme, { 'Response-Type': 'application/json' });
  }

  objaviTrening(treningID: Number): Observable<Objava> {
    return this.http.post<Objava>(this.url + 'objaviTrening/' + treningID, { 'Response-Type': 'application/json' });
  }

  promeniVremeAktivnosti(treningID: Number, aktivnostID: Number, vreme: Number): Observable<Trening> {
    return this.http.put<Trening>(this.url + 'promeniVremeAktivnosti/' + treningID + '/' + aktivnostID + '/' + vreme, { 'Response-Type': 'application/json' });
  }

  dodajTreningDanas(treningID: Number): Observable<Trening> {
    return this.http.put<Trening>(this.url + 'dodajDnevniTrening/' + treningID, { 'Response-Type': 'application/json' });
  }

  promeniNaziv(treningID: Number, naziv: string): Observable<Trening> {
    return this.http.put<Trening>(this.url + 'promeniNaziv/' + treningID + '/' + naziv, { 'Response-Type': 'application/json' });
  }

  obrisiAktivnostIzTreninga(treningID: Number, aktivnostID: Number): Observable<Trening> {
    return this.http.put<Trening>(this.url + 'obrisiAktivnostIzTreninga/' + treningID + '/' + aktivnostID, { 'Response-Type': 'application/json' });
  }

  obrisiTrening(treningID: Number): Observable<string> {
    return this.http.delete<string>(this.url + 'obrisiTrening/' + treningID);
  }

  obrisiDanasnjiTrening(treningID: Number): Observable<string> {
    return this.http.delete<string>(this.url + 'obrisiDanasnjiTrening/' + treningID);
  }


}


