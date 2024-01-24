import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { __values } from 'tslib';
import { Router } from '@angular/router';
import { PomocneFunkcije } from '../services/pomocne.funkcije';
import { ObrokServis } from '../services/obrok.servis';
import { Obrok } from '../model/obrok';
import { JeloServis } from '../services/jelo.servis';
import { Jelo } from '../model/jelo';
import { Objava } from '../model/objava';

@Component({
  selector: 'obrok',
  templateUrl: './obrok.html',
  styleUrls: ['./obrok.css']
})

export class ObrokComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private funkcije: PomocneFunkcije,
    private router: Router,
    private oServis: ObrokServis,
    private jServis: JeloServis) { }


  ngOnInit() {
    this.disableDugmad();
    this.ucitajObroke();
    this.ucitajJela();
  }


  traziObrokForm = this.fb.group({
    unos: ['', [Validators.required]]
  })

  obrokForm = this.fb.group({
    masa: [{ value: 0, disabled: true }, Validators.required],
    izabranoJelo: [0, [Validators.required]],
    jelo: [0, [Validators.required]],
    noviNaziv: ['', [Validators.required]]
  })

  obrociForm = this.fb.group({
    naziv: ['', [Validators.required]],
    izabranObrok: [0, [Validators.required]]
  });


  obrok = new Obrok();
  obroci = new Array<Obrok>();
  jela = new Array<Jelo>();
  jelo = new Jelo();
  jeloO = new Jelo();
  jelaObroka = new Array<Jelo>();
  maseJela = new Array<Number>();
  evJela = new Array<Number>();
  poruka = '';
  upisnaziva = false;
  brObroka = 0;
  promena = false;
  prikazJela = false;
  unosMase = false;

  clickNaNovoJelo() {
    this.router.navigate(['./jelo']);
  }

  clickNazad() {
    this.router.navigate(['./korisnicki-prikaz']);
  }

  ucitajObroke() {
    this.oServis.obroci().subscribe({
      next: (o: Obrok[]) => {
        this.obroci = o;
        if(o.length > 17)
        this.brObroka = 17;
      else this.brObroka = o.length;
      },
      error: (e) => this.obroci = [],
      complete: () => console.log('obroci ucitani')
    });
  }


  odjaviSe() {
    localStorage.removeItem('authToken');
    this.router.navigate(['./pocetna']);
  }

  disableDugmad() {
    var dugmad = ['btTrazi', 'btPm', 'btIzbaci', 'btUbaci', 'btDetaljiJ',
    'btPreimenuj', 'btObrisi', 'btObrok', 'btNn', 'ubaciJ', 'prikaziJ', 'btSacuvajM'];
    this.funkcije.disableDugmad(dugmad);
  }


  resetPretraga() {
    this.traziObrokForm.reset();
    this.funkcije.disableDugme('btTrazi');
    this.ucitajObroke();
  }

  popunjeno() {
    var unos = '';
    if (this.traziObrokForm.controls.unos.valid)
      unos = String(this.traziObrokForm.controls.unos.value);

    if (unos == '' || unos == ' ') {
      this.funkcije.disableDugme('btTrazi');
      this.ucitajObroke();
    }
    else
      this.funkcije.enableDugme('btTrazi');
  }


  pretraziObroke() {
    var unos = String(this.traziObrokForm.controls.unos.value);
    this.oServis.obrociPoNazivu(unos).subscribe({
      next: (o: Obrok[]) => this.obroci = o,
      error: (e) => this.poruka = e.error,
      complete: () => console.log('obroci ucitani')
    });
  }


  ucitajJela() {
    this.jServis.jela().subscribe({
      next: (j: Jelo[]) => this.jela = j,
      error: (e) => console.log(e.error), 
      complete: () => console.log('jela su ucitana')
    });
  }


  ucitajJelaObroka() {
    this.oServis.jelaObroka(this.obrok.id).subscribe({
      next: (j: Jelo[]) => this.jelaObroka = j,
      error: (e) => console.log(e.error),
      complete: () => console.log('jela obroka su ucitana')
    });
  }

  ucitajMaseJela() {
    this.oServis.maseJela(this.obrok.id).subscribe({
      next: (mase: Number[]) => this.maseJela = mase,
      error: (e) => this.poruka = e.error,
      complete: () => console.log('mase jela ucitane')
    });
  }

  ucitajEvJela() {
    this.oServis.evJela(this.obrok.id).subscribe({
      next: (vrednosti: Number[]) => this.evJela = vrednosti,
      error: (e) => this.poruka = e.error,
      complete: () => console.log('energetske vrednosti jela ucitane')
    });
  }

  unetNazivObroka() {
    var jn = String(this.obrociForm.controls.naziv.value);

    if (jn != '' || jn.trimEnd() != '') 
      this.funkcije.enableDugme('btObrok');  
    else this.funkcije.disableDugme('btObrok');
  }

  clickPreimenuj(){
    this.funkcije.disableDugmad(['btPreimenuj', 'btNn']);
    this.obrokForm.controls.noviNaziv.setValue(this.obrok.naziv);
    this.promena = true;
  }
  
  unetNoviNazivObroka(){
    var n = String(this.obrokForm.controls.noviNaziv.value);
    if(this.obrok.id != 0 && n != '' && n != this.obrok.naziv)
      this.funkcije.enableDugme('btNn');
    else this.funkcije.disableDugme('btNn');
  }

  preimenujX(){
    this.funkcije.enableDugme('btPreimenuj');
    this.funkcije.disableDugme('btNn');
    this.promena = false;
  }

  clickObrok() {
    var oID = Number(this.obrociForm.controls.izabranObrok.value);
    this.oServis.obrokPoIDu(oID).subscribe({
      next: (o: Obrok) => {
        this.obrok = o;
        this.ucitajJelaObroka();
        this.ucitajEvJela();
        this.ucitajMaseJela();
        this.obrokForm.controls.izabranoJelo.enable();
        this.funkcije.enableDugmad(['btPreimenuj', 'btObrisi', 'btObjaviObrok']);
      },
      error: (e) => this.poruka = e.error,
      complete: () => console.log('obrok ucitan')
    });
  }


  upisMase() {
    var masa = Number(this.obrokForm.controls.masa.value);
    if(this.jelo.id != 0){
      this.jServis.skalirajJelo(this.jelo.id , masa).subscribe({
        next: (j: Jelo) => {
          this.jelo = j;
          this.funkcije.enableDugme('btUbaci');
        }, 
        error: (e) => this.poruka = e,
        complete: () => console.log('jelo skalirano')
      });
    }
    else{
      this.jServis.skalirajJelo(this.jeloO.id, masa).subscribe({
        next: (j: Jelo) => {
          this.jeloO = j;
          this.funkcije.enableDugme('btSacuvajM');
        },
        error: (e) => this.poruka = e,
        complete: () => console.log('jeloO skalirano')
      });
    }
  }


  clickDodajJeloObroku() {
    var masa = Number(this.obrokForm.controls.masa.value);
    var jeloID = Number(this.obrokForm.controls.izabranoJelo.value);
    this.oServis.dodajJeloObroku(this.obrok.id, jeloID, masa).subscribe({
      next: (o: Obrok) => {
        this.obrok = o;
        this.jeloX();
      },
      error: (e) => this.poruka = e.error,
      complete: () => console.log('dodato jelo obroku')
    });

  }

  obrokSadrziJelo(j: Jelo): Boolean {
    var ret = false;
    for (let i = 0; i < this.jelaObroka.length; i++)
      if (this.jelaObroka[i].id == j.id)
        ret = true;

    return ret;
  }

  clickJelo(){
    var id = Number(this.obrokForm.controls.izabranoJelo.value);
    this.jServis.jeloPoIDu(id).subscribe({
      next: (j: Jelo) => {       
        this.jelo = j;
        this.jeloO = new Jelo();
        this.obrokForm.controls.masa.enable();
        this.obrokForm.controls.masa.setValue(Number(j.masa));
        if(this.obrok.id == 0)
          this.funkcije.enableDugme('prikaziJ');
        else{
          if(!this.obrokSadrziJelo(j)){
               this.funkcije.enableDugmad(['ubaciJ', 'btUbaci', 'prikaziJ']);
               this.funkcije.disableDugmad(['btPromena', 'btDetaljiJ', 'btPm', 'btIzbaci']);
          }   
          else this.clickJeloVecUbaceno();
        }
      },
      error: (e) => this.poruka = e.error,
      complete: () => console.log('jelo obroka ucitano')
    });
    
  }

  jeloX(){
    this.jelo = new Jelo;
    this.jeloO = new Jelo;
    this.funkcije.disableDugmad(['ubaciJ', 'btUbaci','prikaziJ', 'btDetaljiJ', 'btPm', 'btIzbaci' ]);
    this.unosMase = false;
    this.prikazJela = false;
    this.obrokForm.controls.masa.reset();
    this.obrokForm.controls.izabranoJelo.reset();
    this.obrokForm.controls.jelo.reset();
    this.ucitajJelaObroka();
    this.ucitajEvJela();
    this.ucitajMaseJela();
  }


  clickJO(){
    var sastojci = <HTMLSelectElement>document.getElementById('sSadrzaj');
    var dugmePrikazi = <HTMLButtonElement>document.getElementById('btDetaljiJ');
    var dugmePV = <HTMLButtonElement>document.getElementById('btPm');
    var dugmeI = <HTMLButtonElement>document.getElementById('btIzbaci');

    sastojci.addEventListener('click', (event) => {      
      var y =  this.funkcije.pozicija(event.clientY, 430, 660) + "px";  
      dugmePrikazi.style.top = y ;
      dugmePV.style.top = y ;
      dugmeI.style.top = y ;
    });

    this.clickJeloObroka();
  
  }


  clickJeloObroka() {
    var id = Number(this.obrokForm.controls.jelo.value);

    this.oServis.jeloObroka(this.obrok.id, id).subscribe({
      next: (j: Jelo) => {
        this.jeloO = j;
        this.obrokForm.controls.masa.enable();
        this.obrokForm.controls.masa.setValue(Number(j.masa));
        this.funkcije.enableDugmad(['btPm', 'btIzbaci', 'btDetaljiJ']);
      },
      error: (e) => this.poruka = e.error,
      complete: () => console.log('jelo obroka ucitano')
    });
  }


  clickJeloVecUbaceno(){
    var dugmePrikazi = <HTMLButtonElement>document.getElementById('btDetaljiJ');
    var dugmePV = <HTMLButtonElement>document.getElementById('btPm');
    var dugmeI = <HTMLButtonElement>document.getElementById('btIzbaci');
    this.funkcije.enableDugmad(['btDetaljiJ', 'btPm', 'btIzbaci', 'btSacuvajM']);
    this.funkcije.disableDugmad(['prikaziJ', 'ubaciJ', 'btUbaci' ]);
    
    var opcija = <HTMLOptionElement>document.getElementById(this.jelo.id.toString());
    opcija.selected = true;
    var y =  (opcija.offsetTop + 420) + "px";
    dugmePrikazi.style.top = y;
    dugmePV.style.top = y ;
    dugmeI.style.top = y; 
  
    this.obrokForm.controls.izabranoJelo.setValue(0);
    this.obrokForm.controls.jelo.setValue(Number(this.jelo.id));
    this.jelo = new Jelo();
    this.clickJeloObroka();  
  }


  dodajNoviObrok() {
    var naziv = String(this.obrociForm.controls.naziv.value);
    this.oServis.dodajObrok(naziv).subscribe({
      next: (o: Obrok) => {
        this.obrok = o;
        this.ucitajObroke();
        this.ucitajJelaObroka();
        this.ucitajEvJela();
        this.ucitajMaseJela();
        this.obrokForm.controls.izabranoJelo.enable();
        this.upisnaziva = false;
        this.obrociForm.controls.naziv.reset();
        this.funkcije.disableDugme('btObrok');
        this.obrociForm.controls.izabranObrok.setValue(Number(o.id));
        this.clickObrok();
      },
      error: (e) => this.poruka = e,
      complete: () => console.log('novi obrok dodat')
    });

  }

  preimenujObrok() {
    var naziv = String(this.obrokForm.controls.noviNaziv.value);
    this.oServis.promeniNazivObroka(this.obrok.id, naziv).subscribe({
      next: (o: Obrok) => {
        this.obrok = o;
        this.ucitajObroke();
        this.obrokForm.controls.izabranoJelo.enable();
        this.upisnaziva = false;
        this.obrociForm.controls.naziv.reset();
        this.preimenujX();
      },
      error: (e) => this.poruka = e,
      complete: () => console.log('obrok preimenovan')
    });
  }

  promeniMasuJela() {
    var masa = Number(this.obrokForm.controls.masa.value);
    var jelo = Number(this.obrokForm.controls.jelo.value);
    this.oServis.promeniMasuJela(this.obrok.id, jelo, masa).subscribe({
      next: (o: Obrok) => {
        this.obrok = o;
        this.jeloX();
      },
      error: (e) => this.poruka = e.error,
      complete: () => console.log('masa promenjena')
    });
  }



  izbaciJeloIzObroka() {
    this.oServis.obrisiJeloIzObroka(this.obrok.id, this.jeloO.id).subscribe({
      next: (o: Obrok) => {
        this.obrok = o;
        this.jeloX();
      },
      error: (e) => this.poruka = e.error,
      complete: () => console.log('jelo obrisano iz oborka')
    });
  }


  obrisiObrok() {
    this.oServis.obrisiObrok(this.obrok.id).subscribe({
      next: (odg: string) => {
        this.poruka = odg;
        this.ucitajObroke();
        this.obrok = new Obrok();
        this.obrociForm.controls.naziv.reset();
        this.disableDugmad();
      },
      error: (e) => this.poruka = e.error,
      complete: () => console.log('obrok je obrisan')
    });
  }



  obrokX() {
    this.upisnaziva = false;
    this.jeloX();
    this.obrok = new Obrok();
  }

  objaviObrok() {
    var objava = new Objava();
    this.oServis.objaviObrok(this.obrok.id).subscribe({
      next: (o: Objava) => {
        objava = o;
        this.poruka = this.obrok.naziv + ' je objavljen, možeš ga videti među svojim ostalim objavama.';
      },
      error: (e) => this.poruka = e.error,
      complete: () => console.log('obrok je objavljen')
    });
  }

}

