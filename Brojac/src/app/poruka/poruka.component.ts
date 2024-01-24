import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { __values } from 'tslib';
import { Router } from '@angular/router';
import { PomocneFunkcije } from '../services/pomocne.funkcije';
import { PorukaServis } from '../services/poruka.servis';
import { Poruka } from '../model/poruka';
import { Korisnik } from '../model/korisnik';
import { KorisnikServis } from '../services/korisnik.servis';

@Component({
  selector: 'poruka',
  templateUrl: './poruka.html',
  styleUrls: ['./poruka.css']
})

export class PorukaComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private funkcije: PomocneFunkcije,
    private router: Router,
    private pServis: PorukaServis,
    private kServis: KorisnikServis) { }


  ngOnInit() {
    this.disableDugmad();
  }

  poslatePoruke = new Array<Poruka>();
  primljenePoruke = new Array<Poruka>();
  razgovor = new Array<Poruka>();
  poruka = new Poruka();
  sagovornici = new Array<Korisnik>();
  korisnikID = 0;
  greska = '';
  prikazrazgovora = false;
  sanduce = false;
  sagovornik = '';

  porukaForm = this.fb.group({
    unos: ['', Validators.required]
  })


  disableDugmad() {
    this.funkcije.disableDugmad(['btPoz', 'btObrisiRazgovor',
      'btPosaljiPoruku', 'btPrepraviPoruku', 'btObrisiPoruku']);
  }


  ucitajKorisnika(primalacID: Number) {
    this.kServis.pracen(primalacID).subscribe({
      next: (odg: Boolean) => {
        if (odg) {
          this.funkcije.enableDugme('btPoz');
          this.korisnikID = Number(primalacID);
          this.ucitajRazgovor();
        }
      },
      error: (e) => console.log(e.error),
      complete: () => console.log('ucitan id korisnika, kom mozes poslati')
    });
  }

  zatvoriKorisnika() {
    this.korisnikID = 0;
    this.funkcije.disableDugme('btPoz');
    this.razgovorX();
  }

  ucitajSagovornike() {
    this.pServis.sagovornici().subscribe({
      next: (s: Korisnik[]) => this.sagovornici = s,
      error: (e) => console.log(e.error),
      complete: () => console.log('sagovonrici su ucitani')
    });
  }

  ucitajPoslatePoruke() {
    this.pServis.poslatePoruke().subscribe({
      next: (p: Poruka[]) => this.poslatePoruke = p,
      error: (e) => this.poslatePoruke = [], //this.greska = e.error,
      complete: () => console.log('ucitane poslate poruke')
    });
  }

  ucitajPrimljenePoruke() {
    this.pServis.primljenePoruke().subscribe({
      next: (p: Poruka[]) => this.primljenePoruke = p,
      error: (e) => this.primljenePoruke = [],  // this.greska = e.error,
      complete: () => console.log('ucitane primljenee poruke')
    });
  }

  autori = new Array<Boolean>();
  ucitajAutore() {
    this.pServis.autoriPoruka(this.korisnikID).subscribe({
      next: (a: Boolean[]) => this.autori = a,
      error: (e) => this.greska = e.error,
      complete: () => console.log('ucitani autori')
    });
  }




  ucitajRazgovor() {
    this.pServis.razgovor(this.korisnikID).subscribe({
      next: (r: Poruka[]) => {
        this.razgovor = r;
        this.funkcije.enableDugme('btObrisiRazgovor');
        this.ucitajAutore();
      },
      error: (e) => {
        this.razgovor = [];
        this.funkcije.disableDugme('btObrisiRazgovor');
      },
      complete: () => console.log('ucitane poslate poruke')
    });

    this.prikazrazgovora = true;
  }


  posalji() {
    var text = String(this.porukaForm.controls.unos.value);
    text = this.funkcije.promeniUnetTekst(text);
    this.pServis.posaljiPoruku(this.korisnikID, text).subscribe({
      next: (poslata: Poruka) => {
        this.poruka = new Poruka();
        this.ucitajPoslatePoruke();
        this.ucitajSagovornike();
        this.ucitajRazgovor();
        this.porukaForm.reset();
        this.funkcije.disableDugme('btPosaljiPoruku');
      },
      error: (e) => this.greska = e.error,
      complete: () => console.log('poruka poslata')
    });
  }

  prepravi() {
    var text = String(this.porukaForm.controls.unos.value);
    text = this.funkcije.promeniUnetTekst(text);
    this.pServis.prepraviPoruku(this.poruka.id, text).subscribe({
      next: (poslata: Poruka) => {
        this.poruka = poslata;
        this.ucitajPoslatePoruke();
        this.ucitajSagovornike();
        this.ucitajRazgovor();
        this.porukaForm.reset();
        this.funkcije.disableDugmad(['btPrepraviPoruku', 'btObrisiPoruku']);
        this.poruka = new Poruka();
      },
      error: (e) => this.greska = e.error,
      complete: () => console.log('poruka prepravljena')
    });
  }

  
  obrisiPoruku() {
    this.pServis.obrisiPoruku(this.poruka.id).subscribe({
      next: (odg: string) => {
          this.poruka = new Poruka();
        this.ucitajPoslatePoruke();
        this.ucitajRazgovor();
        if (this.razgovor.length == 0){
          this.prikazrazgovora = false;
          this.sagovornici = [];
        }
        else this.ucitajSagovornike();
        this.porukaForm.reset();
        this.funkcije.disableDugmad(['btPosaljiPoruku', 'btObrisiPoruku']);
      },
      error: (e) => this.greska = e.error,
      complete: () => console.log('poruka obrisana')
    });
  }


  obrisiRazgovor() {
    this.pServis.obrisiRazgovor(this.korisnikID).subscribe({
      next: (odg: string) => {
          this.poruka = new Poruka();
        this.razgovor = [];
        this.ucitajSagovornike();
        this.funkcije.disableDugme('btObrisiRazgovor');
        this.prikazrazgovora = false;
      },
      error: (e) => this.greska = e.error,
      complete: () => console.log('ucitane poslate poruke')
    });
  }


  obrisiRazgovore() {
    this.pServis.obrisiRazgovore().subscribe({
      next: (odg: string) => {
        this.greska = odg,
          this.poruka = new Poruka();
        this.razgovor = [];
        this.primljenePoruke = [];
        this.poslatePoruke = [];
        this.sagovornici = [];
        this.prikazrazgovora = false;
      },
      error: (e) => this.greska = e.error,
      complete: () => console.log('razgovori su obrisani')
    });
  }


  obrisiPoslatePoruke() {
    this.pServis.obrisiPoslatePoruke().subscribe({
      next: (odg: string) => {
        this.greska = odg,
          this.poruka = new Poruka();
        this.poslatePoruke = [];
        this.ucitajSagovornike();
      },
      error: (e) => this.greska = e.error,
      complete: () => console.log('razgovori su obrisani')
    });
  }





  clickSanduce() {
    this.ucitajSagovornike();
    this.ucitajPoslatePoruke();
    this.ucitajPrimljenePoruke();
    this.sanduce = !this.sanduce;
  }


  razgovorX() {
    this.prikazrazgovora = false;
    this.poruka = new Poruka();
    this.razgovor = [];
    this.porukaForm.reset();
  }


  oznaciPoruku(porukaID: Number, i:Number) {
    if(this.poruka.id == porukaID){
      this.poruka = new Poruka();
      this.funkcije.ukloniOkvir(i);
      this.porukaForm.controls.unos.setValue('');
      this.funkcije.disableDugmad(['btObrisiPoruku', 'btPrepraviPoruku']);
    }
    else{
      this.pServis.poslataPoruka(porukaID).subscribe({
        next: (p: Poruka) => {
          this.poruka = p;
          this.porukaForm.controls.unos.setValue(String(p.tekst));
          this.funkcije.enableDugmad(['btObrisiPoruku']);
          this.funkcije.ukloniOkvire(i, 'liPoruka');
          this.funkcije.uokviri(i);
        },
        error: (e) => console.log(e.error),
        complete: () => console.log('pronadjena poslata poruka')
      });
    }

  }


  unosPoruke() {
    var unos = String(this.porukaForm.controls.unos.value);
    if (unos.trim() != '' && this.poruka.id == 0)
      this.funkcije.enableDugme('btPosaljiPoruku');
    else if (unos.trim() != '' && this.poruka.id != 0 && unos.trim() != this.poruka.tekst )
      this.funkcije.enableDugme('btPrepraviPoruku');
    else this.funkcije.disableDugmad(['btPosaljiPoruku', 'btPrepraviPoruku']);
  }


  @Output() nadji = new EventEmitter();

  izaberiRazgovor(rID: Number) {
    this.korisnikID = Number(rID);
    this.ucitajRazgovor();
    this.sanduce = false;
    localStorage.setItem('oznacen', rID.toString());
    this.nadji.emit();
  }




}

