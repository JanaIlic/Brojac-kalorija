import { Component, OnInit } from '@angular/core';
import { __values } from 'tslib';
import { FormBuilder, Validators } from '@angular/forms';
import { PomocneFunkcije } from '../services/pomocne.funkcije';
import { ZahtevNamirniceServis } from '../services/z.namirnice.servis';
import { ZahtevNamirnice } from '../model/zahtev.namirnice';
import { ZahtevAktivnostiServis } from '../services/z.aktivnosti.servis';
import { ZahtevAktivnosti } from '../model/zahtev.aktivnosti';
import { RezultatZahteva } from '../model/rezultat.zahteva';


@Component({
  selector: 'zahtevi',
  templateUrl: './zahtevi.html',
  styleUrls: ['./zahtevi.css']
})

export class ZahteviComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private funkcije: PomocneFunkcije,
    private znServis: ZahtevNamirniceServis,
    private zaServis: ZahtevAktivnostiServis) { }

  ngOnInit() {
    this.disableDugmad();
  }


  zahtev: any;
  zahtevi = new Array<any>();

  poslatZahtevForm = this.fb.group({
    zN: [0, Validators.required],
    zA: [0, Validators.required]
  })


  otvorizn = false;
  otvoriza = false;
  prikazidetalje = false;
  zn = false;
  za = false;
  greska = '';
  detalji = '';

  disableDugmad() {
    this.funkcije.disableDugmad(['btPovuci']);
  }

  ucitajZahteveNamirnice() {
    this.znServis.poslatiZahtevi().subscribe({
      next: (z: ZahtevNamirnice[]) => this.zahtevi = z,
      error: (e) => this.zahtevi = [],
      complete: () => console.log('ucitani poslati zahtevi namirnice')
    });
  }

  ucitajZahteveAktivnosti() {
    this.zaServis.poslatiZahtevi().subscribe({
      next: (z: ZahtevAktivnosti[]) => this.zahtevi = z,
      error: (e) => this.zahtevi = [],
      complete: () => console.log('ucitani poslati zahtevi aktivnosti')
    });
  }




  clickZN() {
    this.ucitajZahteveNamirnice();
    this.otvorizn = !this.otvorizn;
  }

  clickZA() {
    this.ucitajZahteveAktivnosti();
    this.otvoriza = !this.otvoriza;
  }



  async clickZahtevNamirnice() {
    this.nadjiZN();
    await this.funkcije.sacekaj(0.5);
    this.rezultatZN();
    this.otvorizn = false;
    this.prikazidetalje = true;
    this.poslatZahtevForm.reset();
  }

  async clickZahtevAktivnosti() {
    this.nadjiZA();
    await this.funkcije.sacekaj(0.5);
    this.rezultatZA();
    this.otvoriza = false;
    this.prikazidetalje = true;
    this.poslatZahtevForm.reset();
  }



  nadjiZN() {
    var z = Number(this.poslatZahtevForm.controls.zN.value);
    this.znServis.poslatZahtev(z).subscribe({
      next: (zn: ZahtevNamirnice) => {
        this.zahtev = zn;
        if (this.zahtev.stanje > 0)
          this.funkcije.disableDugme('btPovuci');
        else this.funkcije.enableDugme('btPovuci');
      },
      error: (e) => this.detalji = e.error,
      complete: () => console.log('pronadjen zahtev')
    });
  }

  nadjiZA() {
    var z = Number(this.poslatZahtevForm.controls.zA.value);
    this.zaServis.poslatZahtev(z).subscribe({
      next: (za: ZahtevAktivnosti) => {
        this.zahtev = za;
        if (this.zahtev.stanje > 0)
          this.funkcije.disableDugme('btPovuci');
        else this.funkcije.enableDugme('btPovuci');
      },
      error: (e) => this.detalji = e.error,
      complete: () => console.log('pronadjen zahtev')
    });
  }



  rezultatZN() {
    this.znServis.rezultatPoslatogZahteva(this.zahtev.id).subscribe({
      next: (odg: RezultatZahteva) => this.detalji = odg.poruka,
      error: (e) => this.detalji = e.error,
      complete: () => console.log('Rezultat zahteva namirnice je ispisan.')
    });
  }

  rezultatZA() {
    this.zaServis.rezultatPoslatogZahteva(this.zahtev.id).subscribe({
      next: (odg: RezultatZahteva) => this.detalji = odg.poruka,
      error: (e) => this.detalji = e.error,
      complete: () => console.log('Rezultat zahteva aktivnosti je ispisan.')
    });
  }


  povuciZN() {
    this.znServis.povuciZahtev(this.zahtev.id).subscribe({
      next: (odg: string) => {
        this.detalji = odg;
        this.ucitajZahteveNamirnice();
        this.funkcije.disableDugme('btPovuci');
      },
      error: (e) => this.detalji = e.error,
      complete: () => console.log('povucen zahtev')
    });
  }

  povuciZA() {
    this.zaServis.povuciZahtev(this.zahtev.id).subscribe({
      next: (odg: string) => {
        this.detalji = odg;
        this.ucitajZahteveAktivnosti();
        this.funkcije.disableDugme('btPovuci');
      },
      error: (e) => this.detalji = e.error,
      complete: () => console.log('povucen zahtev')
    });
  }


  povuciZahtev() {
    if (this.zn && !this.za)
      this.povuciZN();
    else if (!this.zn && this.za)
      this.povuciZA();

  }

  zahtevX() {
    this.prikazidetalje = false;
    this.detalji = '';
    this.zahtev = null;
    this.poslatZahtevForm.reset();
  }

}

