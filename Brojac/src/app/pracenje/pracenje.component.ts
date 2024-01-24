import { Component, Output, OnInit, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { __values } from 'tslib';
import { Router } from '@angular/router';
import { PomocneFunkcije } from '../services/pomocne.funkcije';
import { ZahtevZaPracenjeServis } from '../services/z.pracenje.servis';
import { ZahtevZaPracenje } from '../model/zahtev.za.pracenje';
import { Korisnik } from '../model/korisnik';
import { RezultatZahteva } from '../model/rezultat.zahteva';
import { KorisnikServis } from '../services/korisnik.servis';
import { DrustvoComponent } from '../drustvo/drustvo.component';


@Component({
  selector: 'pracenje',
  templateUrl: './pracenje.html',
  styleUrls: ['./pracenje.css']
})

export class PracenjeComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private funkcije: PomocneFunkcije,
    private router: Router,
    private kServis: KorisnikServis,
    private zServis: ZahtevZaPracenjeServis) { }


  @Output() ucitavanje = new EventEmitter();

  @Output() sve = new EventEmitter();



  ucitajObjave(autorID: Number) {
    this.ucitavanje.emit();
  }


  ngOnInit() {
    this.disableDugmad();
    this.ucitajPratioce();
    this.ucitajPracene();
  }

  korisnik = new Korisnik();
  public pratim = false;
  prati = false;
  slanje = false;
  vecPoslat = false;
  rezPretrage = new Array<Korisnik>();
  datum = '';
  pol = '';
  putanja = '';
  pratiNatpis = 'zaprati';
  pratiTitl = 'Pošalji ovom korisniku zahtev za praćenje.'
  pratiociNatpis = 'pratioci';
  pratiociTitl = "Klik ovde da vidiš listu svojih pratilaca.";
  pratioci = new Array<Korisnik>();
  praceni = new Array<Korisnik>();
  zahtev = new ZahtevZaPracenje();
  greska = '';
  rezultati = new Array<RezultatZahteva>();
  rezultat = new RezultatZahteva();



  disableDugmad() {
    this.funkcije.disableDugmad(['btPrati', 'btUkloni', 'btTrazi']);
  }

  praceniForm = this.fb.group({
    oznacen: [0, Validators.required]
  })

  pratiociForm = this.fb.group({
    oznacen: [0, Validators.required]
  })


  pretragaForm = this.fb.group({
    unos: ['', Validators.required],
    pronadjen: [0, Validators.required]
  })

  slanjeForm = this.fb.group({
    pozdrav: ['', Validators.required],
    prijava: [true, Validators.required]
  })


  ucitajPratioce() {
    this.kServis.pratioci().subscribe({
      next: (p: Korisnik[]) => this.pratioci = p,
      error: (e) => this.pratioci = [], 
      complete: () => console.log('ucitani pratioci')
    });
  }


  ucitajPracene() {
    this.kServis.praceni().subscribe({
      next: (p: Korisnik[]) => this.praceni = p,
      error: (e) => this.praceni = [], 
      complete: () => console.log('ucitani praceni')
    });
  }


  zvonce = '';

  podesiZvonce() {
    var pz = Boolean(this.slanjeForm.controls.prijava.value);
    if (pz)
      this.zvonce = '🔔';
    else this.zvonce = '🔕';
  }

  poslednji() {
    this.zServis.prijavaPrethodnog().subscribe({
      next: (pz: Boolean) => {
        this.slanjeForm.controls.prijava.setValue(Boolean(pz));
        this.podesiZvonce();
      },
      error: (e) => this.greska = e.error,
      complete: () => console.log('ucitana prijava prethodnog zahteva')
    });
  }


  zahtevPoslatKorisniku() {
    this.zServis.zahtevPoslatKorisniku(this.korisnik.id).subscribe({
      next: (odg: Boolean) => {
        if (odg) {
          this.greska = 'Poslali ste zahtev ovom korisniku, zahtev još nije obrađen.'
          this.funkcije.disableDugme('btPrati');
        }
        else this.greska = '';
      }, 
      error: (e) => this.greska = e.error,
      complete: () => console.log('je li vec poslat? ' + this.vecPoslat)
    });
  }



  posalji() {
    var prijava = Boolean(this.slanjeForm.controls.prijava.value);
    var pozdrav = '*';
    if (this.slanjeForm.controls.pozdrav.valid)
      pozdrav = String(this.slanjeForm.controls.pozdrav.value);

    this.zServis.posaljiZahtev(this.korisnik.id, prijava, pozdrav).subscribe({
      next: (z: ZahtevZaPracenje) => {
        this.zahtev = z;
        this.slanje = false;
        this.slanjeForm.reset;
        window.location.reload();
      },
      error: (e) => {
        this.greska = e.error;
        this.zahtev = new ZahtevZaPracenje();
      },
      complete: () => console.log('zahtev poslat')
    });
  }


  otprati() {
    var korisnikID = 0;
    this.zServis.otprati(korisnikID).subscribe({
      next: (odg: string) => this.greska = odg,
      error: (e) => this.greska = e.error,
      complete: () => console.log('otpracen')
    });
  }

  obrisiPratioca() {
    var korisnikID = 0;
    this.zServis.obrisiPratioca(korisnikID).subscribe({
      next: (odg: string) => this.greska = odg,
      error: (e) => this.greska = e.error,
      complete: () => console.log('obrisan')
    });
  }


  nadjiKorisnika(id: Number) {
    this.kServis.korisnikPoIDu(id).subscribe({
      next: (k: Korisnik) => {
        this.korisnik = k;
        localStorage.setItem('oznacen', k.id.toString());
        this.putanja = '../assets/' + this.korisnik.slika;
        if (k.pol == 0) {
          this.pol = 'pol: muški';
          this.datum = 'rođen ' + this.funkcije.prikaziDatum(k.datumRodjenja);
        }
        else {
          this.pol = 'pol : ženski';
          this.datum = 'rođena: ' + this.funkcije.prikaziDatum(k.datumRodjenja);
        }
        this.rezultatPretrageX();
        this.pracen(id);
        this.pratilac(id);
        this.zahtevPoslatKorisniku();
      },
      error: (e) => this.greska = e.error,
      complete: () => console.log('korisnik oznacen')
    });
  }


  pracen(id: Number) {
    this.kServis.pracen(id).subscribe({
      next: (odg: Boolean) => {
        if (odg) {
          this.pratiNatpis = 'otprati';
          this.pratiTitl = 'Prestani da pratiš ovog korisnika.'
          this.ucitajObjave(id);
        }
        else {
          this.pratiNatpis = 'zaprati';
          this.pratiTitl = 'Pošalji ovom korisniku zahtev za praćenje.';
        }

        this.pratim = Boolean(odg);
        this.funkcije.enableDugme('btPrati');
      },
      error: (e) => this.greska = e.error,
      complete: () => console.log('pratim li ga?')
    });
  }

  pratilac(id: Number) {
    this.kServis.pratilac(id).subscribe({
      next: (odg: Boolean) => {
        if (odg)
          this.funkcije.enableDugme('btUkloni');
        this.prati = Boolean(odg);
      },
      error: (e) => this.greska = e.error,
      complete: () => console.log('prati li me?')
    });
  }

  oznaci() {
    var oznacen = Number(this.praceniForm.controls.oznacen.value);
    this.nadjiKorisnika(oznacen);
    this.praceniForm.reset();
  }

  oznaciPratioca() {
    var oznacen = Number(this.pratiociForm.controls.oznacen.value);
    this.nadjiKorisnika(oznacen);
    this.pratiociForm.reset();
  }

  prikazi() {
    var pronadjen = Number(this.pretragaForm.controls.pronadjen.value);
    this.pretragaForm.reset();
    this.nadjiKorisnika(pronadjen);
  }

  rezultatPretrageX() {
    this.rezPretrage = [];
    this.pretragaForm.reset();
  }

  korisnikX() {
    this.korisnik = new Korisnik();
    this.datum = '';
    this.pol = '';
    this.sve.emit();
  }

  popunjeno() {
    var unos = '';
    if (this.pretragaForm.controls.unos.valid)
      unos = String(this.pretragaForm.controls.unos.value);

    if (unos.trim() == '') 
      this.funkcije.disableDugme('btTrazi')
    else
      this.funkcije.enableDugme('btTrazi');
  }


  clickTrazi() {
    var unos = String(this.pretragaForm.controls.unos.value);
    this.kServis.korisniciPoImenu(unos).subscribe({
      next: (k: Korisnik[]) => {
        this.rezPretrage = k
        this.funkcije.disableDugme('btTrazi');
        this.pretragaForm.controls.unos.reset();
      },
      error: (e) => {
        this.greska = e.error;
        this.rezPretrage = [];
        this.pretragaForm.controls.unos.reset();
      },
      complete: () => console.log('pronadjen korisnik')
    });
  }

  clickPrati() {
    if (this.pratim)
      this.otprati();
    else {
      this.slanje = true;
      this.poslednji();
    }
  }





}