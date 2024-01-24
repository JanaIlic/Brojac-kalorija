import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { AdminAktivnosti } from '../model/admin.aktivnosti';
import { AdminNamirnica } from '../model/admin.namirnica';
import { Aktivnost } from '../model/aktivnost';
import { Namirnica } from '../model/namirnica';
import { ZahtevAktivnosti } from '../model/zahtev.aktivnosti';
import { ZahtevNamirnice } from '../model/zahtev.namirnice';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})

export class AdminServis {

    constructor(private http: HttpClient, private router: Router) {

    }
    url = 'https://localhost:7260/api/Administrator/';


    public prijavljenAA(): Observable<AdminAktivnosti> {
        return this.http.get<AdminAktivnosti>(this.url + 'prijavljen');
    }

    public prijavljenAN(): Observable<AdminNamirnica> {
        return this.http.get<AdminNamirnica>(this.url + 'prijavljen');
    }

    /*public uloga(): Observable<string>{
        return this.http.get<string>(this.url + 'uloga');
    }*/

    public adminiNamirnica(): Observable<AdminNamirnica[]> {
        return this.http.get<AdminNamirnica[]>(this.url + 'adminiNamirnica');
    }

    public adminiAktivnosti(): Observable<AdminAktivnosti[]> {
        return this.http.get<AdminAktivnosti[]>(this.url + 'adminiAktivnosti');
    }

    public dodateNamirnice(): Observable<Namirnica[]> {
        return this.http.get<Namirnica[]>(this.url + 'dodateNamirnice');
    }

    public prijavaAA(ime: string, sifra: string): Observable<string> {
        return this.http.post<string>(this.url + 'prijavaAA/' + ime + '/' + sifra,
            { 'Response-Type': 'application/json' });
    }

    public prijavaAN(ime: string, sifra: string): Observable<string> {
        return this.http.post<string>(this.url + 'prijavaAN/' + ime + '/' + sifra,
            { 'Response-Type': 'application/json' });
    }

    public dodateAktivnosti(): Observable<Aktivnost[]> {
        return this.http.get<Aktivnost[]>(this.url + 'dodateAktivnosti');
    }

    public promeniIme(novoIme: string): Observable<any> {
        return this.http.put(this.url + 'promeniImeAdmina/' + novoIme,
            { 'Response-Type': 'application/json' });
    }

    public promeniSifru(novaSifra: string): Observable<any> {
        return this.http.put(this.url + 'promeniSifruAdmina/' + novaSifra,
            { 'Response-Type': 'application/json' });
    }



}


