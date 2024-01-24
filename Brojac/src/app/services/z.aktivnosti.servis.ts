import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { RezultatZahteva } from '../model/rezultat.zahteva';
import { ZahtevAktivnosti } from '../model/zahtev.aktivnosti';


@Injectable({
  providedIn: 'root'
})

export class ZahtevAktivnostiServis {

  constructor(private http: HttpClient) { }
  url = 'https://localhost:7260/api/ZahtevAktivnosti/';



  poslatiZahtevi(): Observable<ZahtevAktivnosti[]> {
    return this.http.get<ZahtevAktivnosti[]>(this.url + 'poslatiZahtevi');
  }

  poslatZahtev(id: Number): Observable<ZahtevAktivnosti> {
    return this.http.get<ZahtevAktivnosti>(this.url + 'nadjiPoslatZahtev/' + id);
  }

  pretraziPoslateZahteve(naziv: string): Observable<ZahtevAktivnosti[]> {
    return this.http.get<ZahtevAktivnosti[]>(this.url + 'nadjiPoslateZahteve/' + naziv);
  }

  primljeniZahtevi(): Observable<ZahtevAktivnosti[]> {
    return this.http.get<ZahtevAktivnosti[]>(this.url + 'primljeniZahtevi');
  }

  noviPrimljeniZahtevi(): Observable<ZahtevAktivnosti[]> {
    return this.http.get<ZahtevAktivnosti[]>(this.url + 'noviPrimljeniZahtevi');
  }

  stariPrimljeniZahtevi(): Observable<ZahtevAktivnosti[]> {
    return this.http.get<ZahtevAktivnosti[]>(this.url + 'stariPrimljeniZahtevi');
  }

  pretraziPrimljeneZahteve(naziv: string): Observable<ZahtevAktivnosti[]> {
    return this.http.get<ZahtevAktivnosti[]>(this.url + 'nadjiPrimljeneZahteve/' + naziv);
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

  posaljiZahtev(naziv: string, prijava: Boolean, napomena: string): Observable<ZahtevAktivnosti> {
    return this.http.post<ZahtevAktivnosti>(this.url + 'posaljiZahtev/' +
      naziv + '/' + prijava + '/' + napomena, { 'Response-Type': 'application/json' })
  }

  prihvatiZahtev(zahtevID: Number): Observable<ZahtevAktivnosti> {
    return this.http.put<ZahtevAktivnosti>(this.url + 'prihvatiZahtev/' + zahtevID, { 'Response-Type': 'application/json' });
  }

  ispuniZahtev(zahtevID: Number, naziv: string): Observable<ZahtevAktivnosti> {
    return this.http.put<ZahtevAktivnosti>(this.url + 'ispuniZahtev/' + zahtevID + '/' + naziv, { 'Response-Type': 'application/json' });
  }

  odbijZahtev(zahtevID: Number): Observable<ZahtevAktivnosti> {
    return this.http.put<ZahtevAktivnosti>(this.url + 'odbijZahtev/' + zahtevID, { 'Response-Type': 'application/json' });
  }

  povuciZahtev(zahtevID: Number): Observable<string> {
    return this.http.delete<string>(this.url + 'povuciZahtev/' + zahtevID);
  }


}


