import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { __values } from 'tslib';
import { Router } from '@angular/router';

import { PomocneFunkcije } from '../services/pomocne.funkcije';
import { Objava } from '../model/objava';
import { ObjavaServis } from '../services/objava.servis';
import { Ocena } from '../model/ocena';
import { KorisnikServis } from '../services/korisnik.servis';
import { Korisnik } from '../model/korisnik';
import { JeloServis } from '../services/jelo.servis';
import { TreningServis } from '../services/trening.servis';
import { ObrokServis } from '../services/obrok.servis';
import { Trening } from '../model/trening';
import { Jelo } from '../model/jelo';
import { Obrok } from '../model/obrok';
  
@Component({
  selector: 'objava',
  templateUrl: './objava.html',
  styleUrls: ['./objava.css']
})

export class ObjavaComponent implements OnInit {

  constructor(private fb: FormBuilder,
    public funkcije: PomocneFunkcije,
    private router: Router,
    private oServis: ObjavaServis,
    private kServis: KorisnikServis,
    private jServis: JeloServis,
    private tServis: TreningServis,
    private obServis: ObrokServis) { }


  ngOnInit() {
    this.disableDugmad();
    this.ucitajSveObjave()
  }

  objava = new Objava();
  objave = new Array<Objava>();
  sveObjave = new Array<Objava>();
  komentari = new Array<Objava>();
  komentar = new Objava();
  ocene = new Array<Ocena>();
  ocena = new Ocena();
  poruka = '';
  autor = new Korisnik();
  autori = new Array<Korisnik>();
  autoriKomentara = new Array<Korisnik>();
  autoriOcena = new Array<Korisnik>();
  datum = '';
  slika = '';
  prikazobjave = false;
  mojaobjava = false;
  prikazkomentara = false;
  prikazocena = false;
  ocenjivanje = false;
  brKomentara = 0;
  pocetnaObjava = 0;
  upis = false;
  prosek = 0;
  pomeraj = 0;
  klizPomeraj = 0;

  objavaForm = this.fb.group({
    slika: ['', Validators.required]
  })

  komentarForm = this.fb.group({
    unos: ['', Validators.required]
  })

  ocenaForm = this.fb.group({
    vrednost: [0, Validators.required]
  })


  titlZaOcenu = '';


  disableDugmad() {
    this.funkcije.disableDugmad(['btPromeni',
      'btSacuvaj', 'btUkloni', 'btCrno', 'btObojeno', 'btKomentari',
      'btKomentarisi', 'btIzmeni', 'btObrisi', 'sGore']);

      var dugme = <HTMLButtonElement>document.getElementById('btObojeno');
      dugme.style.width = "0px";
  }


  async prosecnaOcena(oID: Number) {
    var dugme = <HTMLButtonElement>document.getElementById('btObojeno');

    this.oServis.prosek(oID).subscribe({
      next: (br: Number) => {
        this.prosek = Number(br);
        dugme.style.width = this.prosek * 19 + "px";  
      },
      error: (e) => this.poruka = e.error,
      complete: () => console.log('izracunat prosek', this.prosek)
    });

  }


  ucitajObjavu(objavaID: Number) {         
    this.oServis.objavaPoIDu(objavaID).subscribe({
      next: async (o: Objava) => {
        this.objava = o;
        this.imeAutora(o.autorID);
        await this.prosecnaOcena(o.id);
        await this.ucitajKomentare();
        this.slika = '../assets/slike-objava/' + this.objava.slika;
        this.titlZaOcenu = 'Pogledaj kako su pratioci ocenili ovu objavu.';
        this.funkcije.enableDugmad(['btObojeno', 'btCrno', 'btKomentari', 'btPromeni', 'btObjavi']);
        this.mojaObjava(o.id);
        this.prikazobjave = true;
      },
      error: (e) => this.objavaPracenogKorisnika(objavaID),
      complete: () => console.log('objava ucitana')
    });

  }


  objavaPracenogKorisnika(oID: Number) {
    this.oServis.objavaPracenog(oID).subscribe({
      next: async (o: Objava) => {
        this.objava = o;
        this.imeAutora(o.autorID);
        await this.prosecnaOcena(o.id);
        await this.ucitajKomentare();
        this.titlZaOcenu = 'Oceni ovu objavu.';
        this.slika = '../assets/slike-objava/' + this.objava.slika;
        this.funkcije.enableDugmad(['btObojeno', 'btCrno', 'btKomentari']);
        this.prikazobjave = true;
      },
      error: (e) => this.poruka = e.error,
      complete: () => console.log('objava pracenog korisnika ucitana')
    });
  }

  ucitajMojeObjave() {
    this.oServis.objave().subscribe({
      next: (o: Objava[]) =>{ 
        this.objave = o;
        this.pracen = false;
        this.pomeraj = 0;
        this.klizPomeraj = 0;
      },
      error: (e) => {
        this.poruka = e.error;
        this.objave = [];
      },
      complete: () => console.log('ucitane objave')
    });
  }

  async ucitajSveObjave() {
    this.oServis.vidljiveObjave().subscribe({
      next: async (o: Objava[]) => {
        if (o.length > 0) {
          this.ucitajAutore();
          await this.funkcije.sacekaj(1);
          this.objave = o;
          await this.funkcije.sacekaj(1);
          this.pracen = false;
          this.pomeraj = 0;
          this.klizPomeraj = 0;
          this.autor = new Korisnik();
        }
        else this.objave = [];

      },
      error: (e) => this.objave = [],
      complete: () => console.log('ucitane sve objave')
    });

  }


  samoMoje() {
    var sve =  <HTMLInputElement>document.getElementById('checkboxSve');  

    if (Boolean(sve.checked)) {
      this.ucitajMojeObjave();
      this.autori = [];
      for (let i = 0; i < this.objave.length; i++)
        this.autori.push(new Korisnik());
    }
    else this.ucitajSveObjave();

  }


  pracen = false;
  public objavePracenog(autorID: Number) {
   var sve =  <HTMLInputElement>document.getElementById('checkboxSve');  
   sve.setAttribute("value", "false");
    this.oServis.objavePracenog(autorID).subscribe({
      next: (o: Objava[]) => {
        this.objave = o;
        this.imeAutora(autorID);
        this.pracen = true;
        this.pomeraj = 0;
        this.klizPomeraj = 0;
       },
      error: (e) => {
        console.log(e.error);
        this.objave = [];
      },
      complete: () => console.log('ucitane objave pracenog korisnika')
    });
  }


  async ucitajAutore() {
    this.oServis.autori().subscribe({
      next: async (a: Korisnik[]) => {
        if (a.length > 0)
          this.autori = a;
        else
          this.autori = [];

        await this.funkcije.sacekaj(0.5);
      },
      error: (e) => this.poruka = e.error,
      complete: () => console.log('autori ucitani')
    });
  }

  async ucitajKomentare() {
    this.oServis.komentari(this.objava.id).subscribe({
      next: async (o: Objava[]) => {
        await this.ucitajAutoreKomentara();
        await this.funkcije.sacekaj(1);
        this.komentari = o;
        this.brKomentara = o.length;
      },
      error: (e) => {
        console.log(e.error);
        this.komentari = [];
        this.brKomentara = 0;
      },
      complete: () => console.log('ucitani komentari')
    });
  }

  async ucitajAutoreKomentara() {
    this.oServis.autoriKomentara(this.objava.id).subscribe({
      next: (k: Korisnik[]) => {
        if (k.length > 0)
          this.autoriKomentara = k;
        else this.autoriKomentara = [];
      },
      error: (e) => console.log(e.error),
      complete: () => console.log('ucitani autori komentara')
    });
  }

  ucitajOcene() {
    this.oServis.ocene(this.objava.id).subscribe({
      next: (o: Ocena[]) => {
        this.ucitajAutoreOcena();
        this.ocene = o;
      },
      error: (e) => this.ocene = [],
      complete: () => console.log('ucitane ocene')
    });
  }

  ucitajAutoreOcena() {
    this.oServis.autoriOcena(this.objava.id).subscribe({
      next: (k: Korisnik[]) => this.autoriOcena = k,
      error: (e) => this.poruka = e.error,
      complete: () => console.log('ucitani autori ocena')
    });
  }

  ocenaNaObjavu() {
    var povlacenje = <HTMLInputElement>document.getElementById('o6');

    this.oServis.ocenaNaObjavu(this.objava.id).subscribe({
      next: (o: Ocena) => {
        this.ocenaForm.controls.vrednost.setValue(Number(o.vrednost));
        povlacenje.disabled = false;
      },
      error: (e) => {
        this.poruka = e.error;
        this.ocenaForm.reset();
        povlacenje.disabled = true;
      },
      complete: () => console.log('ucitane ocene')
    });

    this.ocenaForm.enable();
    this.ocenjivanje = true;
  }


  pretraziObjave() {
    var unos = '';
    this.oServis.objavePoTekstu(unos).subscribe({
      next: (o: Objava[]) => this.sveObjave = o,
      error: (e) => this.poruka = e.error,
      complete: () => console.log('pronadjena objava')
    });
  }


  imeAutora(autorID: Number) {
    this.kServis.korisnikPoIDu(autorID).subscribe({
      next: (korisnik: Korisnik) => this.autor = korisnik,
      error: (e) => this.poruka = e.error,
      complete: () => console.log('ime autora')
    });
  }

  slicica(o: Objava): string {
    if (o.slika != '')
      return '../assets/slike-objava/' + o.slika;
    else return '';
  }


  mojaObjava(objavaID: Number) {
    this.oServis.autorPrijavljen(objavaID).subscribe({
      next: (odg: Boolean) => {
        if (odg) {
          this.mojaobjava = Boolean(odg);
          this.funkcije.enableDugmad(['btPromeni', 'btUkloni']);
          this.funkcije.disableDugme('btObjavi');
        }
        else this.disableDugmad();
      },
      error: (e) => this.poruka = e.error,
      complete: () => console.log('prijavljen korisnik je autor objave : ' + this.mojaobjava)
    });
  }


 
  ucitajUnos() : string{
    var unetTekst = '';
    var textarea = <HTMLInputElement>document.getElementById('txtUnos');
    if (textarea != null)
          unetTekst = textarea.value.trim();
    
    return this.funkcije.promeniUnetTekst(unetTekst);
  }


  upisiUnos(unos: string) {
    var textarea = <HTMLInputElement>document.getElementById('txtUnos');
    textarea.value = unos;
  }


  objaviSamoTekst() {
    this.oServis.objaviTekst(this.ucitajUnos()).subscribe({
      next: async (o: Objava) => {
        this.objava = o;
      //  this.funkcije.disableDugme('btObjavi');
        await this.funkcije.sacekaj(1);
        await this.objavaX();
       
      },
      error: (e) => this.poruka = e.error,
      complete: () => console.log('objavljeno')
    });
  }

  objaviTekstSaSlikom() {
    var slika = String(this.objavaForm.controls.slika.value);
    slika = slika.slice(12, slika.length);
    var unos = this.ucitajUnos();
    if(unos == '')
      unos = '**';
    this.oServis.objaviSaSlikom(unos, slika).subscribe({
      next: async (o: Objava) => {
        this.objava = o;
      //  this.funkcije.disableDugme('btObjavi');
        await this.funkcije.sacekaj(1);
        await this.objavaX();
      },
      error: (e) => this.poruka = e.error,
      complete: () => console.log('objavljeno')
    });
  }

  komentarisi() {
    var unos = String(this.komentarForm.controls.unos.value);
    unos = this.funkcije.promeniUnetTekst(unos);
    this.oServis.komentarisiObjavu(this.objava.id, unos).subscribe({
      next: (o: Objava) => {
        this.objava = o;
        this.komentarForm.reset();
        this.ucitajOcene();
        this.ucitajKomentare();
      },
      error: (e) => this.poruka = e.error,
      complete: () => console.log('komenarisao prijatelju')
    });
  }

  komentarisiSvojuObjavu() {
    var unos = String(this.komentarForm.controls.unos.value);
    unos = this.funkcije.promeniUnetTekst(unos);

    this.oServis.komentarisiSvojuObjavu(this.objava.id, unos).subscribe({
      next: (o: Objava) => {
        this.objava = o;
        this.ucitajOcene();
        this.ucitajKomentare();
        this.komentarForm.reset();
      },
      error: (e) => this.poruka = e.error,
      complete: () => console.log('komenarisao sebi')
    });
  }


  oceni() {
    var br = Number(this.ocenaForm.controls.vrednost.value);
    this.oServis.oceni(this.objava.id, br).subscribe({
      next: (o: Objava) => {
        this.ucitajObjavu(o.id);
        this.ocenjivanje = false;
        this.ocenaForm.reset();
      },
      error: (e) => this.poruka = e.error,
      complete: () => console.log('ocenjeno')
    });
  }


  prepraviObjavu() {
    this.oServis.prepraviObjavu(this.objava.id, this.ucitajUnos()).subscribe({
      next: (o: Objava) => {
          this.objava = o;
          this.ucitajObjavu(o.id);
          this.objavaForm.reset();
          this.upisiUnos('');
          this.funkcije.disableDugmad(['btIzmeni', 'btObrisi', 'btSacuvaj']);       
      },
      error: (e) => this.poruka = e.error,
      complete: () => console.log('prepravljena objava')
    });
  }


  prepraviKomentar() {
    var unos  = String(this.komentarForm.controls.unos.value);
    unos =  this.funkcije.promeniUnetTekst(unos);

    console.log('uneto: ' + unos);
    this.oServis.prepraviObjavu(this.komentar.id, unos).subscribe({
      next: async  (o: Objava) => {
          this.komentar = o;
          console.log('prepravljeno: ' + o.tekst);
          this.funkcije.disableDugmad(['btIzmeni', 'btObrisi', 'btKomentarisi']);
          await this.funkcije.sacekaj(1);
          this.ucitajObjavu(this.objava.id);
          await this.funkcije.sacekaj(1);
          await this.ucitajKomentare();
          this.komentar = new Objava();
          this.komentarForm.reset();      
      },
      error: (e) => this.poruka = e.error,
      complete: () => console.log('prepravljen komentar')
    });
  }


  povuciOcenu() {
    this.oServis.povuciOcenu(this.objava.id).subscribe({
      next: (o: Objava) => {
        this.poruka = "Ocena je povučena.",
          this.ucitajObjavu(o.id);
        this.ocenjivanje = false;
        this.ocenaForm.reset();
      },
      error: (e) => this.poruka = e.error,
      complete: () => console.log('uklonjena ocena')
    });
  }


  obrisiObjavu() {
    this.oServis.obrisiObjavu(this.objava.id).subscribe({
      next: (o: string) => {
        this.mojaobjava = false;
        this.objavaForm.reset();
        this.objava = new Objava();
        this.prikazobjave = false;

        this.funkcije.disableDugmad(['btObrisi', 'btIzmeni']);
        this.funkcije.enableDugme('btObjavi');
      },
      error: (e) => this.poruka = e.error,
      complete: async () => {
        await this.ucitajAutore();
        await this.funkcije.sacekaj(0.5);
        await this.ucitajSveObjave();
        console.log('uklonjena objava');
      }
    });
  }


  obrisiKomentar() {
    this.oServis.obrisiKomentar(this.komentar.id).subscribe({
      next: (k: Objava[]) => {
        this.komentari = k;
        this.funkcije.disableDugmad(['btObrisi', 'btIzmeni']);
        this.funkcije.enableDugme('btKomentarisi');
        this.komentarForm.reset();
        this.ucitajObjavu(this.objava.id);
      },
      error: (e) => this.poruka = e.error,
      complete: () => console.log('obrisan komentar')
    });
  }

  obrisiObjave() {
    this.oServis.obrisiObjave().subscribe({
      next: async (odg: string) => {
        this.poruka = odg;
        await this.ucitajSveObjave();
      },
      error: (e) => this.poruka = e.error,
      complete: () => console.log('uklonjene objave')
    });
  }



  unos() {
    var unetaSlika = String(this.objavaForm.controls.slika.value);
    if (this.ucitajUnos() != '' || unetaSlika != '' ) {
  /*    if (this.objava.id == 0){
        this.funkcije.disableDugme('btObjavi');

      }
      else*/ if(this.ucitajUnos() == this.objava.tekst)
          this.funkcije.disableDugme('btSacuvaj');
      else this.funkcije.enableDugme('btSacuvaj');
    }
    else
      this.disableDugmad();
  }

  objavi() {
    if(this.objava.id != 0)
        this.prepraviObjavu();
    else{
      if (this.objavaForm.controls.slika.valid)
      this.objaviTekstSaSlikom();
    else this.objaviSamoTekst();
    }

    this.upis = false;
    this.objavaForm.reset();
  }

  clickPrepravi() {
    this.upisiUnos(this.objava.tekst);
    this.funkcije.disableDugme('btPromeni');
    this.upis = true;
    this.prikazobjave = false;
  }

  async objavaX() {
    this.komentariX();
    this.upisiUnos('');
    this.mojaobjava = false;
    this.objavaForm.reset();
    this.objava = new Objava();
    await this.ucitajSveObjave();

    this.prikazobjave = false;
    this.funkcije.enableDugme('btObjavi');
  }



  clickKomentari() {
    if (!this.prikazkomentara) {
      this.ucitajAutoreKomentara();
      this.ucitajKomentare();
    }
    else {
      this.komentari = [];
      this.ucitajAutore();
    }

    this.prikazkomentara = true;
  }

  komentariX() {
    this.prikazkomentara = false;
    this.komentarForm.reset();
    this.funkcije.disableDugmad(['btIzmeni', 'btObrisi', 'btKomentarisi']);
    this.komentar = new Objava();
  }


  unosKomentara() {
    var unos = String(this.komentarForm.controls.unos.value);  
    unos = this.funkcije.promeniUnetTekst(unos);

    if (unos.trim() != '') {
      if (this.komentar.id == 0)
        this.funkcije.enableDugme('btKomentarisi');
      else if(unos.trim() == this.komentar.tekst) 
        this.funkcije.disableDugme('btIzmeni');
      else   this.funkcije.enableDugme('btIzmeni');
    }
    else 
      this.funkcije.disableDugmad(['btIzmeni', 'btKomentarisi']);
  }

  ostaviKomentar() {
    if (this.mojaobjava)
      this.komentarisiSvojuObjavu();
    else
      this.komentarisi();

    this.funkcije.disableDugme('btKomentarisi');
  }




  ucitajKomentar(objavaID: Number, i: Number) {
    if(objavaID == this.komentar.id){
       this.komentar = new Objava();
       this.funkcije.ukloniOkvir(i);
       this.komentarForm.controls.unos.setValue('');
      this.funkcije.disableDugmad(['btObrisi', 'btIzmeni', 'btKomentarisi']);
    }
    else{
      this.oServis.mojKomentar(objavaID).subscribe({
        next: (o: Objava) => {
          this.komentar = o;
          this.funkcije.enableDugmad(['btObrisi']);
          this.funkcije.disableDugme('btKomentarisi');
          this.komentarForm.controls.unos.setValue(o.tekst);
          this.funkcije.ukloniOkvire(i, 'liKomentar');
          this.funkcije.uokviri(i);
        },
        error: (e) => {
          this.poruka = e.error;
          this.ucitajKomentarPratioca(objavaID);
        },
        complete: () => console.log('objava ucitana')
      });
    }


  }


  ucitajKomentarPratioca(objavaID: Number) {
    this.oServis.komentarPratioca(objavaID).subscribe({
      next: (o: Objava) => {
        this.komentar = o;
        if (this.mojaobjava)
          this.funkcije.enableDugme('btObrisi');
      },
      error: (e) => this.poruka = e.error,
      complete: () => console.log('objava ucitana')
    });
  }



  clickOcene() {
    if (!this.prikazocena && !this.ocenjivanje) {
      if (this.mojaobjava) {
        this.ucitajOcene();
        this.prikazocena = true;
      }
      else this.ocenaNaObjavu();
    }
    else if (this.prikazocena && !this.ocenjivanje) {
      this.prikazocena = false;
      this.ocene = [];
      this.ucitajAutore();
    }

  }


  upisiOcenu() {
    var uneta = Number(this.ocenaForm.controls.vrednost.value);
    console.log('UNETA OCENA: ' + uneta);
    if (uneta == 6)
      this.povuciOcenu();
    else this.oceni();

  }



  treninzi = new Array<Trening>();
  ucitajTreninge() {
    this.tServis.treninzi().subscribe({
      next: (t: Trening[]) => this.treninzi = t
    });
  }


  objaviTrening(tID: Number) {

    this.tServis.objaviTrening(tID).subscribe({
      next: async (o: Objava) => {
        this.objava = o;
        this.treninzi = [];
        await this.ucitajSveObjave();
      },
      error: (e) => this.poruka = e.error,
      complete: () => console.log('trening je objavljen')
    });
  }



  jela = new Array<Jelo>();
  ucitajJela() {
    this.jServis.jela().subscribe({
      next: (j: Jelo[]) => this.jela = j
    });
  }


  objaviJelo(jID: Number) {

    this.jServis.objaviJelo(jID).subscribe({
      next: async (j: Objava) => {
        this.objava = j;
        this.jela = [];
        await this.ucitajSveObjave();
      },
      error: (e) => this.poruka = e.error,
      complete: () => console.log('jelo je objavljeno')
    });
  }


  obroci = new Array<Obrok>();
  ucitajObroke() {
    this.obServis.obroci().subscribe({
      next: (o: Obrok[]) => this.obroci = o
    });

  }

  objaviObrok(oID: Number) {
    this.obServis.objaviObrok(oID).subscribe({
      next: async (o: Objava) => {
        this.objava = o;
        this.obroci = [];
        await this.ucitajSveObjave();
      },
      error: (e) => this.poruka = e.error,
      complete: () => console.log('obrok je objavljen')
    });
  }

 


  pomeriDole(){
    var ulObjave= <HTMLUListElement>document.getElementById('ulObjave');
    ulObjave.scrollTop = ulObjave.scrollTop + 150;
    this.pomeraj++;
    this.funkcije.enableDugme('sGore');
    this.proveri();
  }

  pomeriGore(){
    var ulObjave= <HTMLUListElement>document.getElementById('ulObjave');
    ulObjave.scrollTop = ulObjave.scrollTop - 150;
    this.pomeraj--;
    this.proveri();
  }



  pomeri(){
    var ulObjave= <HTMLUListElement>document.getElementById('ulObjave');
    ulObjave.addEventListener('wheel', (event) => {
    var moguce = this.objave.length * 140 - 500;  
      this.klizPomeraj = this.klizPomeraj + event.deltaY;
      console.log(' pomeraj: ' + this.klizPomeraj);

      if(event.deltaY > 0){
        this.funkcije.enableDugme('sGore');
        if(this.klizPomeraj > moguce){
            this.funkcije.disableDugme('sDole');

          }
        else this.funkcije.enableDugme('sDole');
      }
      else{
        this.funkcije.enableDugme('sDole');
        if(this.klizPomeraj < -moguce)
          this.funkcije.disableDugme('sGore');
        else this.funkcije.enableDugme('sGore');
      }
      
    });
  }

  proveri(){   
    if(this.pomeraj < 1)
      this.funkcije.disableDugme('sGore');
    else this.funkcije.enableDugme('sGore');

    if(this.pomeraj > this.objave.length - 4)
      this.funkcije.disableDugme('sDole');
    else this.funkcije.enableDugme('sDole');
  }


}
