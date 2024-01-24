
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { __values } from 'tslib';
import { Router } from '@angular/router';
import { PomocneFunkcije } from '../services/pomocne.funkcije';
import { TreningServis } from '../services/trening.servis';
import { AktivnostServis } from '../services/aktivnost.servis';
import { Aktivnost } from '../model/aktivnost';
import { ZahtevAktivnosti } from '../model/zahtev.aktivnosti';
import { ZahtevAktivnostiServis } from '../services/z.aktivnosti.servis';
import { RezultatZahteva } from '../model/rezultat.zahteva';
import { Trening } from '../model/trening';
import { Objava } from '../model/objava';

@Component({
  selector: 'trening',
  templateUrl: './trening.html',
  styleUrls: ['./trening.css']
})

export class TreningComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private funkcije: PomocneFunkcije,
    private router: Router,
    private aServis: AktivnostServis,
    private tServis: TreningServis,
    private zServis: ZahtevAktivnostiServis) { }


  ngOnInit() {
    this.ucitajAktivnosti();
    this.ucitajTreninge();
    this.disableDugmad();
    this.aktivnost = new Aktivnost();
    this.zahtev = new ZahtevAktivnosti();
    this.trening = new Trening();
    this.ucitajZahteve();
  }

  poruka = '';
  potrosnjePriAktivnostima = new Array<Number>();
  potrosnjaE = '';
  greska = '';
  aktivnosti = new Array<Aktivnost>();
  aktivnost = new Aktivnost();
  aktivnostT = new Aktivnost();
  zahtevi = new Array<ZahtevAktivnosti>();
  zahtev = new ZahtevAktivnosti();
  trening = new Trening();
  treninzi = new Array<Trening>();
  vreme = 0;
  aktivnostiTreninga = new Array<Aktivnost>();
  vremenaAktivnosti = new Array<Number>();
  sati = new Array<number>;
  minuti = new Array<number>;

  zahtevforma = false;
  otvorizahteve = false;
 upisnaziva = false;
  daNeDugmad = false;
  otvoritrening = false;
  promena = false;
  brTreninga = 0;
  brAktivnosti = 0;

  klizPomerajT = 0;
  pomerajT = 0;

  klizPomerajA  = 0;
  pomerajA = 0;

  //putanja = '../assets/slike/juiju-walking.gif';
  //gif = false;


  clickNazad() {
    this.router.navigate(['./korisnicki-prikaz']);
  }


  ucitajAktivnosti() {
    this.aServis.aktivnosti().subscribe({
      next: (a: Aktivnost[]) =>{ 
        this.aktivnosti = a;
        this.funkcije.disableDugme('sGoreA')
        if(a.length > 17)
          this.funkcije.enableDugme('sDoleA');
        else this.funkcije.disableDugme('sDoleA');
        this.pomerajA = 0;
        this.klizPomerajA = 0;
      },
      error: (e) => this.poruka = e.error,
      complete: () => console.log('ucitane sve aktivnosti')
    });
  }

  traziAktivnostForm = this.fb.group({
    unos: ['', [Validators.required]]
  })

  zahtevForm = this.fb.group({
    naziv: ['', Validators.required],
    napomena: ['', Validators.required],
    prijava: [true, Validators.required]
  })

  poslatZahtevForm = this.fb.group({
    pZahtev: [0, Validators.required]
  })

  treningForm = this.fb.group({
    oznacenaAktivnost: [0, Validators.required],
    aktivnost: [0, Validators.required],
    sati: [{ value: 0, disabled: true }, [Validators.required]],
    minuti: [{ value: 0, disabled: true }, [Validators.required]],
    noviNaziv: ['', Validators.required]
  })

  treninziForm = this.fb.group({
    naziv: ['', Validators.required],
    izabranTrening: [0, Validators.required]
  })


  odjaviSe() {
    localStorage.removeItem('authToken');
    this.router.navigate(['./pocetna']);
  }

  disableDugmad() {
    var dugmad = ['btTrazi', 'btDa', 'btNe', 'btTrening', 'btPosalji',
      'btPv', 'btIzbaci', 'btPreimenuj', 'btObrisi', 'btAktivnost', 
      'btNn', 'ubaciA', 'prikaziA', 'btDetaljiA', 'btPromena'];
    this.funkcije.disableDugmad(dugmad);
  }



  resetPretraga() {
    this.traziAktivnostForm.reset();
    this.funkcije.disableDugme('btTrazi');
    this.ucitajAktivnosti();
  }


  treningSadrziAktivnost(a: Aktivnost): Boolean {
    var ret = false;
    for (let i = 0; i < this.aktivnostiTreninga.length; i++)
      if (this.aktivnostiTreninga[i].id == a.id)
        ret = true;

    return ret;
  }


  trajanjeAktivnosti(): Number {
    var trajanje = new Number();
    trajanje = 0;
    this.tServis.vremeAktivnosti(this.trening.id, this.aktivnost.id).subscribe({
      next: (tr: Number) => trajanje = tr
    });

    return trajanje;
  }


  upisVremena() {
    var v = Number(this.treningForm.controls.sati.value);
    var m = Number(this.treningForm.controls.minuti.value);

    if (!this.treningSadrziAktivnost(this.aktivnost)) {
      this.funkcije.enableDugme('btAktivnost');
      this.funkcije.disableDugme('btPv');
    }
    else {
      this.funkcije.enableDugme('btPv');
      this.funkcije.disableDugme('btAktivnost');
    }

    if(this.aktivnost.id != 0)
      this.potrosnja(this.aktivnost);
    else this.potrosnja(this.aktivnostT);
  }



  pretraziAktivnosti() {
    var naziv = '';
    if (this.traziAktivnostForm.controls.unos.valid)
      naziv = String(this.traziAktivnostForm.controls.unos.value);

    this.aServis.aktivnostiPoNazivu(naziv).subscribe({
      next: (a: Aktivnost[]) => this.aktivnosti = a,
      error: (e) => {
        this.greska = e.error +
          ' Želiš li da pošalješ zahtev administratoru, kako bi je dodao na spisak? 🙏';
        this.funkcije.enableDugmad(['btDa', 'btNe']);
        this.daNeDugmad = true;
        this.zahtevForm.controls.naziv.setValue(naziv);
      },
      complete: () => console.log('Pronađene aktivnosti su učitane.')
    });
  }



  popunjeno() {
    var unos = '';
    if (this.traziAktivnostForm.controls.unos.valid)
      unos = String(this.traziAktivnostForm.controls.unos.value);

    if (unos == '' || unos == ' ') {
      this.funkcije.disableDugme('btTrazi');
      this.ucitajAktivnosti();
    }
    else
      this.funkcije.enableDugme('btTrazi');
  }


  clickZahtevi(){
    this.ucitajZahteve();
    this.otvorizahteve = !this.otvorizahteve;
  }


  clickNe() {
    this.greska = '';
    this.funkcije.disableDugmad(['btDa', 'btNe']);
    this.daNeDugmad = false;
    this.ucitajAktivnosti();
    this.traziAktivnostForm.reset();
  }

  clickDa() {
    this.clickNe();
    this.poslednji();
    this.unos();
    this.zahtevforma = true;
  }


  zvonce = '';

  podesiZvonce() {
    var pz = Boolean(this.zahtevForm.controls.prijava.value);
    if (pz)
      this.zvonce = '🔔';
    else this.zvonce = '🔕';
  }

  poslednji() {
    this.zServis.prijavaPrethodnog().subscribe({
      next: (pz: Boolean) => {
        this.zahtevForm.controls.prijava.setValue(Boolean(pz));
        this.podesiZvonce();
      },
      error: (e) => this.greska = e.error,
      complete: () => console.log('ucitana prijava prethodnog zahteva')
    });
  }

  unos() {
    var naziv = String(this.zahtevForm.controls.naziv.value);
    if (naziv.trim() != '')
      this.funkcije.enableDugme('btPosalji');
    else this.funkcije.disableDugme('btPosalji');
  }

  async clickPosalji() {
    var naziv = String(this.zahtevForm.controls.naziv.value);
    var prijava = Boolean(this.zahtevForm.controls.prijava.value);
    var napomena = '*';
    if (this.zahtevForm.controls.napomena.valid)
      napomena = String(this.zahtevForm.controls.napomena.value);

    this.zServis.posaljiZahtev(naziv, prijava, napomena).subscribe({
      next: (z: ZahtevAktivnosti) => {
        this.zahtev = z;
        this.greska = '';
        this.zahtevforma = false;
        this.daNeDugmad = false;
        this.ucitajZahteve();
        this.zahtevForm.reset();
      },
      error: (e) => this.greska = e.error,
      complete: () => console.log('zahtev aktivnosti poslat')
    });

    await this.funkcije.sacekaj(0.5);
    this.greska = 'Zahtev je poslat';
    await this.funkcije.sacekaj(0.5);
    this.greska = '';
    this.funkcije.disableDugmad(['btDa', 'btNe']);
    this.daNeDugmad = false;
  }




  ucitajZahteve() {
    this.zServis.poslatiZahtevi().subscribe({
      next: (z: ZahtevAktivnosti[]) => {
        this.zahtevi = z;
        this.poslednji();
      },
      error: (e) => this.zahtevi = [],
      complete: () => console.log('ucitani poslati zahtevi namirnice')
    });
  }

  prikazidetalje = false;
  async clickZahtev() {
    this.nadjiZahtev();
    await this.funkcije.sacekaj(0.5);
    this.rezultat();
    this.otvorizahteve = false;
    this.prikazidetalje = true;
  }


  nadjiZahtev() {
    var z = Number(this.poslatZahtevForm.controls.pZahtev.value);
    this.zServis.poslatZahtev(z).subscribe({
      next: (zn: ZahtevAktivnosti) => {
        this.zahtev = zn;
        if (Number(this.zahtev.stanje) > 0)
          this.funkcije.disableDugme('btPovuci');
        else this.funkcije.enableDugme('btPovuci');
      },
      error: (e) => this.detalji = e.error,
      complete: () => console.log('pronadjen zahtev')
    });
  }

  detalji = '';
  rezultat() {
    this.zServis.rezultatPoslatogZahteva(this.zahtev.id).subscribe({
      next: (odg: RezultatZahteva) =>
        this.detalji = odg.poruka,
      error: (e) => this.detalji = e.error,
      complete: () => console.log('Rezultat zahteva je ispisan.')
    });
  }


  povuciZahtev() {
    this.zServis.povuciZahtev(this.zahtev.id).subscribe({
      next: (odg: string) => {
        this.detalji = odg;
        this.ucitajZahteve();
      },
      error: (e) => this.detalji = e.error,
      complete: () => console.log('povucen zahtev')
    });


  }


  zahtevX() {
    this.prikazidetalje = false;
    this.detalji = '';
    this.funkcije.enableDugme('btPosalji');
    this.zahtev = new ZahtevAktivnosti();
  }

  slanjeX() {
    this.zahtevforma = false;
    this.ucitajAktivnosti()
    this.zahtevForm.reset();
  }


  ucitajTreninge() {
    this.tServis.treninzi().subscribe({
      next: (t: Trening[]) => {
        this.treninzi = t;
      //  this.funkcije.disableDugme('sGoreT');
        if(t.length > 17){
           this.brTreninga = 17;
       //   this.funkcije.enableDugme('sDoleT');
          }
        else {
          this.brTreninga = t.length;
     //     this.funkcije.disableDugme('sDoleT');
        }
      },
      error: (e) => this.poruka = e.error,
      complete: () => console.log('trenizi su ucitani')
    });
  }


  ucitajAktivnostiTreninga() {

    this.tServis.aktivnostiTreninga(this.trening.id).subscribe({
      next: (a: Aktivnost[]) => {
        this.aktivnostiTreninga = a;
        if(a.length > 7)
          this.brAktivnosti = 7;
        else this.brAktivnosti = a.length;

      },
      error: (e) => this.poruka = e.error,
      complete: () => console.log('ucitane aktivnosti treninga')
    });
  }


  ucitajVremenaAktivnosti() {
    this.tServis.vremenaAktivnosti(this.trening.id).subscribe({
      next: (vremena: Number[]) => {
        this.vremenaAktivnosti = vremena;
        this.ucitajPotrosnje();
      },
      error: (e) => this.poruka = e.error,
      complete: () => console.log('vremena su ucitana')
    });
  }

  ucitajPotrosnje() {
    this.potrosnjePriAktivnostima = new Array<Number>();
    this.tServis.potrosnjePriAktivnostima(this.trening.id).subscribe({
      next: (potrosnje: Number[]) => this.potrosnjePriAktivnostima = potrosnje,
      error: (e) => this.greska = e.error,
      complete: () => console.log('ucitane potrosnje')
    });
  }


  upisiVreme() {
    var sati = 60 * Number(this.treningForm.controls.sati.value);
    var minuti = Number(this.treningForm.controls.minuti.value);

    if (sati == 0 && minuti == 0)
      this.vreme = 0;
    else if (sati != 0 && minuti == 0)
      this.vreme = sati;
    else if (sati == 0 && minuti != 0)
      this.vreme = minuti;
    else
      this.vreme = sati + minuti;

    if(this.aktivnost.id != 0)  
      this.potrosnja(this.aktivnost);
    else this.potrosnja(this.aktivnostT);
  }


  clickTrening() {
    var t = Number(this.treninziForm.controls.izabranTrening.value);
    this.tServis.treningPoIDu(t).subscribe({
      next: (tt: Trening) => {
        this.trening = tt;
        this.upisnaziva = false;
        this.otvoritrening = true;
        this.ucitajAktivnostiTreninga();
        this.ucitajVremenaAktivnosti();
        this.opisiTrening();
        this.treningForm.controls.oznacenaAktivnost.enable();
        this.treningForm.controls.aktivnost.enable();
        this.funkcije.enableDugmad(['btPreimenuj', 'btObrisi']);
        this.treninziForm.controls.izabranTrening.setValue(0);
      },
      error: (e) => this.poruka = e.error,
      complete: () => console.log('izabran je trening')
    });
  }


  treningX() {
    this.trening = new Trening()
    this.otvoritrening = false;
    this.aktivnostiTreninga = [];
    this.vremenaAktivnosti = [];
    this.opis = '';
    this.treningForm.reset();
    this.treningForm.controls.oznacenaAktivnost.disable();
    this.treningForm.controls.aktivnost.disable();
    this.funkcije.disableDugmad(['btPreimenuj', 'btObrisi', 'btAktivnost']);
    this.aktivnostX();
  }



  unetNazivTreninga() {
    var tn = String(this.treninziForm.controls.naziv.value);

    if (tn.trim() != '')
      this.funkcije.enableDugme('btTrening');
    else this.funkcije.disableDugme('btTrening');

  }

  clickPreimenuj(){
    this.funkcije.disableDugmad(['btPreimenuj', 'btNn']);
    this.treningForm.controls.noviNaziv.setValue(this.trening.naziv);
    this.promena = true;
  }

  preimenujX(){
    this.funkcije.enableDugme('btPreimenuj');

    this.funkcije.disableDugme('btNn');
    this.promena = false;
  }


  unetNoviNazivTreninga(){
    var tn = String(this.treningForm.controls.noviNaziv.value);
    tn = tn.trim();
    if(this.trening.id != 0 && tn != '' && tn != this.trening.naziv)
      this.funkcije.enableDugme('btNn');
    else this.funkcije.disableDugme('btNn');
  }



  /*clickDodajNoviTrening() {
    this.upisnaziva = true;
    this.trening = new Trening();
  }*/


  dodajNoviTrening() {
    var tn = String(this.treninziForm.controls.naziv.value);
    this.tServis.dodajTrening(tn).subscribe({
      next: (t: Trening) => {
        this.trening = t;
        this.opisiTrening();
        this.treningForm.controls.oznacenaAktivnost.enable();
        this.funkcije.disableDugmad(['btTrening']);
        this.funkcije.enableDugmad(['btObrisi', 'btPv']);
        this.upisnaziva = false;
        this.otvoritrening = true;
        this.ucitajTreninge();
        this.treningForm.reset();
        this.treninziForm.reset();
      },
      error: async (e) => {
        this.poruka = e.error;
        await this.funkcije.sacekaj(1);
        this.poruka = '';
      },
      complete: () => console.log('unet nov trening')
    });
  }





  dodajAktivnostTreningu() {
    this.tServis.dodajAktivnostTreningu(this.trening.id, this.aktivnost.id, this.vreme).subscribe({
      next: /*async*/ (t: Trening) => {
        this.trening = t;
        this.ucitajAktivnostiTreninga();
        this.ucitajVremenaAktivnosti();
        this.opisiTrening();
      //  await this.protrci();
      },
      error: (e) => this.poruka = e.error,
      complete: () => console.log('aktivnost dodata u trening')
    });


    this.aktivnostX();
  }


  /*async protrci() {
    var zec = <HTMLImageElement>document.getElementById('gif');
    this.gif = true;
    zec.style.left = '650px';
    var ztop = 50;
    for (let i = 0; i < 1300; i++) {
      var novo = 650 - i;
      zec.style.left = novo.toString() + 'px';
      if (i > 400)
        ztop = ztop - 1;

      zec.style.top = ztop.toString() + 'px';
      await this.funkcije.sacekaj(0.0005);
    }

    this.gif = false;

  }*/


  clickAktivnostVecUbacena(){
    var dugmePrikazi = <HTMLButtonElement>document.getElementById('btDetaljiA');
    var dugmePV = <HTMLButtonElement>document.getElementById('btPv');
    var dugmeI = <HTMLButtonElement>document.getElementById('btIzbaci');
    this.funkcije.enableDugmad(['btDetaljiA', 'btPv', 'btIzbaci', 'btPromena']);
    this.funkcije.disableDugmad(['prikaziA', 'ubaciA', 'btAktivnost' ]);
    
    var opcija = <HTMLOptionElement>document.getElementById(this.aktivnost.id.toString());
    opcija.selected = true;
    var y =  (opcija.offsetTop +420) + "px";
    dugmePrikazi.style.top = y;
    dugmePV.style.top = y ;
    dugmeI.style.top = y; 
  
    this.treningForm.controls.oznacenaAktivnost.setValue(0);
    this.treningForm.controls.aktivnost.setValue(Number(this.aktivnost.id));
    this.aktivnost = new Aktivnost();
    this.clickAktivnostTreninga();    
  }


  clickAktivnost(){
    var a = Number(this.treningForm.controls.oznacenaAktivnost.value);
    this.aServis.aktivnostPoIDu(a).subscribe({
      next: (aa: Aktivnost) => {
        this.aktivnost = aa;

        this.treningForm.controls.sati.setValue(0);
        this.treningForm.controls.minuti.setValue(30);
        this.treningForm.controls.sati.enable();
        this.treningForm.controls.minuti.enable();
        this.vreme = 30;
        this.potrosnja(this.aktivnost);

        if(this.trening.id == 0)
          this.funkcije.enableDugme('prikaziA');
        else {
            if( !this.treningSadrziAktivnost(aa) ){
              this.funkcije.enableDugmad(['prikaziA', 'ubaciA', 'btAktivnost']);
              this.funkcije.disableDugmad(['btPromena', 'btDetaljiA', 'btPv', 'btIzbaci',]);
              this.aktivnostT = new Aktivnost();
            }
            else 
              this.clickAktivnostVecUbacena();           
          }
      },
      error: (e) => this.greska = e.error
    });
  }
  
  ubacivanjeAktivnosti = false;
  prikazAktivnosti = false;
  promenaTrajanja = false;

  aktivnostX(){
    this.aktivnost = new Aktivnost();
    this.aktivnostT = new Aktivnost();
    this.funkcije.disableDugmad(['ubaciA','prikaziA', 'btAktivnost', 'btDetaljiA', 'btPromena', 'btPv', 'btIzbaci']);
    this.treningForm.reset();
    this.prikazAktivnosti = false;
    this.ubacivanjeAktivnosti = false;
    this.promenaTrajanja = false;
    this.treningForm.controls.minuti.disable();
    this.treningForm.controls.minuti.setValue(0)
    this.treningForm.controls.sati.disable();
    this.treningForm.controls.sati.setValue(0);
    this.vreme = 0;
  }

  potrosnja(a: Aktivnost) {
    this.aServis.potrosnja(a.id, this.vreme).subscribe({
      next: (odg: string) => this.potrosnjaE = odg,
      error: (e) => this.greska = e.error,
      complete: () => console.log('potrosnja skalirana')
    });
  }


  clickAT(){
    var sastojci = <HTMLSelectElement>document.getElementById('sSadrzaj');
    var dugmePrikazi = <HTMLButtonElement>document.getElementById('btDetaljiA');
    var dugmePV = <HTMLButtonElement>document.getElementById('btPv');
    var dugmeI = <HTMLButtonElement>document.getElementById('btIzbaci');

    sastojci.addEventListener('click', (event) => {      
      var y =  this.funkcije.pozicija(event.clientY, 430, 660) + "px";  
      dugmePrikazi.style.top = y ;
      dugmePV.style.top = y ;
      dugmeI.style.top = y ;
    });

    this.clickAktivnostTreninga();
  
  }

  clickAktivnostTreninga() {
    var akt = Number(this.treningForm.controls.aktivnost.value);
    this.aServis.aktivnostPoIDu(akt).subscribe({
      next: (a: Aktivnost) => {
        this.aktivnostT = a;

        this.tServis.vremeAktivnosti(this.trening.id, a.id).subscribe({
          next: (v: any) => {
            var s = 0;
            if (v > 60) {
              s = Math.floor(v / 60);
              v = v - s * 60;
            }
            this.treningForm.controls.minuti.setValue(v);
            this.treningForm.controls.sati.setValue(s);
            this.treningForm.controls.minuti.enable();
            this.treningForm.controls.sati.enable();
            this.upisiVreme();
            this.funkcije.enableDugmad(['btIzbaci', 'btPv', 'btDetaljiA','btPromena', 'btAktivnost']);
            this.funkcije.disableDugme('btAktivnost');
          },
          error: async (e) => {
            this.poruka = e.error;
            await this.funkcije.sacekaj(1);
            this.poruka = '';
          },
          complete: () => console.log('masa ucitana')
        });

      },
      error: (e) => this.poruka = e.error,
      complete: () => console.log('aktivnost prikazana')
    });
  }


  async izbaciAktivnostIzTreninga() {
    var a = Number(this.treningForm.controls.aktivnost.value);
    this.tServis.obrisiAktivnostIzTreninga(this.trening.id, a).subscribe({
      next: async (t: Trening) => {
        this.trening = t;
        this.ucitajAktivnostiTreninga();
        this.ucitajVremenaAktivnosti();
        this.opisiTrening();
        this.aktivnostX();
      },
      error: (e) => this.poruka = e.error,
      complete: () => console.log('aktivnost je obrisana iz treninga')
    });

  }


  promeniTrajanjeAktivnosti() {
    var a = Number(this.treningForm.controls.aktivnost.value);
    this.upisiVreme();

    this.tServis.promeniVremeAktivnosti(this.trening.id, a, this.vreme).subscribe({
      next: (t: Trening) => {
        this.trening = t;
        this.ucitajAktivnostiTreninga();
        this.ucitajVremenaAktivnosti();
        this.opisiTrening();
        this.aktivnostX();
      },
      error: async (e) => {
        this.poruka = e.error;
        await this.funkcije.sacekaj(1);
        this.poruka = '';
      },
      complete: () => console.log('vreme promenjena')
    });
  }




  preimenujTrening() {
    var novi = String(this.treningForm.controls.noviNaziv.value);
    this.tServis.promeniNaziv(this.trening.id, novi).subscribe({
      next: (t: Trening) => {
        this.trening = t;
        this.preimenujX();
        this.ucitajTreninge();
        this.opisiTrening();
      },
      error: async (e) => {
        this.poruka = e.error;
        await this.funkcije.sacekaj(1);
        this.poruka = '';
      },
      complete: () => console.log('trening je preimenovan')
    });
    this.treningForm.reset();
  }


  opis = '';
  opisiTrening() {
    this.opis = '';
    this.tServis.opisiTrening(this.trening.id).subscribe({
      next: (odg: string) => this.opis = odg,
      error: (e) => this.opis = e.error,
      complete: () => console.log('trening opisan')
    });
  }

  async obrisiTrening() {
    this.tServis.obrisiTrening(this.trening.id).subscribe({
      next: (odg: string) => {
        this.poruka = odg;
        this.trening = new Trening();
        this.funkcije.disableDugmad(['btTrening', 'btPreimenuj', 'btAktivnost', 'btPv', 'btObrisi']);
        this.ucitajTreninge();
      },
      error: (e) => this.poruka = e.error,
      complete: () => console.log('trening je obrisan')
    });

    await this.funkcije.sacekaj(1);
    this.poruka = '';
  }


  objaviTrening() {
    var objava = new Objava();
    this.tServis.objaviTrening(this.trening.id).subscribe({
      next: (o: Objava) => {
        objava = o;
        this.poruka = this.trening.naziv + ' je objavljen, možeš ga videti među svojim ostalim objavama.';
      },
      error: (e) => this.poruka = e.error,
      complete: () => console.log('trening je objavljen')
    });
  }


  /*

  proveriT(){   
    if(this.pomerajT < 1)
      this.funkcije.disableDugme('sGoreT');
    else this.funkcije.enableDugme('sGoreT');

    if(this.pomerajT > this.treninzi.length - 10)
      this.funkcije.disableDugme('sDoleT');
    else this.funkcije.enableDugme('sDoleT');
  }

  pomeriTreningeGore(){
    var sTreninzi = <HTMLSelectElement>document.getElementById('sTreninzi');
    sTreninzi.scrollTop = sTreninzi.scrollTop - 30;
    this.pomerajT--;
    this.proveriT();
  }

  pomeriTreningeDole(){
    var sTreninzi = <HTMLSelectElement>document.getElementById('sTreninzi');
    sTreninzi.scrollTop = sTreninzi.scrollTop + 30;
    this.pomerajT++;
    this.proveriT();
  }

  pomeriTreninge(){
    var sTreninzi = <HTMLSelectElement>document.getElementById('sTreninzi');
    sTreninzi.addEventListener('wheel', (event) => {
    var moguce = (this.treninzi.length - 9) * 30;
      this.klizPomerajT = this.klizPomerajT + event.deltaY;
      console.log('moguc pomeraj: ' + moguce +', pomeraj: ' + this.klizPomerajT);

      if(event.deltaY > 0){
        this.funkcije.enableDugme('sGoreT');
        if(this.klizPomerajT > moguce){
            this.funkcije.disableDugme('sDoleT');

          }
        else this.funkcije.enableDugme('sDoleT');
      }
      else{
        this.funkcije.enableDugme('sDoleT');
        if(this.klizPomerajT < -moguce)
          this.funkcije.disableDugme('sGoreT');
        else this.funkcije.enableDugme('sGoreT');
      }
      
    });
  }
*/


  proveriA(){   
    if(this.pomerajA < 1)
      this.funkcije.disableDugme('sGoreA');
    else this.funkcije.enableDugme('sGoreA');

    if(this.pomerajA > this.aktivnosti.length - 19)
      this.funkcije.disableDugme('sDoleA');
    else this.funkcije.enableDugme('sDoleA');
  }

  pomeriAktivnostiGore(){
    this.funkcije.enableDugme('sDoleA');
    var sAktivnosti = <HTMLSelectElement>document.getElementById('sAktivnosti');
    sAktivnosti.scrollTop = sAktivnosti.scrollTop - 26;
    this.pomerajA--;
    this.proveriA();
  }

  pomeriAktivnostiDole(){
    this.funkcije.enableDugme('sGoreA');
    var sAktivnosti = <HTMLSelectElement>document.getElementById('sAktivnosti');
    sAktivnosti.scrollTop = sAktivnosti.scrollTop + 26;
    this.pomerajA++;
    this.proveriA();
  }

  pomeriAktivnosti(){
    var sAktivnosti = <HTMLSelectElement>document.getElementById('sAktivnosti');
    sAktivnosti.addEventListener('wheel', (event) => {
    var moguce = (this.aktivnosti.length - 17) * 30;
      this.klizPomerajA = this.klizPomerajA + event.deltaY;

      if(event.deltaY > 0){
        this.funkcije.enableDugme('sGoreA');
        if(this.klizPomerajA > moguce){
            this.funkcije.disableDugme('sDoleA');

          }
        else this.funkcije.enableDugme('sDoleA');
      }
      else{
        this.funkcije.enableDugme('sDoleA');
        if(this.klizPomerajA < -moguce)
          this.funkcije.disableDugme('sGoreA');
        else this.funkcije.enableDugme('sGoreA');
      }
      
    });
  }


}
