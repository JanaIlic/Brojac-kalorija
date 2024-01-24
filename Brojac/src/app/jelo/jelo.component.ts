import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { __values } from 'tslib';
import { Router } from '@angular/router';
import { PomocneFunkcije } from '../services/pomocne.funkcije';
import { JeloServis } from '../services/jelo.servis';
import { NamirnicaServis } from '../services/namirnica.servis';
import { Namirnica } from '../model/namirnica';
import { ZahtevNamirnice } from '../model/zahtev.namirnice';
import { ZahtevNamirniceServis } from '../services/z.namirnice.servis';
import { RezultatZahteva } from '../model/rezultat.zahteva';
import { Jelo } from '../model/jelo';
import { Objava } from '../model/objava';

@Component({
  selector: 'jelo',
  templateUrl: './jelo.html',
  styleUrls: ['./jelo.css']
})

export class JeloComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private funkcije: PomocneFunkcije,
    private router: Router,
    private nServis: NamirnicaServis,
    private jServis: JeloServis,
    private zServis: ZahtevNamirniceServis) { }


  ngOnInit() {
    this.ucitajNamirnice();
    this.ucitajJela();
    this.disableDugmad();
  }

  poruka = '';
  namirnice = new Array<Namirnica>();
  namirnica = new Namirnica;
  sastojak = new Namirnica;
  zahtevi = new Array<ZahtevNamirnice>();
  zahtev = new ZahtevNamirnice();
  jelo = new Jelo();
  namirniceJela = new Array<Namirnica>();
  maseNamirnica = new Array<Number>();
  jela = new Array<Jelo>();

  vrsta = '';
  priprema = '';
  dm = '';
  db = '';
  natpis = 'filter';
  greska = '';
  zahtevforma = false;
  filterforma = false;
  daNeDugmad = false;
  otvorizahteve = false;
  sNazad = false;
  promena = false;
  ppre = false;
  pposle = false;
  brJela = 0;

  pomeraj = 0;
  klizPomeraj = 0;

  //putanja = '../assets/slike/CookbookAnimation.gif';
  //gif = false;


  nazadNaObrok() {
    this.router.navigate(['./obrok']);
  }

  nazadNaKorisnickiPrikaz() {
    this.router.navigate(['./korisnicki-prikaz']);
  }

  ucitajNamirnice() {
    this.nServis.namirnice().subscribe({
      next: (n: Namirnica[]) => {
        this.namirnice = n;
        this.pomeraj = 0;
        this.klizPomeraj = 0;
        this.funkcije.disableDugme('sGoreN');
      },
      error: (e) => this.poruka = e.error,
      complete: () => console.log('ucitane sve namirnice')
    });
  }


  sastojciForm = this.fb.group({
    izabranaNamirnica: [0, Validators.required],
    masa: [0, Validators.required],
    pre: [false, Validators.required],
    posle: [false, Validators.required]
  });

  traziNamirnicuForm = this.fb.group({
    unos: ['', [Validators.required]]
  })

  filterForm = this.fb.group({
    vrsta: [9, Validators.required],
    tip: [6, Validators.required],
    dMast: [3, Validators.required],
    dBrasno: [3, Validators.required]
  })


  zahtevForm = this.fb.group({
    naziv: ['', Validators.required],
    napomena: ['', Validators.required],
    prijava: [true, Validators.required]
  })

  poslatZahtevForm = this.fb.group({
    pZahtev: [0, Validators.required]
  })

  jeloForm = this.fb.group({
    namirnica: [0, Validators.required], 
    novaMasa: [0, Validators.required],
    noviNaziv: ['', Validators.required]
  })


  jelaForm = this.fb.group({
    naziv: ['', Validators.required],
    izabranoJelo: [0, Validators.required]
  })


  odjaviSe() {
    localStorage.removeItem('authToken');
    this.router.navigate(['./pocetna']);
  }

  disableDugmad() {
    var dugmad = ['btTrazi', 'btDa', 'btNe', 'btJelo', 'btPosalji',
      'btUbaci', 'btPm', 'btIzbaci', 'btPreimenuj', 'btObrisi', 'prikaziN', 'ubaciN'];
    this.funkcije.disableDugmad(dugmad);
  }


  resetPretraga() {
    this.traziNamirnicuForm.reset();
    this.funkcije.disableDugme('btTrazi');
    this.ucitajNamirnice();
  }

  resetFilter() {
    this.filterForm.reset();
    this.ucitajNamirnice();
  }


namirnicaPrikazana = false;
ubacivanjeNamirnice = false;

  prikazNamirnice(n: Namirnica) {
    this.namirnica = n;
    this.namirnicaPrikazana = true;
  }


  clickNamirnicaVecSastojak(){
    var dugmePrikazi = <HTMLButtonElement>document.getElementById('btDetaljiNJ');
    var dugmePM = <HTMLButtonElement>document.getElementById('btMasaNJ');
    var dugmeI = <HTMLButtonElement>document.getElementById('btIzbaciNJ');
    this.funkcije.enableDugmad(['btDetaljiNJ', 'btMasaNJ', 'btIzbaciNJ']);
    
    var opcija = <HTMLOptionElement>document.getElementById(String(this.sastojciForm.controls.izabranaNamirnica.value));
    opcija.selected = true;
    var y = (420 + opcija.offsetTop) + "px";
    dugmePrikazi.style.top = y;
    dugmePM.style.top = y ;
    dugmeI.style.top = y; 
  
    this.sastojak = this.namirnica;
    this.namirnica = new Namirnica();
    this.sastojciForm.controls.izabranaNamirnica.setValue(0);
    this.jeloForm.controls.namirnica.setValue(Number(this.sastojak.id));

    this.jServis.masaNamirnice(this.jelo.id, this.sastojak.id).subscribe({
      next: (m: number) => {
        this.jeloForm.controls.novaMasa.setValue(m);
        this.jeloForm.controls.novaMasa.enable();
        this.staraMasa = m;
        this.funkcije.enableDugme('btIzbaci');

        this.vrsta = this.nServis.vrstaNamirnice(this.sastojak);
        this.priprema = this.nServis.pripremaNamirnice(this.sastojak);
        this.db = this.nServis.dodatoBrasno(this.sastojak);
        this.dm = this.nServis.dodataMast(this.sastojak);
      }}  );
    
  }


  clickNamirnicu(){
    var n = Number(this.sastojciForm.controls.izabranaNamirnica.value);

    this.nServis.nadji(n).subscribe({
      next: (nn: Namirnica) => {
        this.sastojciForm.controls.posle.setValue(true);
        this.namirnica = nn;

        if(this.jelo.id != 0 && this.jeloSadrziNamirnicu(nn))
            this.clickNamirnicaVecSastojak();
        else{
          this.funkcije.enableDugme('prikaziN');
          if(this.jelo.id != 0 && !this.jeloSadrziNamirnicu(nn))
            this.funkcije.enableDugme('ubaciN');                   
          else this.funkcije.disableDugme('ubaciN');
  
          this.vrsta = this.nServis.vrstaNamirnice(nn);
          this.priprema = this.nServis.pripremaNamirnice(nn);
          this.db = this.nServis.dodatoBrasno(nn);
          this.dm = this.nServis.dodataMast(nn);
          this.sastojciForm.controls.masa.setValue(100);

          var sf = <HTMLFormElement>document.getElementById('sf');
          sf.style.zIndex = "10";
          var dn = <HTMLDivElement>document.getElementById('dn');
          dn.style.zIndex = "11"; 
        }

      },
      error: (e) => this.poruka = e.error,
      complete: () => console.log('ucitana namirnica')
    });


  }


  namirnicaX(){
    this.namirnica = new Namirnica();
    this.sastojciForm.reset();
    this.namirnicaPrikazana = false;
    this.ubacivanjeNamirnice = false;
    this.funkcije.disableDugmad(['btUbaci', 'prikaziN', 'ubaciN']);

    var sf = <HTMLFormElement>document.getElementById('sf');
    sf.style.zIndex = "2";
    var dn = <HTMLDivElement>document.getElementById('dn');
    dn.style.zIndex = "3"; 

    this.pposle = false;
    this.ppre = false;
  }


  jeloSadrziNamirnicu(n: Namirnica): Boolean {
    var ret = false;
    for (let i = 0; i < this.namirniceJela.length; i++)
      if (this.namirniceJela[i].id == n.id)
        ret = true;

    return ret;
  }


  upisMase() {
    var m = Number(this.sastojciForm.controls.masa.value);
  ///  var oznaceno = false;
  ///  oznaceno = Boolean(this.sastojciForm.controls.posle.value || this.sastojciForm.controls.pre.value);

    this.nServis.skaliraj(this.namirnica, m).subscribe({
      next: (n: Namirnica) => {
        this.prikazNamirnice(n);
    //    if (!this.jeloSadrziNamirnicu(this.namirnica) && oznaceno ) 
        if(this.ppre || this.pposle) 
          this.funkcije.enableDugme('btUbaci');
        else this.funkcije.disableDugme('btUbaci');
        
      },
      error: (e) => this.poruka = e.error,
      complete: () => console.log('skalirana')
    });
  }



  upisNoveMase(){
    var m = Number(this.jeloForm.controls.novaMasa.value);   
    if(m > 0 && m != this.staraMasa ){
      this.funkcije.enableDugme('btPm');
      this.nServis.skaliraj(this.sastojak, m).subscribe({
        next: (n: Namirnica) => this.sastojak = n
      });
    }
    else this.funkcije.disableDugme('btPm');
  } 

  pretraziNamirnice() {
    var naziv = '';
    if (this.traziNamirnicuForm.controls.unos.valid)
      naziv = String(this.traziNamirnicuForm.controls.unos.value);

    this.nServis.nadjiPoNazivu(naziv).subscribe({
      next: (n: Namirnica[]) => this.namirnice = n,
      error: (e) => {
        this.greska = e.error +
          ' Želiš li da pošalješ zahtev administratoru, kako bi je dodao na spisak? 🙏';
        this.funkcije.enableDugmad(['btDa', 'btNe']);
        this.daNeDugmad = true;
        this.zahtevForm.controls.naziv.setValue(naziv);
      },
      complete: () => console.log('Pronađene namirnice su učitane.')
    });
  }



  popunjeno() {
    var unos = '';
    if (this.traziNamirnicuForm.controls.unos.valid)
      unos = String(this.traziNamirnicuForm.controls.unos.value);

    if (unos.trim() == '') {
      this.funkcije.disableDugme('btTrazi');
      this.ucitajNamirnice();
    }
    else
      this.funkcije.enableDugme('btTrazi');
  }




  zatvoriFilter(){
    this.filterforma = false;
    this.ucitajNamirnice();
    this.filterForm.reset();
    this.greska = '';
  }



  filter() {
    var v = Number(this.filterForm.controls.vrsta.value);
    var tip = Number(this.filterForm.controls.tip.value);
    var b = Number(this.filterForm.controls.dBrasno.value);
    var m = Number(this.filterForm.controls.dMast.value);

    this.nServis.filter(v, tip, m, b).subscribe({
      next: (n: Namirnica[]) => this.namirnice = n,
      error: (e) => {
        this.greska = e.error +
          'Želiš li da pošalješ zahtev administratoru, kako bi je dodao na spisak? 🙏';
        this.namirnice = [];
        this.funkcije.enableDugmad(['btDa', 'btNe']);
        this.daNeDugmad = true;
      },
      complete: () => console.log('filtrirano')
    });

  }


  clickOtvoriZahteve() {
    this.ucitajZahteve();
    this.otvorizahteve = !this.otvorizahteve;
  }


  clickNe() {
    this.greska = '';
    this.funkcije.disableDugmad(['btDa', 'btNe']);
    this.daNeDugmad = false;
    this.ucitajNamirnice();
    this.filterForm.reset();
    this.traziNamirnicuForm.reset();
  }

  clickDa() {
    this.clickNe();
    this.poslednji();
    this.unos();
    this.zahtevforma = true;
  }


  unos() {
    var naziv = String(this.zahtevForm.controls.naziv.value);
    if (naziv.trim() != '')
      this.funkcije.enableDugme('btPosalji');
    else this.funkcije.disableDugme('btPosalji');
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



  async clickPosalji() {
    var naziv = String(this.zahtevForm.controls.naziv.value);
    var prijava = Boolean(this.zahtevForm.controls.prijava.value);
    var napomena = '*';
    if (this.zahtevForm.controls.napomena.valid)
      napomena = String(this.zahtevForm.controls.napomena.value);
    this.zServis.posaljiZahtev(naziv, prijava, napomena).subscribe({
      next: (z: ZahtevNamirnice) => {
        this.zahtev = z;
        this.greska = '';
        this.zahtevforma = false;
        this.daNeDugmad = false;
        this.zahtevForm.reset();
        this.ucitajZahteve();
        this.funkcije.disableDugme('btPosalji');
      },
      error: (e) => this.greska = e.error,
      complete: () => console.log('zahtev namirnice poslat')
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
      next: (z: ZahtevNamirnice[]) => {
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
      next: (zn: ZahtevNamirnice) => {
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
    this.zahtev = new ZahtevNamirnice();
  }

  slanjeX() {
    this.zahtevforma = false;
    this.ucitajNamirnice()
    this.zahtevForm.reset();
  }

  jeloX() {
    this.jelo = new Jelo();
    this.sastojak = new Namirnica();
    this.jelaForm.controls.izabranoJelo.setValue(0);
    this.jeloForm.controls.namirnica.setValue(0);
  }


  ucitajJela() {
    this.jServis.jela().subscribe({
      next: (j: Jelo[]) => {
        this.jela = j;
        if(j.length > 17)
          this.brJela = 17;
        else this.brJela = j.length;
      },
      error: (e) => console.log(e.error), 
      complete: () => console.log('jela su ucitana')
    });
  }


  ucitajNamirniceJela() {

    this.jServis.namirniceJela(this.jelo.id).subscribe({
      next: (n: Namirnica[]) => this.namirniceJela = n,
      error: (e) => this.poruka = e.error,
      complete: () => console.log('ucitane namirnice iz jela')
    });
  }


  ucitajMaseNamirnica() {
    this.jServis.maseNamirnica(this.jelo.id).subscribe({
      next: (mase: number[]) => this.maseNamirnica = mase,
      error: (e) => this.poruka = e.error,
      complete: () => console.log('mase su ucitane')
    });
  }


  clickJelo() {
    var j = Number(this.jelaForm.controls.izabranoJelo.value);
    this.jServis.jeloPoIDu(j).subscribe({
      next: (ij: Jelo) => {
        this.jelo = ij;
        this.ucitajNamirniceJela();
        this.ucitajMaseNamirnica();
        this.funkcije.enableDugmad(['btPreimenuj', 'btObrisi']);
        if(this.namirnica.id != 0)
          this.funkcije.enableDugme('btUbaci');
        else this.funkcije.disableDugme('btUbaci');
      },
      error: (e) => this.poruka = e.error,
      complete: () => console.log('izabrano je jelo')
    });
  }


  clickPreimenuj(){
    this.funkcije.disableDugmad(['btPreimenuj', 'btNn']);
    this.jeloForm.controls.noviNaziv.setValue(this.jelo.naziv);
    this.promena = true;
  }

  preimenujX(){
    this.funkcije.enableDugme('btPreimenuj');
    this.funkcije.disableDugme('btNn');
    this.promena = false;
  }


  unetNoviNazivJela(){
    var n = String(this.jeloForm.controls.noviNaziv.value);
    if(this.jelo.id != 0 && n != '' && n != this.jelo.naziv)
      this.funkcije.enableDugme('btNn');
    else this.funkcije.disableDugme('btNn');

  }


  unetNazivJela() {
    var jn = String(this.jelaForm.controls.naziv.value);
    jn = jn.trimEnd();
    if (jn != '' && this.jelo.id == 0  )
      this.funkcije.enableDugme('btJelo');
    else this.funkcije.disableDugme('btJelo');

  }


  checkPosle() {
  //  var posle = Boolean(this.sastojciForm.controls.posle.value);
  //  if (posle)
 //     this.sastojciForm.controls.pre.setValue(false);
  //  else this.sastojciForm.controls.pre.setValue(true);

  this.pposle = true;
  this.ppre = false;

    if(Number(this.sastojciForm.controls.masa.value) != 100)
      this.funkcije.enableDugme('btUbaci');
    else this.funkcije.disableDugme('btUbaci');
  }

  checkPre() {
    var pre = Boolean(this.sastojciForm.controls.pre.value);
   // if (pre)
   //   this.sastojciForm.controls.posle.setValue(false);
   // else this.sastojciForm.controls.posle.setValue(true);

   this.ppre = true;
  this.pposle = false;

    if(Number(this.sastojciForm.controls.masa.value) != 100)
      this.funkcije.enableDugme('btUbaci');
    else this.funkcije.disableDugme('btUbaci');
  }


  dodajNovoJelo() {
    var jn = String(this.jelaForm.controls.naziv.value);
    this.jServis.dodajNovoJelo(jn).subscribe({
      next: (j: Jelo) => {
        this.jelo = j;
        this.funkcije.disableDugmad(['btJelo', 'btUbaci']);
        this.funkcije.enableDugmad(['btPreimenuj','btObrisi']);
        this.ucitajJela();
        this.jelaForm.reset();
      },
      error: async (e) => {
        this.poruka = e.error;
        await this.funkcije.sacekaj(1);
        this.poruka = '';
      },
      complete: () => console.log('uneto novo jelo')
    });
  }


  dodajNamirnicuJelu() {
    var masa = Number(this.sastojciForm.controls.masa.value);
    var pre = Boolean(this.sastojciForm.controls.pre.value)
    this.jServis.dodajNamirnicuJelu(this.jelo.id,
      this.namirnica.id, masa, pre).subscribe({
        next: async (j: Jelo) => {
          this.jelo = j;
          this.prikazNamirnice(new Namirnica);
          this.ucitajNamirniceJela();
          this.ucitajMaseNamirnica();
         this.namirnicaX();

        /*  this.gif = true;
          await this.funkcije.sacekaj(3);
          this.gif = false; */
        },
        error: async (e) => {
          this.poruka = e.error;
          await this.funkcije.sacekaj(1);
          this.poruka = '';
        },
        complete: () => console.log('namirnica ubacena u jelo')
      });

    this.funkcije.disableDugme('btUbaci');
    this.sastojciForm.controls.masa.disable();
    this.sastojciForm.reset();
    this.jeloForm.controls.namirnica.setValue(0);
  }


  masaNamirnice(n: Namirnica): Number {
    var masa = 0;
    this.jServis.masaNamirnice(this.jelo.id, n.id).subscribe({
      next: (m: number) => masa = m
    });

    return masa;
  }


  clickNJ(){
    var sastojci = <HTMLSelectElement>document.getElementById('sSadrzaj');
    var dugmePrikazi = <HTMLButtonElement>document.getElementById('btDetaljiNJ');
    var dugmePM = <HTMLButtonElement>document.getElementById('btMasaNJ');
    var dugmeI = <HTMLButtonElement>document.getElementById('btIzbaciNJ');

    sastojci.addEventListener('click', (event) => {      
      var y =  this.funkcije.pozicija(event.clientY, 430, 620) + "px";  
      dugmePrikazi.style.top = y ;
      dugmePM.style.top = y ;
      dugmeI.style.top = y ;
    });

    this.clickNamirnicuJela();
  
  }

prikazanSastojak = false;
pmSastojka = false;

  staraMasa = 0;
  clickNamirnicuJela() {
    var n = Number(this.jeloForm.controls.namirnica.value);
    this.nServis.nadji(n).subscribe({
      next: (nj: Namirnica) => {
        this.sastojak = nj;
        this.jServis.masaNamirnice(this.jelo.id, nj.id).subscribe({
          next: (m: number) => {
            this.jeloForm.controls.novaMasa.setValue(m);
            this.jeloForm.controls.novaMasa.enable();
            this.staraMasa = m;
          //  this.upisNoveMase();
            this.funkcije.enableDugme('btIzbaci');

            this.vrsta = this.nServis.vrstaNamirnice(nj);
            this.priprema = this.nServis.pripremaNamirnice(nj);
            this.db = this.nServis.dodatoBrasno(nj);
            this.dm = this.nServis.dodataMast(nj);
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
      complete: () => console.log('namirnica prikazana')
    });

  }

  namirnicaJelaX(){
    this.sastojak = new Namirnica();
    this.pmSastojka = false;
    this.prikazanSastojak = false;
    this.jeloForm.reset();
  }

  async izbaciNamirnicuIzJela() {
    var n = Number(this.jeloForm.controls.namirnica.value);
    this.jServis.obrisiNamirnicuIzJela(this.jelo.id, n).subscribe({
      next: (j: Jelo) => {
        this.jelo = j;
        this.ucitajNamirniceJela();
        this.ucitajMaseNamirnica();
        this.funkcije.disableDugmad(['btIzbaci', 'btPm']);
        this.namirnicaJelaX();
      },
      error: (e) => this.poruka = e.error,
      complete: () => console.log('namirnica obrisana iz jela')
    });

    this.funkcije.disableDugmad(['btIzbaci', 'btPm']);
    await this.funkcije.sacekaj(1);
    this.poruka = '';
  }




  promeniMasuNamirnice() {
    var n = Number(this.jeloForm.controls.namirnica.value);
    var m =  Number(this.jeloForm.controls.novaMasa.value);

    this.jServis.promeniMasuNamirnice(this.jelo.id, n, m).subscribe({
      next: (pj: Jelo) => {
        this.jelo = pj;
        this.sastojak = new Namirnica();
        this.namirnicaJelaX();
        this.ucitajNamirniceJela();
        this.ucitajMaseNamirnica();
      },
      error: async (e) => {
        this.poruka = e.error;
        await this.funkcije.sacekaj(1);
        this.poruka = '';
      },
      complete: () => console.log('masa promenjena')
    });

    this.funkcije.disableDugmad(['btIzbaci', 'btPm']);
    this.jeloForm.reset();
  }




  preimenujJelo() {
    var novi = String(this.jeloForm.controls.noviNaziv.value);
    this.jServis.promeniNaziv(this.jelo.id, novi).subscribe({
      next: (j: Jelo) => {
        this.jelo = j;
        this.ucitajJela();
        this.funkcije.enableDugme('btPreimenuj');
        this.promena = false;        
      },
      error: async (e) => {
        this.poruka = e.error;
        await this.funkcije.sacekaj(1);
       // this.poruka = '';
      },
      complete: () => console.log('jelo je preimenovano')
    });
    this.jelaForm.reset();
    this.jeloForm.reset();
  }




  async obrisiJelo() {
    this.jServis.obrisiJelo(this.jelo.id).subscribe({
      next: (odg: string) => {
        this.poruka = odg;
        this.jelo = new Jelo();
        this.funkcije.disableDugmad(['btJelo', 'btPreimenuj', 'btUbaci', 'btPm', 'btObrisi']);
        this.ucitajJela();
      },
      error: (e) => this.poruka = e.error,
      complete: () => console.log('jelo je obrisano')
    });

    await this.funkcije.sacekaj(1);
    this.poruka = '';
  }




  objaviJelo() {
    var objava = new Objava()
    this.jServis.objaviJelo(this.jelo.id).subscribe({
      next: (o: Objava) => {
        objava = o;
        this.poruka = 'Jelo ' + this.jelo.naziv + ' je objavljeno, možeš ga videti među svojim ostalim objavama.';
      },
      error: (e) => this.poruka = e.error,
      complete: () => console.log('jelo je objavljeno')
    });
  }




  proveriN(){   
    if(this.pomeraj < 1)
      this.funkcije.disableDugme('sGoreN');
    else this.funkcije.enableDugme('sGoreN');

    if(this.pomeraj > this.namirnice.length - 19)
      this.funkcije.disableDugme('sDoleN');
    else this.funkcije.enableDugme('sDoleN');
  }

  pomeriNamirniceGore(){
    this.funkcije.enableDugme('sDoleN');
    var sNamirnice = <HTMLSelectElement>document.getElementById('sNamirnice');
    sNamirnice.scrollTop = sNamirnice.scrollTop - 26;
    this.pomeraj--;
    this.proveriN();
  }

  pomeriNamirniceDole(){
    this.funkcije.enableDugme('sGoreN');
    var sNamirnice = <HTMLSelectElement>document.getElementById('sNamirnice');
    sNamirnice.scrollTop = sNamirnice.scrollTop + 26;
    this.pomeraj++;
    this.proveriN();
  }

  pomeriNamirnice(){
    var sNamirnice = <HTMLSelectElement>document.getElementById('sNamirnice');
    sNamirnice.addEventListener('wheel', (event) => {
    var moguce = (this.namirnice.length - 17) * 30;
      this.klizPomeraj = this.klizPomeraj + event.deltaY;

      if(event.deltaY > 0){
        this.funkcije.enableDugme('sGoreN');
        if(this.klizPomeraj > moguce){
            this.funkcije.disableDugme('sDoleN');

          }
        else this.funkcije.enableDugme('sDoleN');
      }
      else{
        this.funkcije.enableDugme('sDoleN');
        if(this.klizPomeraj < -moguce)
          this.funkcije.disableDugme('sGoreN');
        else this.funkcije.enableDugme('sGoreN');
      }
      
    });
  }




}