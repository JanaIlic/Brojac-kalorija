import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ZahtevZaPracenje } from '../model/zahtev.za.pracenje';
import { RezultatZahteva } from '../model/rezultat.zahteva';

@Injectable({
  providedIn: 'root'
})

export class ZahtevZaPracenjeServis {

  constructor(private http: HttpClient) { }
  url = 'https://localhost:7260/api/ZahtevZaPracenje/';


  poslatiZahtevi(): Observable<ZahtevZaPracenje[]> {
    return this.http.get<ZahtevZaPracenje[]>(this.url + 'poslatiZahtevi');
  }

  pretraziPoslateZahteve(naziv: string): Observable<ZahtevZaPracenje[]> {
    return this.http.get<ZahtevZaPracenje[]>(this.url + 'nadjiPoslateZahteve/' + naziv);
  }

  nadjiPoslatZahtev(zahtevID: Number): Observable<ZahtevZaPracenje> {
    return this.http.get<ZahtevZaPracenje>(this.url + 'nadjiPoslatZahtev/' + zahtevID);
  }

  primljeniZahtevi(): Observable<ZahtevZaPracenje[]> {
    return this.http.get<ZahtevZaPracenje[]>(this.url + 'primljeniZahtevi');
  }

  pretraziPrimljeneZahteve(naziv: string): Observable<ZahtevZaPracenje[]> {
    return this.http.get<ZahtevZaPracenje[]>(this.url + 'nadjiPrimljeneZahteve/' + naziv);
  }

  nadjiPrimljenZahtev(zahtevID: Number): Observable<ZahtevZaPracenje> {
    return this.http.get<ZahtevZaPracenje>(this.url + 'nadjiPrimljenZahtev/' + zahtevID);
  }

  nadjiRezultatPoslatogZahteva(zahtevID: Number): Observable<RezultatZahteva> {
    return this.http.get<RezultatZahteva>(this.url + 'rezultatPoslatogZahteva/' + zahtevID);
  }

  nadjiRezultatPrimljenogZahteva(zahtevID: Number): Observable<RezultatZahteva> {
    return this.http.get<RezultatZahteva>(this.url + 'rezultatPrimljenogZahteva/' + zahtevID);
  }

  rezultatiZahteva(): Observable<RezultatZahteva[]> {
    return this.http.get<RezultatZahteva[]>(this.url + 'rezultatiZahteva');
  }

  podnosioci(): Observable<string[]> {
    return this.http.get<string[]>(this.url + 'podnosioci');
  }

  primaoci(): Observable<string[]> {
    return this.http.get<string[]>(this.url + 'primaoci');
  }

  prijavaPrethodnog(): Observable<Boolean> {
    return this.http.get<Boolean>(this.url + 'prijavaPoslednjeg');
  }

  zahtevPoslatKorisniku(primalacID: Number): Observable<Boolean> {
    return this.http.get<Boolean>(this.url + 'zahtevPoslatKorisniku/' + primalacID);
  }

  posaljiZahtev(korisnikID: Number, prijava: Boolean, pozdrav: String): Observable<ZahtevZaPracenje> {
    return this.http.post<ZahtevZaPracenje>(this.url + 'posaljiZahtev/' +
      korisnikID + '/' + prijava + '/' + pozdrav, { 'Response-Type': 'application/json' })
  }

  prihvatiZahtev(zahtevID: Number): Observable<ZahtevZaPracenje> {
    return this.http.put<ZahtevZaPracenje>(this.url + 'prihvatiZahtev/' + zahtevID, { 'Response-Type': 'application/json' });
  }

  odbijZahtev(zahtevID: Number): Observable<ZahtevZaPracenje> {
    return this.http.put<ZahtevZaPracenje>(this.url + 'odbijZahtev/' + zahtevID, { 'Response-Type': 'application/json' });
  }


  povuciZahtev(zahtevID: Number): Observable<string> {
    return this.http.delete<string>(this.url + 'povuciZahtev/' + zahtevID);
  }

  otprati(pracenID: Number): Observable<string> {
    return this.http.delete<string>(this.url + 'otprati/' + pracenID);
  }

  obrisiPratioca(pratilacID: Number): Observable<string> {
    return this.http.delete<string>(this.url + 'obrisiPratioca/' + pratilacID);
  }




}