import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, MinLengthValidator, Validators } from '@angular/forms';
import { PomocneFunkcije } from '../services/pomocne.funkcije';
import { Router } from '@angular/router';
import { KorisnikServis } from '../services/korisnik.servis';
import { Korisnik } from '../model/korisnik';


@Component({
  selector: 'korisnik',
  templateUrl: './korisnik.html',
  styleUrls: ['./korisnik.css']
})

export class KorisnikComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private funkcije: PomocneFunkcije,
    private router: Router,
    private kServis: KorisnikServis) { }


  ngOnInit() {
    this.prijavljen();
  }


  drForm = this.fb.group({
    godina: [0, Validators.required],
    mesec: [0, Validators.required],
    dan: [0, Validators.required]
  })

  imeForm = this.fb.group({
    ime: ['', Validators.required]
  })

  sifraForm = this.fb.group({
    sifra: ['', Validators.required],
    potvrda: ['', Validators.required]
  })

  slikaForm = this.fb.group({
    slika: ['', Validators.required]
  })

  brisanjeForm = this.fb.group({})

  korisnik = new Korisnik;
  poruka = '';
  imeforma = false;
  sifraforma = false;
  drforma = false;
  slikaforma = false;
  brisanjeforma = false;


  disableDugmad() {
    var dugmad = ['btIme', 'btSifra', 'btDr', 'btSlika', 'btObrisi'];
    this.funkcije.disableDugmad(dugmad);
  }


  enableDugmad() {
    var dugmad = ['btIme', 'btSifra', 'btDr', 'btSlika', 'btObrisi'];
    this.funkcije.enableDugmad(dugmad);
  }


  prijavljen() {
    this.kServis.prijavljen().subscribe({
      next: (odg: Korisnik) => {
        this.korisnik = odg;
        this.imeForm.controls.ime.setValue(this.korisnik.ime);
        const d = new Date(this.korisnik.datumRodjenja);
        this.drForm.controls.godina.setValue(d.getFullYear());
        this.drForm.controls.mesec.setValue(d.getMonth() + 1);
        this.brDana();
        this.drForm.controls.dan.setValue(d.getDate());

        if (this.korisnik.slika == '*')
          this.putanja = '../assets/default.png';
        else this.putanja = '../assets/' + this.korisnik.slika;

      },
      error: (e) => this.poruka = e.error,
      complete: () => console.log('Učitan je prijavljeni korisnik.')
    });
  }

  odjaviSe() {
    localStorage.removeItem('authToken');
    this.router.navigate(['./pocetna']);
  }


  ucitajSliku() {
    this.poruka = 'Sačekaj malo. ⏳'
    this.kServis.nadjiSliku().subscribe({
      next: (odg: string) =>
        this.putanja = '../assets/' + odg,
      error: (e) => {
        console.log(e);
        this.putanja = '../assets/default.png';
      },
      complete: () => console.log('slika je ucitana')
    });

  }

  clickPromeniIme() {
    this.disableDugmad();
    this.funkcije.disableDugme('submitIme');
    this.imeforma = true;
  }

  unetoIme() {
    var ime = String(this.imeForm.controls.ime.value);
    if (ime != this.korisnik.ime && ime != '')
      this.funkcije.enableDugme('submitIme');
    else
      this.funkcije.disableDugme('submitIme');
  }

  promeniIme() {
    var ime = String(this.imeForm.controls.ime.value);
    this.kServis.promeniIme(ime).subscribe({
      next: async (odg: any) => {
        this.korisnik = odg;
        this.prijavljen();
        this.poruka = '';
        this.funkcije.disableDugme('submitIme');
        this.enableDugmad();
        await this.funkcije.sacekaj(1);
        this.clickX();
      },
      error: (e) => this.poruka = e.error,
      complete: () => console.log('Korisnik je promenio ime.')
    });
  }



  prikazi: boolean = false;
  natpis = '👀 Prikaži šifru.'

  prikaziSifru() {
    this.prikazi = !this.prikazi;

    if (this.prikazi == false)
      this.natpis = '👀 Prikaži šifru.';
    else
      this.natpis = '🙈 Sakrij šifru.';
  }

  clickPromeniSifru() {
    this.disableDugmad();
    this.funkcije.disableDugme('submitSifra');
    this.sifraforma = true;
  }

  proveriSifru() {
    var sifra = String(this.sifraForm.controls.sifra.value);
    var potvrda = String(this.sifraForm.controls.potvrda.value);

    if (this.sifraForm.valid && sifra.trim().length > 7 && sifra == potvrda)
      this.funkcije.enableDugme('submitSifra');
    else
      this.funkcije.disableDugme('submitSifra');

  }

  promeniSifru() {
    var sifra = String(this.sifraForm.controls.sifra.value);
    this.kServis.promeniSifru(sifra).subscribe({
      next: async (odg: any) => {
        this.korisnik = odg;
        this.poruka = 'Šifra je uspešno promenjena.';
        this.funkcije.disableDugme('submitSifra');
        this.enableDugmad();
        await this.funkcije.sacekaj(1);
        this.clickX();
      },
      error: (e) => this.poruka = e.error,
      complete: () => console.log('Korisnik je promenio šifru.')
    });
  }


  clickPromeniDr() {
    this.disableDugmad();
    this.funkcije.disableDugme('submitDr');
    this.drforma = true;
  }

  g = 0;
  m = 0;
  d = 0;


  clickGodina() {
    const dr = new Date(this.korisnik.datumRodjenja).getFullYear();
    this.g = Number(this.drForm.controls.godina.value);

    if (this.g != dr)
      this.funkcije.enableDugme('submitDr');
    else
      this.funkcije.disableDugme('submitDr');
  }

  clickMesec() {
    const dr = new Date(this.korisnik.datumRodjenja).getMonth() + 1;
    this.brDana();
    this.m = Number(this.drForm.controls.mesec.value);

    if (this.m != dr)
      this.funkcije.enableDugme('submitDr');
    else
      this.funkcije.disableDugme('submitDr');
  }

  clickDan() {
    const dr = new Date(this.korisnik.datumRodjenja).getDate();
    this.d = Number(this.drForm.controls.dan.value);

    if (this.d != dr)
      this.funkcije.enableDugme('submitDr');
    else
      this.funkcije.disableDugme('submitDr');
  }

  promeniDR() {
    const dr = new Date(this.korisnik.datumRodjenja);

    if (this.g == 0)
      this.g = dr.getFullYear();

    if (this.m == 0)
      this.m = dr.getMonth() + 1;

    if (this.d == 0)
      this.d = dr.getDate();

    this.kServis.promeniDatumRodjenja(this.g, this.m, this.d).subscribe({
      next: async (odg: string) => {
        this.poruka = odg;
        this.funkcije.disableDugme('submitDr');
        this.enableDugmad();
        await this.funkcije.sacekaj(1);
        this.clickX();
      },
      error: (e) => this.poruka = e.error,
      complete: () => console.log('Korisnik je promenio datum rođenja.')
    });
  }




  putanja = this.korisnik.slika;
  clickPromeniSliku() {
    this.disableDugmad();
    this.funkcije.disableDugme('submitSlika');
    this.slikaforma = true;
  }


  unetaSlika() {
    if (this.slikaForm.controls.slika.valid)
      this.funkcije.enableDugme('submitSlika');
    else
      this.funkcije.disableDugme('submitSlika');
  }


  promeniSliku() {
    var slika = String(this.slikaForm.controls.slika.value);
    slika = slika.slice(12, slika.length);
    this.kServis.promeniSliku(slika).subscribe({
      next: async (odg: Korisnik) => {
        this.korisnik = odg;
        this.putanja = '../assets/' + odg.slika;
        this.funkcije.disableDugme('submitSlika');
        this.enableDugmad();
        this.poruka = 'Sačekaj malo. ⏳';
        await this.funkcije.sacekaj(1);
        this.clickX();
        window.location.reload();
      },
      error: (e) => console.log(e.error),
      complete: () => console.log('Korisnik je promenio sliku.')
    });
  }



  clickObrisiNalog() {
    this.disableDugmad();
    this.brisanjeforma = true;
  }

  obrisiNalog() {
    this.kServis.obrisiNalog().subscribe({
      next: async (odg: string) => {
        this.poruka = odg;
        await this.funkcije.sacekaj(2);
        this.router.navigate(['./pocetna']);
      },
      error: (e) => this.poruka = e.error,
      complete: () => console.log('gotovo brisanje')
    });
  }


  clickX() {
    this.imeforma = false;
    this.drforma = false;
    this.sifraforma = false;
    this.slikaforma = false;
    this.brisanjeforma = false;
    this.enableDugmad();
  }

  godine() {
    var g: number[] = new Array;
    for (var i = 2010; i > 1950; i--)
      g.push(i);

    return g;
  }

  dani = new Array<number>;

  brDana() {
    var mesec = Number(this.drForm.get('mesec')?.value);
    this.kServis.ponudiBrDana(mesec).subscribe({
      next: (odg: Number) => {
        for (let i = 1; i <= odg; i++)
          this.dani.push(i);
      },
      error: (e) => this.poruka = e.error,
      complete: () => console.log('dani: ')
    });
  }








}