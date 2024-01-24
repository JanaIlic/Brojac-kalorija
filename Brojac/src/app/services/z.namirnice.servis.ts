import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ZahtevNamirnice } from '../model/zahtev.namirnice';
import { RezultatZahteva } from '../model/rezultat.zahteva';

@Injectable({
  providedIn: 'root'
})

export class ZahtevNamirniceServis {

  constructor(private http: HttpClient) { }
  url = 'https://localhost:7260/api/ZahtevNamirnice/';


  poslatiZahtevi(): Observable<ZahtevNamirnice[]> {
    return this.http.get<ZahtevNamirnice[]>(this.url + 'poslatiZahtevi');
  }

  pretraziPoslateZahteve(naziv: string): Observable<ZahtevNamirnice[]> {
    return this.http.get<ZahtevNamirnice[]>(this.url + 'nadjiPoslateZahteve/' + naziv);
  }

  poslatZahtev(id: Number): Observable<ZahtevNamirnice> {
    return this.http.get<ZahtevNamirnice>(this.url + 'nadjiPoslatZahtev/' + id);
  }

  primljeniZahtevi(): Observable<ZahtevNamirnice[]> {
    return this.http.get<ZahtevNamirnice[]>(this.url + 'primljeniZahtevi');
  }

  noviPrimljeniZahtevi(): Observable<ZahtevNamirnice[]> {
    return this.http.get<ZahtevNamirnice[]>(this.url + 'noviPrimljeniZahtevi');
  }

  stariPrimljeniZahtevi(): Observable<ZahtevNamirnice[]> {
    return this.http.get<ZahtevNamirnice[]>(this.url + 'stariPrimljeniZahtevi');
  }

  pretraziPrimljeneZahteve(naziv: string): Observable<ZahtevNamirnice[]> {
    return this.http.get<ZahtevNamirnice[]>(this.url + 'nadjiPrimljeneZahteve/' + naziv);
  }

  rezultatPrimljenogZahteva(zahtevID: Number): Observable<RezultatZahteva> {
    return this.http.get<RezultatZahteva>(this.url + 'rezultatPrimljenogZahteva/' + zahtevID);
  }

  rezultatPoslatogZahteva(zahtevID: Number): Observable<RezultatZahteva> {
    return this.http.get<RezultatZahteva>(this.url + 'rezultatPoslatogZahteva/' + zahtevID);
  }

  rezultatiZahteva(): Observable<RezultatZahteva[]> {
    return this.http.get<RezultatZahteva[]>(this.url + 'rezultatiZahteva');
  }

  prijavaPrethodnog(): Observable<Boolean> {
    return this.http.get<Boolean>(this.url + 'prijavaPoslednjeg');
  }

  posaljiZahtev(naziv: string, prijava: Boolean, napomena: string): Observable<ZahtevNamirnice> {
    return this.http.post<ZahtevNamirnice>(this.url + 'posaljiZahtev/'
      + naziv + '/' + prijava + '/' + napomena, { 'Response-Type': 'application/json' })
  }


  prihvatiZahtev(zahtevID: Number): Observable<ZahtevNamirnice> {
    return this.http.put<ZahtevNamirnice>(this.url + 'prihvatiZahtev/' + zahtevID, { 'Response-Type': 'application/json' });
  }

  ispuniZahtev(zahtevID: Number, naziv: string): Observable<ZahtevNamirnice> {
    return this.http.put<ZahtevNamirnice>(this.url + 'ispuniZahtev/' + zahtevID + '/' + naziv, { 'Response-Type': 'application/json' });
  }

  odbijZahtev(zahtevID: Number): Observable<ZahtevNamirnice> {
    return this.http.put<ZahtevNamirnice>(this.url + 'odbijZahtev/' + zahtevID, { 'Response-Type': 'application/json' });
  }


  povuciZahtev(zahtevID: Number): Observable<string> {
    return this.http.delete<string>(this.url + 'povuciZahtev/' + zahtevID);
  }




}


