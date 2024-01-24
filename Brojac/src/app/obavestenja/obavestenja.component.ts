
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { PomocneFunkcije } from '../services/pomocne.funkcije';
import { Router } from '@angular/router';
import { DanServis } from '../services/dan.servis';
import { ZahtevAktivnostiServis } from '../services/z.aktivnosti.servis';
import { ZahtevNamirniceServis } from '../services/z.namirnice.servis';
import { ZahtevZaPracenjeServis } from '../services/z.pracenje.servis';
import { Izvestaj } from '../model/izvestaj';
import { RezultatZahteva } from '../model/rezultat.zahteva';
import { Observable } from 'rxjs';
import { style } from '@angular/animations';


@Component({
    selector: 'obavestenja',
    templateUrl: './obavestenja.html',
    styleUrls: ['./obavestenja.css']
})



export class ObavestenjaComponent implements OnInit {

    constructor(private fb: FormBuilder,
        private funkcije: PomocneFunkcije,
        private router: Router,
        private dServis: DanServis,
        private zServis: ZahtevAktivnostiServis) { }




    ngOnInit() {
            this.funkcije.disableDugmad(['izGore','rezGore']);
            this.dnevniIzvestaji();
            this.rezultatiZahteva();
    }

    izbor = false;
    prikaz = false;
    iz = false;
    rezultati = new Array<RezultatZahteva>();
    izvestaji = new Array<String>;
    greska = '';


    clickIzbor(o: Number) {
        this.prikaz = !this.prikaz;
        this.izbor = false;
        this.funkcije.disableDugme('btO');
        if (o == 0) {
            this.dnevniIzvestaji();
            this.iz = true;
        }
        else {
            this.rezultatiZahteva();
            this.iz = false;
        }

    }


    dnevniIzvestaji() {
        this.dServis.prikazIzvestaja().subscribe({
            next: (i: String[]) =>{ 
                this.izvestaji = i;
                this.klizIz = 0;
                this.pomerajIz = 0;
            },
            error: (e) => this.greska = e.error,
            complete: () => console.log('ucitan prikaz izvestaja')
        });
    }

    rezultatiZahteva() {
        this.zServis.rezultatiZahteva().subscribe({
            next: (r: RezultatZahteva[]) => {
                this.rezultati = r;
                this.klizRez = 0;
                this.pomerajRez = 0;
            },
            error: (e) => this.greska = e.error,
            complete: () => console.log('rezultati ucitani')
        });
    }



    prikazRezultata(o: String): String[] {
        var redovi = new Array<String>();
        redovi = o.split('-');
        return redovi;
    }



    clickX(){
        this.prikaz = false;
        this.funkcije.enableDugme('btO');

        this.pomerajIz = 0;
        this.pomerajRez = 0;
        this.klizIz = 0;
        this.klizRez = 0;

        this.dnevniIzvestaji();
        this.rezultatiZahteva();
    }



    pomerajIz = 0;
    klizIz = 0;

    pomeriIzvestajeGore(){
      this.funkcije.enableDugme('izDole');
        var ul= <HTMLUListElement>document.getElementsByClassName('uIzvestaji')[0];
        ul.scrollTop = ul.scrollTop - 130;
        this.pomerajIz--;
        this.proveriIzvestaje();
    }

    pomeriIzvestajeDole(){
        this.funkcije.enableDugme('izGore');
        var ul= <HTMLUListElement>document.getElementsByClassName('uIzvestaji')[0];
        ul.scrollTop = ul.scrollTop + 130;
        this.pomerajIz++;
        this.proveriIzvestaje();
    }

    proveriIzvestaje(){
      console.log('pomeraj u koracima: ' + this.pomerajIz);

      if(this.pomerajIz < 0)
        this.funkcije.disableDugme('izGore');
      else this.funkcije.enableDugme('izGore');
  
      if(this.pomerajIz > this.izvestaji.length - 4)
        this.funkcije.disableDugme('izDole');
      else this.funkcije.enableDugme('izDole');
    }

    pomeriIzvestaje(){
        var ul= <HTMLUListElement>document.getElementsByClassName('uIzvestaji')[0];
        ul.addEventListener('wheel', (event) => {
          var moguce = (this.izvestaji.length -4) * 6155; 
          this.klizIz = this.klizIz + event.deltaY;

         if(event.deltaY > 0){
            this.funkcije.enableDugme('izGore');
            if(this.klizIz > moguce)
              this.funkcije.disableDugme('izDole');
            else this.funkcije.enableDugme('izDole');
          }
          else{
            this.funkcije.enableDugme('izDole');
            if(this.klizIz < -moguce)
              this.funkcije.disableDugme('izGore');
            else this.funkcije.enableDugme('izGore');
          } 
          
        }); 
    }

    pomerajRez = 0;
    klizRez = 0;

    pomeriRezultateGore(){
      this.funkcije.enableDugme('rezDole');
        var ul= <HTMLUListElement>document.getElementsByClassName('uRezultati')[0];
        ul.scrollTop = ul.scrollTop - 150;
        this.pomerajRez--;
        this.proveriRezultate();
    }


    pomeriRezultateDole(){
        this.funkcije.enableDugme('rezGore');
        var ul= <HTMLUListElement>document.getElementsByClassName('uRezultati')[0];
        ul.scrollTop = ul.scrollTop + 150;
        this.pomerajRez++;
        this.proveriRezultate();
    }

    proveriRezultate(){
        if(this.pomerajRez < 0)
        this.funkcije.disableDugme('rezGore');
      else this.funkcije.enableDugme('rezGore');
  
      if(this.pomerajRez > this.rezultati.length - 4)
        this.funkcije.disableDugme('rezDole');
      else this.funkcije.enableDugme('rezDole');
    }

    pomeriRezultate(){
        var ul= <HTMLUListElement>document.getElementsByClassName('uRezultati')[0];
        ul.addEventListener('wheel', (event) => {
          var moguce = this.rezultati.length*150 - 550;
          this.klizRez = this.klizRez + event.deltaY;
    
          if(event.deltaY > 0){
            this.funkcije.enableDugme('rezGore');
            if(this.klizRez > moguce)
                this.funkcije.disableDugme('rezDole');
            else this.funkcije.enableDugme('rezDole');
          }
          else{
            this.funkcije.enableDugme('rezDole');
            if(this.klizRez < -moguce)
              this.funkcije.disableDugme('rezGore');
            else this.funkcije.enableDugme('rezGore');
          }
          
        });
    }

}
