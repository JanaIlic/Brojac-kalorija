import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { __values } from 'tslib';
import { Router } from '@angular/router';

import { AdminNamirnica } from '../model/admin.namirnica';
import { AdminServis } from '../services/admin.servis';
import { PomocneFunkcije } from '../services/pomocne.funkcije';
import { NamirnicaServis } from '../services/namirnica.servis';
import { ZahtevNamirniceServis } from '../services/z.namirnice.servis';
import { Namirnica } from '../model/namirnica';
import { ZahtevNamirnice } from '../model/zahtev.namirnice';
import { RezultatZahteva } from '../model/rezultat.zahteva';
import { KorisnikServis } from '../services/korisnik.servis';
import { Korisnik } from '../model/korisnik';

@Component({
  selector: 'an-prikaz',
  templateUrl: './prikaz.an.html',
  styleUrls: ['./prikaz.an.css']
})

export class PrikazAnComponent implements OnInit {

  constructor(private adminServis: AdminServis,
    private fb: FormBuilder, private router: Router,
    private funkcije: PomocneFunkcije,
    public nServis: NamirnicaServis,
    private znServis: ZahtevNamirniceServis,
    private kServis: KorisnikServis) { }


  ngOnInit() {
    this.sveNamirnice();
    this.namirnica = new Namirnica();
    this.zahtev = new ZahtevNamirnice();
    this.disableDugmad();
  }



  namirnicaForm = this.fb.group({
    naziv: ['', Validators.required],
    ev: [-1, Validators.required],
    protein: [-1, Validators.required],
    uh: [-1, Validators.required],
    mast: [-1, Validators.required],
    vrsta: [9, Validators.required],
    tip: [6, Validators.required],
    dm: [4, Validators.required],
    db: [4, Validators.required],
    pm: [-1, Validators.required],
    opis: ['']
  })



  traziNamirnicuForm = this.fb.group({
    unos: ['', [Validators.required]]
  })


  natpis = 'Prikaži samo dodate.'
  sve = true;
  namirnice = new Array<Namirnica>();
  namirnica = new Namirnica();
  zahtev = new ZahtevNamirnice();
  zahtevi = new Array<ZahtevNamirnice>();
  poruka = '';
  dNatpis = '';
  dodavanje = false;
  promena = false;
  podnosilac = '';


  disableDugmad() {
    this.funkcije.disableDugmad(['btPrihvati', 'btIspuni', 'btOdbij']);
  }

  clickNazad() {
    this.router.navigate(['./pocetna']);
    localStorage.removeItem('authToken');
  }

  sveNamirnice() {
    this.nServis.namirnice().subscribe({
      next: (n: Namirnica[]) => {
        this.namirnice = n;
        this.poruka = '';
      },
      error: (e) => this.poruka = e.error,
      complete: () => console.log('Sve namirnice su učitane.')
    });
  }

  dodateNamirnice() {
    this.adminServis.dodateNamirnice().subscribe({
      next: (n: Namirnica[]) => {
        this.namirnice = n;
        this.poruka = '';
      },
      error: (e) => {
        this.poruka = e.error;
        this.namirnice = [];
      },
      complete: () => console.log('Dodate namirnice su učitane.')
    });
  }

  pretraziNamirnice() {
    var naziv = '';
    if (this.traziNamirnicuForm.controls.unos.valid)
      naziv = String(this.traziNamirnicuForm.controls.unos.value);

    this.nServis.nadjiPoNazivu(naziv).subscribe({
      next: (n: Namirnica[]) => this.namirnice = n,
      error: (e) => this.poruka = e.error,
      complete: () => console.log('Pronađene namirnice su učitane.')
    });
  }



  popunjeno() {
    var unos = '';
    if (this.traziNamirnicuForm.controls.unos.valid)
      unos = String(this.traziNamirnicuForm.controls.unos.value);

    if (unos == '' || unos == ' ') {
      this.funkcije.disableDugme('btTrazi');
      this.sveNamirnice();
    }
    else
      this.funkcije.enableDugme('btTrazi');

  }



  dodajNamirnicu(naziv: string, vrsta: Number, tip: Number, db: Number, dm: Number,
    ev: Number, protein: Number, uh: Number, mast: Number, pm: Number, opis: string) {
    this.nServis.dodaj(naziv, vrsta, tip, db, dm, ev, protein, uh, mast, pm, opis).subscribe({
      next: (n: Namirnica) => this.namirnica = n,
      error: (e) => this.poruka = e.error,
      complete: () => console.log('Dodata je nova namirnica.')
    });
  }

  promeniNazivNamirnice(naziv: string) {
    this.nServis.promeniNaziv(this.namirnica.id, naziv).subscribe({
      next: (n: Namirnica) => this.namirnica = n,
      error: (e) => this.poruka = e.error,
      complete: () => console.log('Promenjen je naziv namirnice.')
    });
  }

  promeniEV(ev: Number) {
    this.nServis.promeniEV(this.namirnica.id, ev).subscribe({
      next: (n: Namirnica) => this.namirnica = n,
      error: (e) => this.poruka = e.error,
      complete: () => console.log('Promena ev namirnice.')
    });
  }

  promeniProtein(protein: Number) {
    this.nServis.promeniProtein(this.namirnica.id, protein).subscribe({
      next: (n: Namirnica) => this.namirnica = n,
      error: (e) => this.poruka = e.error,
      complete: () => console.log('Promena proteina namirnice.')
    });
  }

  promeniUH(uh: Number) {
    this.nServis.promeniUH(this.namirnica.id, uh).subscribe({
      next: (n: Namirnica) => this.namirnica = n,
      error: (e) => this.poruka = e.error,
      complete: () => console.log('Promena UH namirnice.')
    });
  }

  promeniMast(mast: Number) {
    this.nServis.promeniMast(this.namirnica.id, mast).subscribe({
      next: (n: Namirnica) => this.namirnica = n,
      error: (e) => this.poruka = e.error,
      complete: () => console.log('Promena masti namirnice.')
    });
  }

  promeniDM(dm: Number) {
    this.nServis.promeniDM(this.namirnica.id, dm).subscribe({
      next: (n: Namirnica) => this.namirnica = n,
      error: (e) => this.poruka = e.error,
      complete: () => console.log('Promena dodate masti namirnice.')
    });
  }

  promeniBrasno(db: Number) {
    this.nServis.promeniBrasno(this.namirnica.id, db).subscribe({
      next: (n: Namirnica) => this.namirnica = n,
      error: (e) => this.poruka = e.error,
      complete: () => console.log('Promena dodatog brasna.. namirnice.')
    });
  }

  promeniKoeficijent(pm: Number) {
    this.nServis.promeniKoeficijent(this.namirnica.id, pm).subscribe({
      next: (n: Namirnica) => this.namirnica = n,
      error: (e) => this.poruka = e.error,
      complete: () => console.log('Promena koeficijenta  namirnice.')
    });
  }

  promeniVrstu(vrsta: Number) {
    this.nServis.promeniVrstu(this.namirnica.id, vrsta).subscribe({
      next: (n: Namirnica) => this.namirnica = n,
      error: (e) => this.poruka = e.error,
      complete: () => console.log('Promena vrste namirnice.')
    });
  }

  promeniTipObrade(tip: Number) {
    this.nServis.promeniTipObrade(this.namirnica.id, tip).subscribe({
      next: (n: Namirnica) => this.namirnica = n,
      error: (e) => this.poruka = e.error,
      complete: () => console.log('Promena tipa obrade namirnice.')
    });
  }

  promeniOpis(opis: string) {
    this.nServis.promeniOpis(this.namirnica.id, opis).subscribe({
      next: (n: Namirnica) => this.namirnica = n,
      error: (e) => this.poruka = e.error,
      complete: () => console.log('Promena tipa obrade namirnice.')
    });
  }

  async obrisiNamirnicu() {
    this.nServis.obrisi(this.namirnica.id).subscribe({
      next: (odg: string) => this.poruka = odg,
      error: (e) => this.poruka = e.error,
      complete: () => console.log('Namirnica je obrisana.')
    });

    await this.funkcije.sacekaj(1);
    this.sve = !this.sve;
    this.ucitajNamirnice();
    this.promena = false;
    this.dodavanje = false;
    this.namirnica.id = 0;
  }


  nadjiPodnosioca(korisnikID: Number) {
    this.kServis.korisnikPoIDu(korisnikID).subscribe({
      next: (k: Korisnik) => this.podnosilac = k.ime
    });
  }

  noviPrimljeniZahtevi() {
    this.znServis.noviPrimljeniZahtevi().subscribe({
      next: (odg: ZahtevNamirnice[]) => {
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
    this.znServis.stariPrimljeniZahtevi().subscribe({
      next: (odg: ZahtevNamirnice[]) => {
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
    this.znServis.prihvatiZahtev(this.zahtev.id).subscribe({
      next: (odg: ZahtevNamirnice) => {
        this.zahtev = odg;
        this.rezultat();
        this.funkcije.enableDugme('btOdbij');
        if (this.namirnica.id != 0)
          this.funkcije.enableDugme('btIspuni');
      },
      error: (e) => this.detalji = e.error,
      complete: () => console.log('Zahtev je prihvaćen.')
    });
  }

  ispuniZahtev() {
    this.znServis.ispuniZahtev(this.zahtev.id, this.namirnica.naziv).subscribe({
      next: (odg: ZahtevNamirnice) => {
        this.zahtev = odg;
        this.stariPrimljeniZahtevi();
        this.noviPrimljeniZahtevi();
        this.rezultat();
        this.promena = false;
        this.dodavanje = false;
        this.namirnica.id = 0;
        this.sve = !this.sve;
        this.ucitajNamirnice();
        this.disableDugmad();
      },
      error: (e) => this.detalji = e.error,
      complete: () => console.log('Zahtev je ispunjen.')
    });
  }

  odbijZahtev() {
    this.znServis.odbijZahtev(this.zahtev.id).subscribe({
      next: (odg: ZahtevNamirnice) => {
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
    this.znServis.rezultatPrimljenogZahteva(this.zahtev.id).subscribe({
      next: (odg: RezultatZahteva) => this.detalji = odg.poruka,
      error: async (e) => {
        console.log(e.error);
        this.nadjiPodnosioca(this.zahtev.podnosilacID);
        await this.funkcije.sacekaj(0.5);
        this.detalji = 'Korisnik ' + this.podnosilac + ' je poslao zahtev za ' +
          this.zahtev.nazivNamirnice + ', ' + this.funkcije.prikaziVremeDatum(this.zahtev.podnet) +
          ', uz napomenu: "' + this.zahtev.poruka + '", ' + this.zahtev.stanje;
      },
      complete: () => console.log('Rezultat zahteva je ispisan.')
    });
  }


  ucitajNamirnice() {
    if (this.sve) {
      this.dodateNamirnice();
      this.natpis = 'Prikaži sve.'
    }
    else {
      this.sveNamirnice();
      this.natpis = 'Prikaži samo dodate.';
    }
    this.sve = !this.sve;
    this.dodavanje = false;
    this.promena = false;
    this.namirnica.id = 0;
  }


  clickNamirnica(n: Namirnica) {
    this.namirnica = n;

    this.namirnicaForm.controls.naziv.setValue(n.naziv);
    this.namirnicaForm.controls.ev.setValue(Number(n.energetskaVrednost));
    this.namirnicaForm.controls.protein.setValue(Number(n.protein));
    this.namirnicaForm.controls.uh.setValue(Number(n.ugljeniHidrati));
    this.namirnicaForm.controls.mast.setValue(Number(n.mast));
    this.namirnicaForm.controls.vrsta.setValue(Number(n.vrsta));
    this.namirnicaForm.controls.tip.setValue(Number(n.tip));
    this.namirnicaForm.controls.dm.setValue(Number(n.dodataMast));
    this.namirnicaForm.controls.db.setValue(Number(n.dodatoBrasno));
    this.namirnicaForm.controls.pm.setValue(Number(n.promenaMase));
    this.namirnicaForm.controls.opis.setValue(n.opis);
    this.promena = true;

    this.funkcije.enableDugme('btIspuni');
  }



  async namirnicaSacuvaj() {
    var naziv = '';
    var ev = Number();
    var uh = Number();
    var protein = Number();
    var mast = Number();
    var dm = Number();
    var db = Number();
    var pm = Number();
    var vrsta = Number();
    var tip = Number();
    var opis = '';

    if (this.namirnicaForm.controls.naziv.valid)
      naziv = String(this.namirnicaForm.controls.naziv.value);

    if (this.namirnicaForm.controls.vrsta.valid)
      vrsta = Number(this.namirnicaForm.controls.vrsta.value);

    if (this.namirnicaForm.controls.ev.valid)
      ev = Number(this.namirnicaForm.controls.ev.value);

    if (this.namirnicaForm.controls.protein.valid)
      protein = Number(this.namirnicaForm.controls.protein.value);

    if (this.namirnicaForm.controls.mast.valid)
      mast = Number(this.namirnicaForm.controls.mast.value);

    if (this.namirnicaForm.controls.uh.valid)
      uh = Number(this.namirnicaForm.controls.uh.value);

    if (this.namirnicaForm.controls.pm.valid)
      pm = Number(this.namirnicaForm.controls.pm.value);

    if (this.namirnicaForm.controls.tip.valid)
      tip = Number(this.namirnicaForm.controls.tip.value);

    if (this.namirnicaForm.controls.dm.valid)
      dm = Number(this.namirnicaForm.controls.dm.value);

    if (this.namirnicaForm.controls.dm.valid)
      db = Number(this.namirnicaForm.controls.dm.value);

    opis = String(this.namirnicaForm.controls.opis.value);

    if (this.promena) {
      if (naziv != '')
        this.promeniNazivNamirnice(naziv);

      if (ev >= 0)
        this.promeniEV(ev);

      if (protein >= 0)
        this.promeniProtein(protein);

      if (mast >= 0)
        this.promeniMast(mast);

      if (uh >= 0)
        this.promeniUH(uh);

      if (dm < 4)
        this.promeniDM(dm);

      if (db < 4)
        this.promeniBrasno(db);

      if (vrsta < 9)
        this.promeniVrstu(vrsta);

      if (tip < 6)
        this.promeniTipObrade(tip);

      if (pm >= 0)
        this.promeniKoeficijent(pm);

      if (opis != '')
        this.promeniOpis(opis);
    }
    else {
      if (this.namirnicaForm.valid)
        this.dodajNamirnicu(naziv, vrsta, tip, db, dm, ev, protein, uh, mast, pm, 'neki opis');
    }

    await this.funkcije.sacekaj(0.5);
    this.namirnica.id = 0;
    this.sve = !this.sve;
    this.ucitajNamirnice();
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



  clickZahtev(z: ZahtevNamirnice) {
    this.zahtev = z

    if (z.stanje == 0) {
      this.funkcije.disableDugmad(['btIspuni', 'btOdbij']);
      this.funkcije.enableDugme('btPrihvati');
    }
    else if (z.stanje == 1) {
      this.funkcije.disableDugme('btPrihvati');
      this.funkcije.enableDugme('btOdbij');

      if (this.zahtev.id == 0)
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








}