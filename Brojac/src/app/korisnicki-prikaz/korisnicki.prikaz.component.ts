import { Component, OnInit, ViewChild } from '@angular/core';
import { __values } from 'tslib';
import { FormBuilder, Validators } from '@angular/forms';
import { RouterModule, Routes, Route, Router } from '@angular/router';
import { PomocneFunkcije } from '../services/pomocne.funkcije';
import { ZahtevNamirniceServis } from '../services/z.namirnice.servis';
import { ZahtevNamirnice } from '../model/zahtev.namirnice';
import { ZahtevAktivnostiServis } from '../services/z.aktivnosti.servis';
import { ZahtevAktivnosti } from '../model/zahtev.aktivnosti';
import { ZahtevZaPracenjeServis } from '../services/z.pracenje.servis';
import { ZahtevZaPracenje } from '../model/zahtev.za.pracenje';
import { RezultatZahteva } from '../model/rezultat.zahteva';
import { DanComponent } from '../dan/dan.component';

@Component({
  selector: 'korisnicki-prikaz',
  templateUrl: './korisnicki.prikaz.html',
  styleUrls: ['./korisnicki.prikaz.css']
})

export class KorisnickiPrikazComponent {

  constructor(private fb: FormBuilder, private router: Router,
              private funkcije: PomocneFunkcije) { }

  @ViewChild(DanComponent) dan !: DanComponent;


  clickNazad() {
    this.router.navigate(['./pocetna']);
    localStorage.removeItem('authToken');
  }


  clickJelo() {
    this.router.navigate(['./jelo']);
  }

  clickObrok() {
    this.router.navigate(['./obrok']);
  }

  clickTrening() {
    this.router.navigate(['./trening']);
  }

  clickDrustvo() {
    this.router.navigate(['./drustvo']);
  }



  async ucitajDanas() {
   this.dan.ucitajDanas();
  //  this.dan.prikazRezultata();
    this.dan.danasnjiIzvestaj();
  }




}