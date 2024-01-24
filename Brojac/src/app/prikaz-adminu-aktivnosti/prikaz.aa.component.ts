import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { __values } from 'tslib';
import { Router } from '@angular/router';

import { AdminServis } from '../services/admin.servis';
import { AktivnostServis } from '../services/aktivnost.servis';
import { Aktivnost } from '../model/aktivnost';
import { ZahtevAktivnostiServis } from '../services/z.aktivnosti.servis';
import { ZahtevAktivnosti } from '../model/zahtev.aktivnosti';
import { PomocneFunkcije } from '../services/pomocne.funkcije';
import { RezultatZahteva } from '../model/rezultat.zahteva';
import { KorisnikServis } from '../services/korisnik.servis';
import { Korisnik } from '../model/korisnik';


@Component({
  selector: 'aa-prikaz',
  templateUrl: './prikaz.aa.html',
  styleUrls: ['./prikaz.aa.css']
})

export class PrikazAaComponent implements OnInit {

  constructor(private fb: FormBuilder, private funkcije: PomocneFunkcije,
    private router: Router, private adminServis: AdminServis,
    public aServis: AktivnostServis,
    private zaServis: ZahtevAktivnostiServis,
    private kServis: KorisnikServis) { }


  ngOnInit() {
    this.sveAktivnosti();
    this.disableDugmad();
    this.aktivnost = new Aktivnost();
    this.zahtev = new ZahtevAktivnosti();
  }


  aktivnostForm = this.fb.group({
    naziv: ['', Validators.required],
    nt: [1, Validators.required]
  })

  traziAktivnostForm = this.fb.group({
    unos: ['', [Validators.required]]
  })


  natpis = 'Prikaži samo dodate.'
  sve = true;
  aktivnosti = new Array<Aktivnost>();
  aktivnost = new Aktivnost();
  zahtev = new ZahtevAktivnosti();
  zahtevi = new Array<ZahtevAktivnosti>();
  poruka = '';
  pretraga = false;
  dNatpis = '';
  dodavanje = false;
  promena = false;
  podnosilac = '';

  disableDugmad() {
    this.funkcije.disableDugmad(['btPrihvati', 'btIspuni', 'btOdbij', 'btObrisi']);
  }


  clickNazad() {
    this.router.navigate(['./pocetna']);
    localStorage.removeItem('authToken');
  }

  sveAktivnosti() {
    this.aServis.aktivnosti().subscribe({
      next: (a: Aktivnost[]) => this.aktivnosti = a,
      error: (e) => this.poruka = e.error,
      complete: () => console.log('Sve aktivnosti su učitane.')
    });
  }

  dodateAktivnosti() {
    this.adminServis.dodateAktivnosti().subscribe({
      next: (a: Aktivnost[]) => this.aktivnosti = a,
      error: (e) => {
        this.poruka = e.error;
        this.aktivnosti = [];
      },
      complete: () => console.log('Dodate aktivnosti su učitane.')
    });
  }

  pretraziAktivnosti() {
    var naziv = '';
    if (this.traziAktivnostForm.controls.unos.valid)
      naziv = String(this.traziAktivnostForm.controls.unos.value);

    this.aServis.aktivnostiPoNazivu(naziv).subscribe({
      next: (a: Aktivnost[]) => this.aktivnosti = a,
      error: (e) => this.poruka = e.error,
      complete: () => console.log('Pronađene aktivnosti su učitane.')
    });
  }



  popunjeno() {
    var unos = '';
    if (this.traziAktivnostForm.controls.unos.valid)
      unos = String(this.traziAktivnostForm.controls.unos.valid);

    if (unos == '') {
      this.pretraga = false;
      this.sveAktivnosti();
    }
    else
      this.pretraga = true;
  }



  dodajAktivnost(naziv: string, nt: Number) {
    this.aServis.dodaj(naziv, nt).subscribe({
      next: (a: Aktivnost) => {
        this.aktivnost = a;
        this.ucitajAktivnosti();
        this.traziAktivnostForm.enable();
      },
      error: (e) => this.poruka = e.error,
      complete: () => console.log('Dodata je nova aktivnost.')
    });
  }

  promeniNazivAktivnosti(naziv: string) {
    this.aServis.promeniNaziv(this.aktivnost.id, naziv).subscribe({
      next: (a: Aktivnost) => {
        this.aktivnost = a;
        this.traziAktivnostForm.enable();
      },
      error: (e) => this.poruka = e.error,
      complete: () => console.log('Promenjen je naziv aktivnosti.')
    });
  }

  promeniNt(nt: Number) {
    this.aServis.promeniNivoTezine(this.aktivnost.id, nt).subscribe({
      next: (a: Aktivnost) => {
        this.aktivnost = a;
        this.traziAktivnostForm.enable();
      },
      error: (e) => this.poruka = e.error,
      complete: () => console.log('Promenjen je nivo težine aktivnosti.')
    });
  }

  async obrisiAktivnost() {
    this.aServis.obrisi(this.aktivnost.id).subscribe({
      next: (odg: string) => this.poruka = odg,
      error: (e) => this.poruka = e.error,
      complete: () => console.log('Aktivnost je obrisana.')
    });

    await this.funkcije.sacekaj(1);
    this.sve = !this.sve;
    this.ucitajAktivnosti();
    this.disableDugmad();
  }



  nadjiPodnosioca(korisnikID: Number) {
    this.kServis.korisnikPoIDu(korisnikID).subscribe({
      next: (k: Korisnik) => this.podnosilac = k.ime
    });
  }

  noviPrimljeniZahtevi() {
    this.zaServis.noviPrimljeniZahtevi().subscribe({
      next: (odg: ZahtevAktivnosti[]) => {
        this.zahtevi = odg;
        if (odg.length < 10)
          this.brZahteva = odg.length;
        else this.brZahteva = 10;
      },
      error: (e) => { this.detalji = e.error; this.zahtevi = [] },
      complete: () => console.log('Učitani su novi zahtevi.')
    });
  }

  stariPrimljeniZahtevi() {
    this.zaServis.stariPrimljeniZahtevi().subscribe({
      next: (odg: ZahtevAktivnosti[]) => {
        this.zahtevi = odg;
        if (odg.length < 10)
          this.brZahteva = odg.length;
        else this.brZahteva = 10;
      },
      error: (e) => { this.detalji = e.error; this.zahtevi = [] },
      complete: () => console.log('Učitani su obrađeni zahtevi.')
    });
  }

  prihvatiZahtev() {
    this.zaServis.prihvatiZahtev(this.zahtev.id).subscribe({
      next: (odg: ZahtevAktivnosti) => {
        this.zahtev = odg;
        this.rezultat();
        this.funkcije.enableDugme('btOdbij');
        if (this.aktivnost.id != 0)
          this.funkcije.enableDugme('btIspuni');
      },
      error: (e) => this.detalji = e.error,
      complete: () => console.log('Zahtev je prihvaćen.')
    });
  }

  ispuniZahtev() {
    this.zaServis.ispuniZahtev(this.zahtev.id, this.aktivnost.naziv).subscribe({
      next: (odg: ZahtevAktivnosti) => {
        this.zahtev = odg;
        this.stariPrimljeniZahtevi();
        this.noviPrimljeniZahtevi();
        this.rezultat();
        //this.promena = false;
        //this.dodavanje = false;
        this.disableDugmad();
        this.aktivnost = new Aktivnost();
        this.sve = !this.sve;
        this.ucitajAktivnosti();
        this.disableDugmad();
      },
      error: (e) => this.detalji = e.error,
      complete: () => console.log('Zahtev je ispunjen.')
    });
  }

  odbijZahtev() {
    this.zaServis.odbijZahtev(this.zahtev.id).subscribe({
      next: (odg: ZahtevAktivnosti) => {
        this.zahtev = odg;
        this.rezultat();
        this.stariPrimljeniZahtevi();
        this.noviPrimljeniZahtevi();
        this.disableDugmad();

      },
      error: (e) => this.detalji = e.error,
      complete: () => console.log('Zahtev je odbijen.')
    });
  }



  detalji = '';
  rezultat() {
    this.zaServis.rezultatPrimljenogZahteva(this.zahtev.id).subscribe({
      next: (odg: RezultatZahteva) => this.detalji = odg.poruka,
      error: async (e) => {
        console.log(e.error);
        this.nadjiPodnosioca(this.zahtev.podnosilacID);
        await this.funkcije.sacekaj(0.5);
        this.detalji = 'Korisnik ' + this.podnosilac + ' je poslao zahtev za ' +
          this.zahtev.nazivAktivnosti + ', ' + this.funkcije.prikaziVremeDatum(this.zahtev.podnet) +
          ', uz napomenu: "' + this.zahtev.poruka + '", ' + this.zahtev.stanje;
      },
      complete: () => console.log('Rezultat zahteva je ispisan.')
    });
  }


  ucitajAktivnosti() {
    if (this.sve) {
      this.dodateAktivnosti();
      this.natpis = 'Prikaži sve.'
    }
    else {
      this.sveAktivnosti();
      this.natpis = 'Prikaži samo dodate.';
    }
    this.sve = !this.sve;
    this.disableDugmad();
    this.dodavanje = false;
    this.promena = false;
  }


  clickAktivnost(a: Aktivnost) {
    this.aktivnost = a;
    this.aktivnostForm.controls.naziv.setValue(a.naziv);
    this.aktivnostForm.controls.nt.setValue(a.nivoTezine);
    this.promena = true;
    this.funkcije.enableDugmad(['btIspuni', 'btObrisi']);
  }



  async aktivnostSacuvaj() {
    var naziv = '';
    var nivo = 0;

    if (this.aktivnostForm.controls.naziv.valid)
      naziv = String(this.aktivnostForm.controls.naziv.value);

    if (this.aktivnostForm.controls.nt.valid)
      nivo = Number(this.aktivnostForm.controls.nt.value);

    if (this.promena) {
      if (naziv != '')
        this.promeniNazivAktivnosti(naziv);

      if (nivo >= 1)
        this.promeniNt(nivo);
    }
    else {
      if (naziv != '' && nivo >= 1)
        this.dodajAktivnost(naziv, nivo);
    }

    await this.funkcije.sacekaj(0.5);
    this.sve = !this.sve;
    this.ucitajAktivnosti();
    this.promena = false;
    this.dodavanje = false;
    this.aktivnost = new Aktivnost();
  }


  selekcijaX() {
    var odabran = <HTMLInputElement>document.getElementById('listbox');
    odabran.value = '';
  }


  zatvoriAktivnost() {
    this.promena = false;
    this.dodavanje = false;
    this.aktivnost = new Aktivnost();
    this.disableDugmad();
    this.selekcijaX();
    this.aktivnostForm.reset();
    this.traziAktivnostForm.enable();
  }

  otvoriStare = false;
  otvoriNove = false;
  brZahteva = 0;


  clickNoviZahtevi() {
    if (!this.otvoriNove) {
      if (this.otvoriStare)
        this.otvoriStare = false;

      this.otvoriNove = true;
      this.noviPrimljeniZahtevi();
    }
    else {
      this.poruka = '';
      this.otvoriNove = false;
    }
    this.zahtev.id = 0;
  }

  clickStariZahtevi() {
    if (!this.otvoriStare) {
      if (this.otvoriNove)
        this.otvoriNove = false;

      this.otvoriStare = true;
      this.stariPrimljeniZahtevi();
    }
    else {
      this.otvoriStare = false;
      this.poruka = '';
    }
    this.zahtev.id = 0;
  }



  clickZahtev(z: ZahtevAktivnosti) {
    this.zahtev = z

    if (z.stanje == 0) {
      this.funkcije.disableDugmad(['btIspuni', 'btOdbij']);
      this.funkcije.enableDugme('btPrihvati');
    }

    else if (z.stanje == 1) {
      this.funkcije.disableDugme('btPrihvati');
      this.funkcije.enableDugme('btOdbij');

      if (this.aktivnost.id == 0)
        this.funkcije.disableDugme('btIspuni');
      else this.funkcije.enableDugme('btIspuni');

    }
    else this.disableDugmad();

    this.rezultat();
    this.otvoriNove = false;
    this.otvoriStare = false;
  }

  zatvoriZahtev() {
    if (this.zahtev.id > 0) {
      this.detalji = '';
      this.zahtev.id = 0;
    }
  }



  clickDodajAktivnost() {
    this.aktivnostForm.reset();
    this.traziAktivnostForm.disable();
    this.funkcije.enableDugme('btSacuvaj');
    this.dodavanje = true;
  }





}