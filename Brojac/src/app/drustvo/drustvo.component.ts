

import { Component, Input, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { PomocneFunkcije } from '../services/pomocne.funkcije';
import { Router } from '@angular/router';
import { KorisnikServis } from '../services/korisnik.servis';
import { Korisnik } from '../model/korisnik';
import { ObjavaComponent } from '../objava/objava.component';
import { Objava } from '../model/objava';
import { PorukaComponent } from '../poruka/poruka.component';
import { PracenjeComponent } from '../pracenje/pracenje.component';

@Component({
  selector: 'drustvo',
  templateUrl: './drustvo.html',
  styleUrls: ['./drustvo.css']
})



export class DrustvoComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private funkcije: PomocneFunkcije,
    private router: Router) { }


  @ViewChild(ObjavaComponent) objava !: ObjavaComponent;
  @ViewChild(PorukaComponent) poruka !: PorukaComponent;
  @ViewChild(PracenjeComponent) pracenje !: PracenjeComponent;

  ngOnInit() {

  }


  odjaviSe() {
    localStorage.removeItem('authToken');
    this.router.navigate(['./pocetna']);
  }

  
  autorID = new Number();



  async ucitajKorisnika() {
    this.funkcije.sacekaj(1);
    this.autorID = Number(localStorage.getItem('oznacen'));
    localStorage.removeItem('oznacen');

    await this.funkcije.sacekaj(0.5);
      this.poruka.ucitajKorisnika(this.autorID);
      this.objava.objavePracenog(this.autorID);


  }







  sveObjave() {
    this.objava.ucitajSveObjave();
    this.poruka.zatvoriKorisnika();
  }



  clickNazad() {
    this.router.navigate(['./korisnicki-prikaz']);
  }

  clickRazgovor(){
    this.funkcije.sacekaj(1);
    this.autorID = Number(localStorage.getItem('oznacen'));
    localStorage.removeItem('oznacen');
    this.pracenje.nadjiKorisnika(this.autorID);
    this.ucitajKorisnika();
  }





}

