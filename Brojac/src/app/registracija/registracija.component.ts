import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { __values } from 'tslib';
import { of, throwError } from 'rxjs';
import { RouterLink, Router } from '@angular/router';

import { Korisnik } from '../model/korisnik';
import { KorisnikServis } from '../services/korisnik.servis';
import { HttpErrorResponse } from '@angular/common/http';
import { PomocneFunkcije } from '../services/pomocne.funkcije';
import { DanServis } from '../services/dan.servis';

@Component({
  selector: 'registracija',
  templateUrl: './registracija.html',
  styleUrls: ['./registracija.css']
})


export class RegistracijaComponent implements OnInit {
  title = 'Brojac';

  ngOnInit() {
    this.funkcije.disableDugme('submit');
  }

  constructor(private korisnikServis: KorisnikServis,
    public funkcije: PomocneFunkcije,
    private fb: FormBuilder, private router: Router) { }

  registracijaForm = this.fb.group({
    ime: ['', [Validators.required]],
    sifra: ['', [Validators.required, Validators.minLength(4)]],
    potvrda: ['', [Validators.required, Validators.minLength(4)]],
    godina: [0, [Validators.required]],
    mesec: [{ value: 0, disabled: true }, [Validators.required]],
    dan: [{ value: 0, disabled: true }, [Validators.required]],
    pol: [3, [Validators.required]],
    slika: ['', Validators.required]
  })


  clickNazad() {
    this.router.navigate(['./pocetna']);
  }

  poruka = '';

  proveriUnos(): boolean {
    var r = true;;
    if (!this.registracijaForm.controls.ime.valid) {
      r = false;
      this.poruka = 'Morate uneti ime!';
    }
    else if (String(this.registracijaForm.controls.sifra.value).length < 8) {
      r = false;
      this.poruka = 'Morate uneti šifru od najmanje 8 karaktera.';
    }
    else if (!this.registracijaForm.controls.potvrda.valid ||
      this.registracijaForm.controls.sifra.value != this.registracijaForm.controls.potvrda.value) {
      r = false;
      this.poruka = this.poruka = 'Morate potvrditi šifru!';
    }
    else if (!this.registracijaForm.controls.godina.valid || this.registracijaForm.controls.godina.value == 0) {
      r = false;
      this.poruka = 'Morate izabrati godinu rođenja.';
    }
    else if (!this.registracijaForm.controls.mesec.valid || this.registracijaForm.controls.mesec.value == 0) {
      r = false;
      this.poruka = 'Morate izabrati mesec rođenja.';
    }
    else if (!this.registracijaForm.controls.dan.valid || this.registracijaForm.controls.dan.value == 0) {
      r = false;
      this.poruka = 'Morate izabrati dan rođenja.';
    }
    else if (!this.registracijaForm.controls.pol.valid || this.registracijaForm.controls.pol.value == 3) {
      r = false;
      this.poruka = 'Morate izabrati pol.';
    }

    if (r) {
      this.funkcije.enableDugme('submit');
      this.poruka = '';
    }

    return r;
  }

  prikazi: boolean = false;
  natpis = '👀 Prikaži šifru.'

  prikaziSifru() {
    this.prikazi = !this.prikazi;

    if (this.prikazi == false)
      this.natpis = '👀 Prikaži šifru.';
    else
      this.natpis = '🙈Sakrij šifru.';
  }

  godine() {
    var g: number[] = new Array;
    for (var i = 2010; i > 1950; i--)
      g.push(i);

    return g;
  }


  dani = new Array<number>;

  brDana() {
    var mesec = Number(this.registracijaForm.controls.mesec.value);
    this.korisnikServis.ponudiBrDana(mesec).subscribe({
      next: (odg: Number) => {
        for (let i = 1; i <= odg; i++)
          this.dani.push(i);
      },
      error: (e) => this.poruka = e.error,
      complete: () => console.log('dani: ')
    });

  }



  registracija() {
    var ime = String(this.registracijaForm.controls.ime.value);
    var sifra = String(this.registracijaForm.controls.sifra.value);
    var godina = Number(this.registracijaForm.controls.godina.value);
    var mesec = Number(this.registracijaForm.controls.mesec.value);
    var dan = Number(this.registracijaForm.controls.dan.value);
    var pol = Number(this.registracijaForm.controls.pol.value);

    var slika = String(this.registracijaForm.controls.slika.value);
    if (slika == '')
      slika = '*';
    else slika = slika.slice(12, slika.length);

    this.poruka = 'Sačekaj malo. ⏳'

    this.korisnikServis.registracija(ime, sifra, godina, mesec, dan, pol, slika)
      .subscribe({
        next: async (odg: string) => {
          this.poruka = odg;
          await this.funkcije.sacekaj(1);
          this.poruka += '✓';
          await this.funkcije.sacekaj(1);
          this.poruka += '✓';
          await this.funkcije.sacekaj(1.5);
          this.router.navigate(['./prijava']);
        },
        error: (e) => this.poruka = e.error,
        complete: () => console.log('registrovan')
      });
  }


  clickGodina() {
    this.registracijaForm.controls.mesec.enable();
    this.proveriUnos();
  }

  async clickMesec() {
    this.brDana();
    await this.funkcije.sacekaj(1);
    this.registracijaForm.controls.dan.enable();
    this.proveriUnos();
  }



}
