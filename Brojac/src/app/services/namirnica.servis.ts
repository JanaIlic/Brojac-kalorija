import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Namirnica } from '../model/namirnica';



@Injectable({
  providedIn: 'root'
})

export class NamirnicaServis {

  constructor(private http: HttpClient) { }
  url = 'https://localhost:7260/api/Namirnica/';


  namirnice(): Observable<Namirnica[]> {
    return this.http.get<Namirnica[]>(this.url + 'namirnice');
  }

  filter(vrsta: Number, tip: Number, dm: Number, db: Number): Observable<Namirnica[]> {
    return this.http.get<Namirnica[]>(this.url + 'filter/' + vrsta + '/' + tip + '/' + dm + '/' + db);
  }

  nadjiPoNazivu(naziv: string): Observable<Namirnica[]> {
    return this.http.get<Namirnica[]>(this.url + 'nadjiPoNazivu/' + naziv);
  }

  nadji(id: Number): Observable<Namirnica> {
    return this.http.get<Namirnica>(this.url + 'nadjiPoIDu/' + id);
  }

  skaliraj(n: Namirnica, m: Number): Observable<Namirnica> {
    return this.http.get<Namirnica>(this.url + 'skalirajNamirnicu/' + n.id + '/' + m);
  }

  dodaj(naziv: string, vrsta: Number, tip: Number, brasno: Number, dm: Number,
    ev: Number, p: Number, uh: Number, m: Number, pm: Number, opis: string): Observable<Namirnica> {
    return this.http.post<Namirnica>(this.url + 'dodajNamirnicu/' + naziv + '/' + vrsta + '/' + tip + '/' + brasno + '/'
      + dm + '/' + ev + '/' + p + '/' + uh + '/' + m + '/' + pm + '/' + opis, { 'Response-Type': 'application/json' });
  }

  promeniNaziv(id: Number, naziv: string): Observable<Namirnica> {
    return this.http.put<Namirnica>(this.url + 'promeniNaziv/' + id + '/' + naziv, { 'Response-Type': 'application/json' });
  }

  promeniVrstu(id: Number, vrsta: Number): Observable<Namirnica> {
    return this.http.put<Namirnica>(this.url + 'promeniVrstu/' + id + '/' + vrsta, { 'Response-Type': 'application/json' });
  }

  promeniTipObrade(id: Number, tip: Number): Observable<Namirnica> {
    return this.http.put<Namirnica>(this.url + 'promeniTipObrade/' + id + '/' + tip, { 'Response-Type': 'application/json' });
  }

  promeniBrasno(id: Number, brasno: Number): Observable<Namirnica> {
    return this.http.put<Namirnica>(this.url + 'promeniBrasno/' + id + '/' + brasno, { 'Response-Type': 'application/json' });
  }

  promeniDM(id: Number, mast: Number): Observable<Namirnica> {
    return this.http.put<Namirnica>(this.url + 'promeniKolicnuDodateMasti/' + id + '/' + mast, { 'Response-Type': 'application/json' });
  }

  promeniEV(id: Number, ev: Number): Observable<Namirnica> {
    return this.http.put<Namirnica>(this.url + 'promeniEnergetskuVrednost/' + id + '/' + ev, { 'Response-Type': 'application/json' });
  }

  promeniProtein(id: Number, protein: Number): Observable<Namirnica> {
    return this.http.put<Namirnica>(this.url + 'promeniProtein/' + id + '/' + protein, { 'Response-Type': 'application/json' });
  }

  promeniUH(id: Number, uh: Number): Observable<Namirnica> {
    return this.http.put<Namirnica>(this.url + 'promeniUH/' + id + '/' + uh, { 'Response-Type': 'application/json' });
  }

  promeniMast(id: Number, mast: Number): Observable<Namirnica> {
    return this.http.put<Namirnica>(this.url + 'promeniMast/' + id + '/' + mast, { 'Response-Type': 'application/json' });
  }

  promeniKoeficijent(id: Number, promena: Number): Observable<Namirnica> {
    return this.http.put<Namirnica>(this.url + 'promeniKoeficijent/' + id + '/' + promena, { 'Response-Type': 'application/json' });
  }

  promeniOpis(id: Number, promena: string): Observable<Namirnica> {
    return this.http.put<Namirnica>(this.url + 'promeniOpis/' + id + '/' + promena, { 'Response-Type': 'application/json' });
  }

  obrisi(id: Number): Observable<string> {
    return this.http.delete<string>(this.url + 'obrisi/' + id);
  }


  vrstaNamirnice(n: Namirnica): string {
    var ret = '';
    if (n.vrsta == 0)
      ret = 'voće';

    else if (n.vrsta == 1)
      ret = 'povrće';

    else if (n.vrsta == 2)
      ret = 'meso';

    else if (n.vrsta == 3)
      ret = 'mlečni proizvod';

    else if (n.vrsta == 4)
      ret = 'žitarica';

    else if (n.vrsta == 5)
      ret = 'testo';

    else if (n.vrsta == 6)
      ret = 'slano mešano jelo';

    else if (n.vrsta == 7)
      ret = 'poslastica';

    return ret;
  }


  pripremaNamirnice(n: Namirnica): string {
    var ret = '';

    if (n.tip == 0)
      ret = 'sveža';

    else if (n.tip == 1)
      ret = 'kuvana';

    else if (n.tip == 2)
      ret = 'dinstana';

    else if (n.tip == 3)
      ret = 'pržena';

    else if (n.tip == 4)
      ret = 'pečena';


    return '・ ' + ret;
  }


  dodatoBrasno(n: Namirnica): string {
    var ret = '';

    if (n.tip == 0)
      return ret;

    if (n.dodatoBrasno == 0)
      ret = 'bez brašna';

    else if (n.dodatoBrasno == 1)
      ret = 'uvaljana u brašno';

    else if (n.dodatoBrasno == 2)
      ret = 'pohovana';

    return '・ ' + ret;
  }


  dodataMast(n: Namirnica): string {
    var ret = '';

    if (n.tip == 0)
      return ret;

    if (n.dodataMast == 0)
      ret = 'bez ulja/masti';

    else if (n.dodataMast == 1)
      ret = 'u plitkom ulju/masti';

    else if (n.dodataMast == 2)
      ret = 'u dubokom ulju/masti';

    return '・ ' + ret;
  }



}

