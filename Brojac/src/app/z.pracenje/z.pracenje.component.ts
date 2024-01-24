import { Component, OnInit } from '@angular/core';
import { __values } from 'tslib';
import { FormBuilder, Validators } from '@angular/forms';
import { PomocneFunkcije } from '../services/pomocne.funkcije';
import { ZahtevZaPracenjeServis } from '../services/z.pracenje.servis';
import { ZahtevZaPracenje } from '../model/zahtev.za.pracenje';
import { RezultatZahteva } from '../model/rezultat.zahteva';
import { KorisnikServis } from '../services/korisnik.servis';
import { Korisnik } from '../model/korisnik';

@Component({
  selector: 'z-pracenje',
  templateUrl: './z.pracenje.html',
  styleUrls: ['./z.pracenje.css']
})

export class ZPracenjeComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private funkcije: PomocneFunkcije,
    private zpServis: ZahtevZaPracenjeServis,
    private kServis: KorisnikServis) { }


  ngOnInit() {
   // this.disableDugmad();
  }


  zahteviForm = this.fb.group({
    zPoslat: [0, Validators.required],
    zPrimljen: [0, Validators.required]
  })

  zahtev = new ZahtevZaPracenje();
  primljeniZahtevi = new Array<ZahtevZaPracenje>();
  poslatiZahtevi = new Array<ZahtevZaPracenje>();

  otvoriposlate = false;
  otvoriprimljene = false;
  otvoridetalje = false;
  zPrimljen = false;
  
  greska = '';
  detalji = '';
  korisnik = new Korisnik();
  podnosioci = new Array<string>();
  primaoci = new Array<string>();

  disableDugmad() {
    this.funkcije.disableDugmad(['btPrihvati', 'btOdbij', 'btPovuci']);
  }



  ucitajPoslateZP() {
    this.zpServis.poslatiZahtevi().subscribe({
      next: (z: ZahtevZaPracenje[]) => this.poslatiZahtevi = z,
      error: (e) => this.poslatiZahtevi = [],
      complete: () => console.log('ucitani poslati zahtevi za pracenje')
    });
  }

  ucitajPrimaoce() {
    this.zpServis.primaoci().subscribe({
      next: (imena: string[]) => this.primaoci = imena,
      error: (e) => this.primaoci = [],
      complete: () => console.log('ucitani primaoci')
    });
  }

  ucitajPrimljeneZP() {
    this.zpServis.primljeniZahtevi().subscribe({
      next: (z: ZahtevZaPracenje[]) => this.primljeniZahtevi = z,
      error: (e) => this.primljeniZahtevi = [],
      complete: () => console.log('ucitani primljeni zahtevi za pracenje')
    });
  }

  ucitajPodnosioce() {
    this.zpServis.podnosioci().subscribe({
      next: (imena: string[]) => this.podnosioci = imena,
      error: (e) =>  this.podnosioci = [], 
      complete: () => console.log('ucitani podnosioci')
    });
  }




  clickZX(){
    if (this.otvoriprimljene && !this.otvoriposlate) 
      this.otvoriprimljene = false;
     
    else if (this.otvoriposlate && !this.otvoriprimljene) 
      this.otvoriposlate = false;
    
      this.funkcije.enableDugme('btPrimljeni');
      this.funkcije.enableDugme('btZp');
  }


  async clickZP() {
    this.ucitajPrimljeneZP();
    this.ucitajPodnosioce();
    this.ucitajPoslateZP();
    this.ucitajPrimaoce();
    this.zPrimljen = true;
    await this.funkcije.sacekaj(0.5);

     if (!this.otvoriposlate && !this.otvoriprimljene) {
      this.otvoriprimljene = true;
    
      this.funkcije.disableDugme('btPrimljeni');
      this.funkcije.enableDugme('btPoslati');
      this.funkcije.disableDugme('btZp');
    }

  }


  clickPrimljeneZP() {
    this.zPrimljen = true;
    this.ucitajPrimljeneZP();
    this.ucitajPodnosioce();

    if (this.otvoriposlate)
      this.otvoriposlate = false;

    if (!this.otvoriprimljene)
      this.otvoriprimljene = true;

    this.funkcije.enableDugme('btPoslati');
    this.funkcije.disableDugme('btPrimljeni');
  }

  clickPoslateZP() {
    this.zPrimljen = false;
    this.ucitajPoslateZP();
    this.ucitajPrimaoce();

    if (this.otvoriprimljene)
      this.otvoriprimljene = false;

    if (!this.otvoriposlate)
      this.otvoriposlate = true;

    this.funkcije.enableDugme('btPrimljeni');
    this.funkcije.disableDugme('btPoslati');
  }



  async clickPoslatZP() {
    this.nadjiPoslatZP();
    await this.funkcije.sacekaj(0.5);
    this.rezultatPoslatogZ()
    this.otvoriprimljene = false;
    this.otvoridetalje = true;
  }

  async clickPrimljenZP() {
    this.nadjiPrimljenZP();
    await this.funkcije.sacekaj(0.5);
    this.rezultatPrimljenogZ();
    this.otvoriposlate = false;
    this.otvoridetalje = true;
  }


  nadjiPoslatZP() {
    var z = Number(this.zahteviForm.controls.zPoslat.value);
    this.zpServis.nadjiPoslatZahtev(z).subscribe({
      next: (zp: ZahtevZaPracenje) => {
        this.zahtev = zp;
        
        if (zp.stanje == 0)
          this.funkcije.enableDugme('btPovuciZP');
        else{ this.funkcije.disableDugme('btPovuciZP'); console.log('nije vece')}
      },
      error: (e) => this.detalji = e.error,
      complete: () => console.log('pronadjen zahtev')
    });
  }

  nadjiPrimljenZP() {
    var z = Number(this.zahteviForm.controls.zPrimljen.value);
    this.zpServis.nadjiPrimljenZahtev(z).subscribe({
      next: (zp: ZahtevZaPracenje) => {
        this.zahtev = zp;
        if (zp.stanje > 0) {
          this.funkcije.disableDugme('btPrihvati');
          this.funkcije.disableDugme('btOdbij');
        }
        else {
          this.funkcije.enableDugme('btPrihvati');
          this.funkcije.enableDugme('btOdbij');
        }
      },
      error: (e) => this.detalji = e.error,
      complete: () => console.log('pronadjen zahtev')
    });
  }


  nadjiKorisnika(id: Number) {
    this.kServis.korisnikPoIDu(id).subscribe({
      next: (k: Korisnik) => this.korisnik = k,
      error: (e) => this.detalji = e.error,
      complete: () => console.log('pronadjen je korisnik ' + this.korisnik.ime)
    });
  }



  rezultatPrimljenogZ() {
    this.zpServis.nadjiRezultatPrimljenogZahteva(this.zahtev.id).subscribe({
      next: (rez: RezultatZahteva) => this.detalji = rez.poruka,
      error: (e) => this.detalji = e.error,
      complete: () => console.log('Rezultat primljenog zahteva je ispisan')
    });
  }

  rezultatPoslatogZ() {
    this.zpServis.nadjiRezultatPoslatogZahteva(this.zahtev.id).subscribe({
      next: (rez: RezultatZahteva) => this.detalji = rez.poruka,
      error: (e) => this.detalji = e.error,
      complete: () => console.log('Rezultat poslatog zahteva je ispisan')
    });
  }




  povuci() {
    this.zpServis.povuciZahtev(this.zahtev.id).subscribe({
      next: (odg: string) => {
        this.detalji = odg;
        this.ucitajPoslateZP();
        this.ucitajPrimaoce();
        this.funkcije.disableDugme('btPovuci');
        this.zahteviForm.controls.zPoslat.setValue(0);
      },
      error: (e) => this.detalji = e.error,
      complete: () => console.log('povucen zahtev')
    });
  }


  prihvati() {
    var z = Number(this.zahteviForm.controls.zPrimljen.value);
    this.zpServis.prihvatiZahtev(z).subscribe({
      next: (z: ZahtevZaPracenje) => {
        this.zahtev = z,
          this.detalji = 'Zahtev korisnika je prihvacen, korisnik ' + z.podnosilacID + ' Vas sada prati.';
        this.ucitajPrimljeneZP();
        this.ucitajPodnosioce();
        this.funkcije.disableDugme('btPrihvati');
        this.funkcije.disableDugme('btOdbij');
        this.zahteviForm.controls.zPrimljen.setValue(0);
      },
      error: (e) => this.detalji = e.error,
      complete: () => console.log(' prihvacen zahtev')
    });
  }


  odbij() {
    var z = Number(this.zahteviForm.controls.zPrimljen.value);
    this.zpServis.odbijZahtev(z).subscribe({
      next: (z: ZahtevZaPracenje) => {
        this.zahtev = z,
          this.detalji = 'Odbili ste zahtev korisnika ' + z.podnosilacID;
        this.ucitajPrimljeneZP();
        this.ucitajPodnosioce();
        this.funkcije.disableDugme('btPrihvati');
        this.funkcije.disableDugme('btOdbij');
        this.zahteviForm.controls.zPrimljen.setValue(0);
      },
      error: (e) => this.detalji = e.error,
      complete: () => console.log(' odbijen zahtev')
    });
  }


  zahtevX() {
    this.otvoridetalje = false;
    this.detalji = '';
    this.zahtev = new ZahtevZaPracenje();
    this.zahteviForm.reset();
  }

}

