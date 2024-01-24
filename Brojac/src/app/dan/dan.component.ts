import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { __values } from 'tslib';
import { Router } from '@angular/router';
import { PomocneFunkcije } from '../services/pomocne.funkcije';
import { ObrokServis } from '../services/obrok.servis';
import { Obrok } from '../model/obrok';
import { DanServis } from '../services/dan.servis';
import { Dan } from '../model/dan';
import { TreningServis } from '../services/trening.servis';
import { Trening } from '../model/trening';
import { Izvestaj } from '../model/izvestaj';
import { StanjeServis } from '../services/stanje.servis';
import { Stanje } from '../model/stanje';

@Component({
  selector: 'dan',
  templateUrl: './dan.html',
  styleUrls: ['./dan.css']
})

export class DanComponent implements OnInit {

  constructor(private fb: FormBuilder,
    public funkcije: PomocneFunkcije,
    private router: Router,
    private dServis: DanServis,
    private oServis: ObrokServis,
    private tServis: TreningServis,
    private sServis: StanjeServis) { }


  ngOnInit() {
    this.disableDugmad();
    this.ucitajDane();
    this.ucitajTreninge();
    this.ucitajObroke();

    this.ucitajDanas();

  }



  obrokForm = this.fb.group({
    obrok: [0, [Validators.required]]
  });

  treningForm = this.fb.group({
    trening: [0, [Validators.required]]
  })

  danForm = this.fb.group({
    dan: [0, [Validators.required]],
    treningID: [0, [Validators.required]],
    obrokID: [0, [Validators.required]],
    prijava: [false, [Validators.required]]
  })


  dan = new Dan();
  dani = new Array<Dan>();
  obrok = new Obrok();
  obroci = new Array<Obrok>();
  ubacenObrok = new Obrok();
  ubaceniObroci = new Array<Obrok>();
  trening = new Trening();
  ubacenTrening = new Trening();
  treninzi = new Array<Trening>();
  ubaceniTreninzi = new Array<Trening>();
  izvestaj = new Izvestaj();
  izvestaji = new Array<Izvestaj>();
  poruka = '';
  ubaciNatpis = '';
  izbaciNatpis = '';
  opisTreninga = '';
  opisObroka = '';
  datum = '';
  uputstvoO = 'Označi obrok ako želiš da vidiš detalje, ili da ga ukloniš sa današnjeg spiska.';
  uputstvoT = 'Označi trening ako želiš da vidiš detalje, ili da ga ukloniš sa današnjeg spiska.';
  otvoridane = false;
  dnevneEP = 0;
  unos = 0;
  rezultat = '';
  otvoriizvestaj = false;

  pomerajT = 0;
  pomerajO = 0;
  klizPomerajT = 0;
  klizPomerajO = 0;

  disableDugmad() {
    this.funkcije.disableDugmad(['btReset', 'btIzvestaj', 'oDetalji', 'oDirektno', 'tDetalji', 'tDirektno']);
  }


  async ucitajEnergetskePotrebe() {
    this.sServis.aktuelnoStanje().subscribe({
      next: async (s: Stanje) => {
        this.dnevneEP = Number(s.energetskePotrebe);
        await this.funkcije.sacekaj(0.5);
      },
      error: (e) => this.dnevneEP = 0,
      complete: () => console.log('energetske potrebe su ucitane')
    });
  }

  ucitajObroke() {
    this.oServis.obroci().subscribe({
      next: (o: Obrok[]) => {
        this.obroci = o;
        this.klizPomerajO = 0;
        this.pomerajO = 0;
        this.funkcije.disableDugme('sGoreO');
        if(o.length < 9)
          this.funkcije.disableDugme('sDoleO');
      },
      error: (e) => this.obroci = [],
      complete: () => console.log('obroci ucitani')
    });
  }

  ucitajTreninge() {
    this.tServis.treninzi().subscribe({
      next: (t: Trening[]) => { 
        this.treninzi = t;
        this.klizPomerajT = 0;
        this.pomerajT = 0;
        this.funkcije.disableDugme('sGoreT');
        if(t.length < 9){
          this.funkcije.disableDugme('sDoleT')
        }
      },
      error: (e) => this.treninzi = [],
      complete: () => console.log('ucitani treninzi')
    });
  }

  ucitajDane() {
    this.dServis.dani().subscribe({
      next: (d: Dan[]) => this.dani = d,
      error: (e) => this.dani = [],
      complete: () => console.log('ucitani dani')
    });
  }


  ucitajDanas() {
    this.dServis.danas().subscribe({
      next: async (d: Dan) => {
        this.dan = d;
        if (d.rezultat != 0) {
          await this.ucitajEnergetskePotrebe();
          await this.funkcije.sacekaj(0.5);
          this.ubaceniDanas();
          await this.funkcije.sacekaj(1);
          await this.danasnjiIzvestaj();
          this.funkcije.enableDugme('btIzvestaj');
          this.prikazRezultata();
        }
        else {
          this.unos = 0;
          this.dnevneEP = 0;
        }
        this.datum = this.funkcije.prikaziDatum(d.datum);
        this.danForm.controls.prijava.enable();
        this.funkcije.enableDugme('btReset');
      },
      error: (e) => this.poruka = e.error,
      complete: () => console.log('ucitan danasnji dan')
    });
  }


  prikazRezultata() {
    console.log('dnevne potrebe ' + this.dnevneEP + ', rezultat: ' + this.dan.rezultat);
    this.unos = Math.abs(this.dnevneEP) - Math.abs(Number(this.dan.rezultat));

    if (this.unos == 0)
      this.rezultat = 'Nije uneto ništa: 0 kcal';

    else if (this.unos < this.dnevneEP)
      this.rezultat = 'Uneto je ' + this.unos + ' kcal, što je za ' + Math.abs(Number(this.dan.rezultat)) +
        ' kcal manje od tvojih dnevnih energetskih potreba.';

    else if (this.unos != 0 && this.unos == this.dnevneEP)
      this.rezultat = 'Unos je jednak tvojim dnevnim energetskim potrebama: ' + this.unos + ' kcal.';

    else {
      this.rezultat = 'Uneto je ' + this.unos + ' kcal, što je za '
        + Math.abs(Number(this.dan.rezultat)) + ' više od tvojih dnevnih energetskih potreba.'
    }
  }

  nadjiDan() {
    var dID = Number(this.danForm.controls.dan.value);

    this.dServis.jeLiDanas(dID).subscribe({
      next: (jeste: Boolean) => {
        if(jeste)
          this.ucitajDanas();
        else{
          this.dServis.danPoIDu(dID).subscribe({
            next: async (d: Dan) => {
              this.dan = d;
              this.ubaceniRanije();
              if (d.prijava)
                this.nadjiIzvestaj(d.id);
      
              this.datum = this.funkcije.prikaziDatum(d.datum);
              this.danForm.controls.dan.setValue(0);
              this.danForm.controls.prijava.disable();
              this.funkcije.disableDugme('btReset');
              await this.funkcije.sacekaj(1);
            },
            error: (e) => this.poruka = e.error,
            complete: () => console.log('ucitan dan')
          });
        }
        this.otvoridane = false;
      },
      error: (e) => console.log(e.error),
      complete: () => console.log('provera gotova')
    });

  }


  upisiRezultat() {
    this.dServis.upisiRezultat().subscribe({
      next: async (d: Dan) => this.dan = d,
      error: (e) => this.poruka = e.error,
      complete: () => console.log('upisan rezultat')
    });
  }


  obrisiDan() {
    this.dServis.obrisiDan(this.dan.id).subscribe({
      next: async (odg: string) => {
        this.poruka = odg;

        this.funkcije.sacekaj(0.5);
        this.ucitajDane();

        this.funkcije.sacekaj(0.5);
        this.ucitajDanas();

        this.funkcije.sacekaj(0.5);

        if (this.dan.prijava)
          this.ukljuciIzvestaje();

        this.ucitajIzvestaje();
      },
      error: (e) => this.poruka = e.error,
      complete: () => console.log('obrisan dan')
    });
  }


  ukljuciIzvestaje() {
    this.dServis.ukljuciIzvestaje().subscribe({
      next: async (d: Dan) => {
        this.dan = d;
        await this.danasnjiIzvestaj();
      },
      error: (e) => this.poruka = e.error,
      complete: () => console.log('ukljuceni izvestaji')
    });
  }

  iskljuciIzvestaje() {
    this.dServis.iskljuciIzvestaje().subscribe({
      next: (d: Dan) => {
        this.dan = d;
        this.izvestaj = new Izvestaj();
        this.funkcije.disableDugme('btIzvestaj');
      },
      error: (e) => this.poruka = e.error,
      complete: () => console.log('iskljuceni izvestaji')
    });
  }

  ucitajIzvestaje() {
    this.dServis.izvestaji().subscribe({
      next: (i: Izvestaj[]) => this.izvestaji = i,
      error: (e) => this.poruka = e.error,
      complete: () => console.log('ucitani izvestaji')
    });
  }

  async danasnjiIzvestaj() {
    if (this.dan.prijava) {
      this.dServis.danasnjiIzvestaj().subscribe({
        next: (i: Izvestaj) => this.izvestaj = i,
        error: (e) => {
          this.poruka = e.error;
          this.izvestaj = new Izvestaj();
          this.funkcije.disableDugme('btIzvestaj');
        },
        complete: () => console.log('ucitan danasnji izvestaj')
      });
    }
  }

  nadjiIzvestaj(danID: Number) {
    this.dServis.izvestaj(danID).subscribe({
      next: (i: Izvestaj) => {
        this.izvestaj = i;
        this.funkcije.enableDugme('btIzvestaj');
      },
      error: (e) => {
        this.poruka = e.error;
        this.izvestaj = new Izvestaj();
        this.funkcije.disableDugme('btIzvestaj');
      },
      complete: () => console.log('izvestaj pronadjen')
    });
  }



  opisiObrok(id: Number) {
    this.oServis.opisObroka(id).subscribe({
      next: (opis: string) => this.opisObroka = opis,
      error: (e) => console.log(e.error)
    });
  }





detaljiO = false;
clickPrikaziO(){
  this.funkcije.disableDugmad(['oDetalji', 'oDirektno']);
  this.detaljiO = true;
}

  clickObrok() {
    var oID = Number(this.obrokForm.controls.obrok.value);
    this.oServis.obrokPoIDu(oID).subscribe({
      next: (o: Obrok) => {
        this.obrok = o;
        this.opisiObrok(o.id);
        this.funkcije.enableDugme('oDetalji');

        this.dServis.jeLiDanas(this.dan.id).subscribe({
          next: (jeste: Boolean) => {
            if(jeste){
              this.funkcije.enableDugmad(['btUbaciO', 'oDirektno']);
              this.ubaciNatpis = 'Dodaj ' + o.naziv + ' kao današnji obrok.';
            }
            else{
              this.funkcije.disableDugmad(['btUbaciO', 'oDirektno']);
              this.ubaciNatpis = 'Obrok ' + o.naziv +' se ne može dodati kao obrok dana koji je prošao.';
            }
          }
        });

      },
      error: (e) => this.poruka = e.error,
      complete: () => console.log('odabran obrok')
    });
  }


detaljiT= false;

clickPrikaziT(){
  this.funkcije.disableDugmad(['tDetalji', 'tDirektno']);
  this.detaljiT = true;
}

  opisiTrening(id: Number) {
    this.tServis.opisiTrening(id).subscribe({
      next: (opis: string) => this.opisTreninga = opis,
      error: (e) => console.log(e.error)
    });
  }

  clickTrening() {
    var tID = Number(this.treningForm.controls.trening.value);
    this.tServis.treningPoIDu(tID).subscribe({
      next: (t: Trening) => {
        this.trening = t;
        this.opisiTrening(t.id);       
        this.funkcije.enableDugme('tDetalji');

        this.dServis.jeLiDanas(this.dan.id).subscribe({
          next: (jeste: Boolean) => {
            if(jeste){
              this.funkcije.enableDugmad(['btUbaciT', 'tDirektno']);
              this.ubaciNatpis = 'Dodaj ' + t.naziv + ' kao današnji trening.';
            }
            else{
              this.funkcije.disableDugmad(['btUbaciT', 'tDirektno']);
              this.ubaciNatpis = 'Trening ' + t.naziv +' se ne može dodati kao trening dana koji je prošao.';
            }
          }
        });
               
        this.funkcije.enableDugmad(['btUbaciT','tDetalji', 'tDirektno']);
        this.ubaciNatpis = 'Dodaj ' + t.naziv + ' kao današnji trening.';
      },
      error: (e) => this.poruka = e.error,
      complete: () => console.log('odabran trening')
    });
  }


  ubaciObrok() {
    this.oServis.dodajObrokDanas(this.obrok.id).subscribe({
      next: (o: Obrok) => {
        this.obrokX();
        this.ucitajDanas();
      },
      error: (e) => console.log(e.error),
      complete: () => console.log('ubacen obrok, complete')
    });
  }



  ubaciTrening() {
    this.tServis.dodajTreningDanas(this.trening.id).subscribe({
      next: (t: Trening) => {
        this.treningX();
        this.ucitajDanas();
      },
      error: (e) => this.poruka = e.error,
      complete: () => console.log('ubacen trening danas')
    });
  }


  bezObroka = '';
  bezTreninga = '';
  titlObrok = 'Označi obrok koji te zanima, ili želiš da ukloniš sa današnjeg spiska.';
  titlTrening = 'Označi trening koji te zanima, ili želiš da ukloniš sa današnjeg spiska.';

  ubaceniDanas() {

    this.oServis.danasnjiObroci().subscribe({
      next: (o: Obrok[]) => {
        if (o.length == 0) {
          this.ubaceniObroci = [];
          this.bezObroka = 'Još uvek nema današnjih obroka.';
          this.titlObrok = 'Ubaci obroke danas.';
        }
        else {
          this.ubaceniObroci = o;
          this.funkcije.enableDugme('btReset');
          this.titlObrok = 'Označi obrok koji te zanima, ili želiš da ukloniš sa današnjeg spiska.';
          this.bezObroka = '';
        }
      },
      error: (e) => {
        this.bezObroka = 'Došlo je do greške.';
        this.ubaceniObroci = [];
        this.titlObrok = '';
      },
      complete: () => console.log('danasnji obroci')
    });

    this.tServis.danasnjiTreninzi().subscribe({
      next: (t: Trening[]) => {
        if (t.length == 0) {
          this.ubaceniTreninzi = [];
          this.bezTreninga = 'Još uvek nema današnjih treninga.';
          this.titlTrening = 'Ubaci trening danas.';
        }
        else {
          this.ubaceniTreninzi = t;
          this.funkcije.enableDugme('btReset');
          this.titlTrening = 'Označi trening koji te zanima, ili želiš da ukloniš sa današnjeg spiska.';
          this.bezTreninga = '';
        }
      },
      error: (e) => {
        this.bezTreninga = 'Došlo je do greške.';
        this.ubaceniTreninzi = [];
        this.titlTrening = '';
      },
      complete: () => console.log('danasnji treninzi')
    });

    this.uputstvoO = 'Označi obrok ako želiš da vidiš detalje, ili da ga ukloniš sa današnjeg spiska.';
    this.uputstvoT = 'Označi trening ako želiš da vidiš detalje, ili da ga ukloniš sa današnjeg spiska.';

  }



  ubaceniRanije() {
    this.oServis.obrociDana(this.dan.id).subscribe({
      next: (o: Obrok[]) => {
        this.ubaceniObroci = o;
        this.bezObroka = '';
        this.titlObrok = 'Za prikaz detalja, označi obrok koji te zanima.';
        this.uputstvoO = 'Označi obrok odabranog dana ako želiš da vidiš detalje.';
      },
      error: (e) => {
        this.bezObroka = e.error;
        this.ubaceniObroci = [];
        this.titlObrok = '';
      },
      complete: () => console.log('obroci nekog dana')
    });

    this.tServis.treninziDana(this.dan.id).subscribe({
      next: (t: Trening[]) => {
        this.ubaceniTreninzi = t;
        this.bezTreninga = '';
        this.titlTrening = 'Za prikaz detalja, označi trening koji te zanima.';
        this.uputstvoT = 'Označi trening izabranog dana ako želiš da vidiš detalje.';
      },
      error: (e) => {
        this.bezTreninga = e.error;
        this.ubaceniTreninzi = [];
        this.titlTrening = '';
      },
      complete: () => console.log('treninzi nekog dana')
    });


  }



  izbaciObrok() {
    this.oServis.obrisiDanasnjiObrok(this.ubacenObrok.id).subscribe({
      next: (odg: string) => {
        console.log(odg);
        this.ubacenObrok = new Obrok();
        this.danForm.controls.dan.setValue(Number(this.dan.id));
        this.ucitajDanas();
        this.ubacenObrokX();
      },
      error: (e) => this.poruka = e.error,
      complete: () => console.log('obrok izbacen')
    });
  }

  izbaciTrening() {
    this.tServis.obrisiDanasnjiTrening(this.ubacenTrening.id).subscribe({
      next: (odg: string) => {
        console.log(odg);
        this.ubacenTrening = new Trening();
        this.danForm.controls.dan.setValue(Number(this.dan.id));
        this.ucitajDanas();
        this.ubacenTreningX();
      },
      error: (e) => this.poruka = e.error,
      complete: () => console.log('trening izbacen')
    });
  }




  pozicijaUO(){
    var ubaceni = <HTMLSelectElement> document.getElementById('uo');
    var p = <HTMLButtonElement>document.getElementById('uoIzbaci');
    var d = <HTMLButtonElement> document.getElementById('uoPrikazi');
    ubaceni.addEventListener('click', (event) => {
      var y =  this.funkcije.pozicija(event.clientY, 390, 505);      
      p.style.top = y + "px";
      d.style.top = y + "px";
    });
  }

  pozicijaUT(){
    var ubaceni = <HTMLSelectElement> document.getElementById('ut');
    var p = <HTMLButtonElement>document.getElementById('utIzbaci');
    var d = <HTMLButtonElement> document.getElementById('utPrikazi');
    ubaceni.addEventListener('click', (event) => {
      var y = this.funkcije.pozicija(event.clientY, 545, 624);   
      p.style.top = y + "px";
      d.style.top = y + "px";
    });
  }



detaljiUO = false;
  clickUbacenObrok() {
    var oID = Number(this.danForm.controls.obrokID.value);
    if(oID > 0)
      this.pozicijaUO();
    
      this.oServis.obrokPoIDu(oID).subscribe({
      next: (o: Obrok) => {
        this.ubacenObrok = o;
        this.opisiObrok(o.id);

        this.dServis.jeLiDanas(this.dan.id).subscribe({
          next: (jeste: Boolean) => {
            if (jeste) {
              this.funkcije.enableDugmad(['btIzbaciO', 'uoIzbaci', 'uoPrikazi']);
              this.izbaciNatpis = 'Ukloni obrok ' + o.naziv + ' iz današnjih obroka.';
            }
            else{
              this.funkcije.disableDugmad(['btIzbaciO', 'uoIzbaci']);
              this.izbaciNatpis = 'Obrok ' + o.naziv + ' se ne može izbaciti sa spiska unetih obroka dana koji je prošao.';
            }
          }
        });

      },
      error: (e) => this.poruka = e.error,
      complete: () => console.log('odabran obrok')
    });
  }


  clickPrikaziUO(){
    this.funkcije.disableDugmad(['uoIzbaci', 'uoPrikazi']);
    this.detaljiUO = true;
  }

  detaljiUT = false;
  clickUbacenTrening() {    
    var tID = Number(this.danForm.controls.treningID.value);
      this.pozicijaUT();

    this.tServis.treningPoIDu(tID).subscribe({
      next: (t: Trening) => {
        this.ubacenTrening = t;
        this.opisiTrening(t.id);
        this.pozicijaUT();

        this.dServis.jeLiDanas(this.dan.id).subscribe({
          next: (jeste: Boolean) => {
            if (jeste){
              this.funkcije.enableDugmad(['btIzbaciT', 'utIzbaci', 'utPrikazi']);
              this.izbaciNatpis = 'Ukloni trening ' + t.naziv + ' iz današnjih treninga.';
            }                        
            else{
              this.funkcije.disableDugmad(['btIzbaciT', 'utIzbaci']);
              this.izbaciNatpis = 'Trening ' + t.naziv + ' se ne može izbaciti sa spiska treninga dana koji je prošao.';
            }
          }
        });

      },
      error: (e) => this.poruka = e.error,
      complete: () => console.log('odabran trening')
    });
  }

  clickPrikaziUT(){
    this.funkcije.disableDugmad(['utIzbaci', 'utPrikazi']);
    this.detaljiUT = true;
  }



  checkPrijava() {
    if (this.dan.prijava)
      this.iskljuciIzvestaje();
    else
      this.ukljuciIzvestaje();

  }

  clickIzvestaj() {
    this.danasnjiIzvestaj();
    this.funkcije.disableDugme('btIzvestaj');
    this.otvoriizvestaj = true;
  }

  clickIzvestajX() {
    this.funkcije.enableDugme('btIzvestaj');
    this.otvoriizvestaj = false;
  }



  obrokX() {
    this.obrok = new Obrok();
    this.obrokForm.controls.obrok.setValue(0);
    this.funkcije.disableDugmad(['btUbaciO', 'oDirektno', 'oDetalji']);
    this.detaljiO = false;
    this.ubaciNatpis = 'Moraš prvo odabrati obrok ili trening koji želiš da dodaš kao današnji.';
  }

  treningX() {
    this.trening = new Trening();
    this.treningForm.controls.trening.setValue(0);
    this.funkcije.disableDugmad(['btUbaciT', 'tDirektno', 'tDetalji']);
    this.detaljiT = false;
    this.ubaciNatpis = 'Moraš prvo odabrati obrok ili trening koji želiš da dodaš kao današnji.';
  }

  ubacenObrokX() {
    this.ubacenObrok = new Obrok();
    this.danForm.controls.obrokID.setValue(0);
    this.funkcije.disableDugme('btIzbaciO');
    this.funkcije.enableDugmad(['uoIzbaci', 'uoPrikazi']);
    this.detaljiUO = false;
  }

  ubacenTreningX() {
    this.ubacenTrening = new Trening();
    this.danForm.controls.treningID.setValue(0);
    this.funkcije.disableDugme('btIzbaciT');
    this.funkcije.enableDugmad(['utIzbaci', 'utPrikazi']);
    this.detaljiUT = false;
  }



  proveriO(){   
    if(this.pomerajO < 1)
      this.funkcije.disableDugme('sGoreO');
    else this.funkcije.enableDugme('sGoreO');

    if(this.pomerajO > this.obroci.length - 10)
      this.funkcije.disableDugme('sDoleO');
    else this.funkcije.enableDugme('sDoleO');
  }


  pomeriObrokeGore(){
    this.funkcije.enableDugme('sDoleO');
    var sObroci = <HTMLSelectElement>document.getElementById('sObroci');
    sObroci.scrollTop = sObroci.scrollTop - 30;
    this.pomerajO--;
    this.proveriO();
  }

  pomeriObrokeDole(){
    this.funkcije.enableDugme('sGoreO');
    var sObroci = <HTMLSelectElement>document.getElementById('sObroci');
    sObroci.scrollTop = sObroci.scrollTop + 30;
    this.pomerajO++;
    this.proveriO();
  }

  pomeriObroke(){
    var sObroci = <HTMLSelectElement>document.getElementById('sObroci');
    sObroci.addEventListener('wheel', (event) => {
    var moguce = (this.obroci.length - 9) * 30;
      this.klizPomerajO = this.klizPomerajO + event.deltaY;
      console.log('moguc pomeraj: ' + moguce +', pomeraj: ' + this.klizPomerajO);

      if(event.deltaY > 0){
        this.funkcije.enableDugme('sGoreO');
        if(this.klizPomerajO > moguce){
            this.funkcije.disableDugme('sDoleO');

          }
        else this.funkcije.enableDugme('sDoleO');
      }
      else{
        this.funkcije.enableDugme('sDoleO');
        if(this.klizPomerajO < -moguce)
          this.funkcije.disableDugme('sGoreO');
        else this.funkcije.enableDugme('sGoreO');
      }
      
    });
  }


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


}

