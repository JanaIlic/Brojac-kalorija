import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { __values } from 'tslib';

import { RouterModule, Routes, Route, TitleStrategy } from '@angular/router';

import { Korisnik } from '../model/korisnik';
import { KorisnikServis } from '../services/korisnik.servis';
import { Stanje } from '../model/stanje';
import { StanjeServis } from '../services/stanje.servis';
import { PomocneFunkcije } from '../services/pomocne.funkcije';
import { AktivnostServis } from '../services/aktivnost.servis';
import { Aktivnost } from '../model/aktivnost';

@Component({
    selector: 'stanje',
    templateUrl: './stanje.html',
    styleUrls: ['./stanje.css']
})

export class StanjeComponent implements OnInit {

    constructor(public funkcije: PomocneFunkcije, private fb: FormBuilder,
        private sServis: StanjeServis, private kServis: KorisnikServis,
        private aServis: AktivnostServis) { }

    @Output() prosledi = new EventEmitter();

    ngOnInit() {
        this.ucitajStanja();
        this.ucitajVremena();
        this.ucitajAktivnosti();
        this.funkcije.disableDugmad(['btAktivnost', 'btCilj', 'btPeriod', 'btSacuvaj']);

    }



    stanja = new Array<Stanje>;
    stanje = new Stanje;
    poruka = '';
    pretraga = false;
    aktivnosti = new Array<Aktivnost>;


    traziStanjeForm = this.fb.group({
        datum: [new Stanje, [Validators.required]]
    })


    visinaForm = this.fb.group({
        visina: [this.stanje.visina, [Validators.required]]
    })


    tezinaForm = this.fb.group({
        tezina: [this.stanje.tezina, [Validators.required]]
    })

    ciljForm = this.fb.group({
        cilj: [this.stanje.ciljnaKilaza, [Validators.required]],
        period: [0, [Validators.required]]
    })


    ntForm = this.fb.group({
        aktivnost: [{ value: 0, disabled: true }, [Validators.required]],
        sati: [{ value: 0, disabled: true }, [Validators.required]],
        minuti: [{ value: 0, disabled: true }, [Validators.required]]
    })

    brisanjeForm = this.fb.group({})

    suma = 0;
    vreme = 0;
    ukupnoVreme = 0;
    sati = new Array<number>;
    minuti = new Array<number>;
    aktivnost = false;
    aktStanje = false;
    

    brisanjeforma = false;
    visinaforma = false;
    tezinaforma = false;
    ciljforma = false;
    novo = false;


    disableDugmad() {
        var dugmad = ['btA', 'btN', 'btPV', 'btPT', 'btPC', 'btP', 'btB'];
        this.funkcije.disableDugmad(dugmad);
    }


    enableDugmad() {
        var dugmad = ['btA','btN', 'btPV', 'btPT', 'btPC', 'btP', 'btB'];
        this.funkcije.enableDugmad(dugmad);
    }

    clickNovo() {
        this.aktivnost = true;
        this.novo = true;
        this.ntForm.controls.aktivnost.enable();
        this.ntForm.controls.sati.enable();
        this.ntForm.controls.minuti.enable();
        this.spisak = [];
        this.disableDugmad();
    }

    clickPV() {
        this.visinaforma = true;
        if (this.stanje.id != 0)
            this.visinaForm.controls.visina.enable();
        if (this.stanje.id == 0)
            this.unetaVisina();
        this.disableDugmad();
        this.funkcije.disableDugme('btSacuvajV');
    }

    clickPT() {
        this.tezinaforma = true;
        this.tezinaForm.controls.tezina.enable();
        if (this.stanje.id != 0)
            this.unetaTezina();
        this.disableDugmad();
        this.funkcije.disableDugme('btSacuvajT');
    }

    clickPC() {
        this.ciljforma = true;
        this.ciljForm.controls.cilj.enable();
        if (this.stanje.id != 0)
            this.unetCilj();

        this.disableDugmad();
    }



    clickA() {
        this.aktStanje = true;        
        this.disableDugmad();
         //   this.funkcije.enableDugme('btA');
        
    }

    zatvoriA(){
        this.aktStanje = false;
        this.enableDugmad();
    }

    clickPretraga() {
        this.pretraga = true;
        this.disableDugmad();
    }


    unetaVisina() {
        var visina = Number(this.visinaForm.controls.visina.value);
        if ((visina > 100 && visina < 230) || visina == this.stanje.visina)
            this.funkcije.enableDugme('btSacuvajV');
    }

    unetaTezina() {
        var tezina = Number(this.tezinaForm.controls.tezina.value);
        if ((tezina > 30 && tezina < 250) || tezina == this.stanje.tezina)
            this.funkcije.enableDugme('btSacuvajT');
    }


    clickTezinaX() {
        this.tezinaforma = false;
        this.tezinaForm.disable();
        this.enableDugmad();
    }

    clickVisinaX() {
        this.visinaforma = false;
        this.visinaForm.disable();
        this.enableDugmad();
    }

    clickCiljX() {
        this.ciljforma = false;
        this.ciljForm.disable();
        this.enableDugmad();
    }


    clickBrisanjeX() {
        this.brisanjeforma = false;
        this.brisanjeForm.reset();
        this.brisanjeForm.disable();
        this.enableDugmad();
    }


    clickPretragaX() {
        this.pretraga = false;
        this.enableDugmad();
        this.traziStanjeForm.reset();
    }

    clickNtX() {
        this.aktivnost = false;
        this.ntForm.reset();
        this.ntForm.disable();
        this.novo = false;
        this.enableDugmad();
    }

    upisiSate() {
        this.vreme = Number(this.ntForm.controls.sati.value);
        console.log('sati: ' + this.vreme);
        this.funkcije.enableDugme('btAktivnost');
    }

    upisiMinute() {
        this.vreme += Number(this.ntForm.controls.minuti.value) / 60;
        this.funkcije.enableDugme('btAktivnost');
    }


    spisak = new Array<String>();
    dodajNaSpisak(dodatak: String) {
        this.spisak.push(dodatak);
    }

    dnevnaAktivnost = new Aktivnost();
    nadjiAktivnost() {
        var aID = Number(this.ntForm.controls.aktivnost.value);
        this.aServis.aktivnostPoIDu(aID).subscribe({
            next: (a: Aktivnost) => this.dnevnaAktivnost = a,
            error: (e) => console.log('aktivnost uciana ' + e.error),
            complete: () => console.log('ucitana aktivvnost: ' + this.dnevnaAktivnost.naziv)
        });
    }


    async upisiAktivnost() {
        this.nadjiAktivnost();
        await this.funkcije.sacekaj(0.5);
        var nivo = this.dnevnaAktivnost.nivoTezine;

        if (this.ukupnoVreme + this.vreme >= 24) {
            this.vreme = 24 - this.ukupnoVreme;
            this.ukupnoVreme = 24;
            this.suma += nivo * this.vreme;

            this.ntForm.controls.sati.disable();
            this.ntForm.controls.minuti.disable();
            this.funkcije.enableDugme('btSacuvaj');
        }
        else {
            this.suma += nivo * this.vreme;
            this.ukupnoVreme += this.vreme;
            this.ucitajVremena();
        }

        if (this.vreme == 1)
            this.dodajNaSpisak('- ' + this.dnevnaAktivnost.naziv + ': 1 sat;');
        else if (this.vreme > 1 && this.vreme < 5)
            this.dodajNaSpisak('- ' + this.dnevnaAktivnost.naziv + ': ' + this.vreme + ' sata;');
        else this.dodajNaSpisak('- ' + this.dnevnaAktivnost.naziv + ': ' + this.vreme + ' sati;');


        this.ntForm.controls.aktivnost.setValue(0);
        this.ntForm.controls.sati.setValue(0);
        this.ntForm.controls.minuti.setValue(0);
        this.funkcije.disableDugme('btAktivnost');
        this.vreme = 0;
    }

    ucitajAktivnosti() {
        this.aServis.aktivnosti().subscribe({
            next: (a: Aktivnost[]) => this.aktivnosti = a,
            error: (e) => this.poruka = e.error,
            complete: () => console.log('ucitane aktivnosti')
        });
    }

    ucitajVremena() {
        this.sati = [];
        for (let i = 1; i < (25 - this.ukupnoVreme); i++)
            this.sati.push(i);

        this.minuti = [10, 20, 30, 40, 50];
        console.log('vremena su ucitana ');
    }

    nivo = 0;
    async sacuvajNivo() {
        this.nivo = this.suma / 24;
        console.log('nivo: ' + this.nivo);
        this.suma = 0;
        this.ukupnoVreme = 0;
        this.ntForm.disable();
        this.funkcije.disableDugme('btAktivnost');
        this.funkcije.disableDugme('btSacuvaj');
        this.funkcije.disableDugme('btPeriod');
        await this.funkcije.sacekaj(1);
        this.aktivnost = false;
        this.ntForm.disable();

        await this.funkcije.sacekaj(0.5);
        this.clickPV();
    }


    bmi = '';
    prikazBmi() {
        this.sServis.prikazBmi(this.stanje.id).subscribe({
            next: (odg: String) => this.bmi = String(odg),
            error: (e) => console.log('greska, prikaz bmi ' + e.error)
        });

    }

    ucitajStanja() {
        this.sServis.stanja().subscribe({
            next: (s: Stanje[]) => {
                this.stanja = s;
                if (s.length > 0)
                    this.aktuelnoStanje();
                else this.prosledi.emit();
            },
            error: (e) => this.poruka = e.error,
            complete: () => console.log('stanja su ucitana')
        });
    }

    aktuelnoStanje() {
        this.sServis.aktuelnoStanje().subscribe({
            next: (s: Stanje) => {
                this.stanje = s;
                this.prikazBmi();
                this.visinaForm.controls.visina.setValue(s.visina);
                this.tezinaForm.controls.tezina.setValue(s.tezina);
                if (Number(s.ciljnaKilaza) > 0)
                    this.ciljForm.controls.cilj.setValue(s.ciljnaKilaza);
            },
            error: (e) => this.poruka = e.error,
            complete: () => console.log('aktuelno stanje je ucitano')
        });
    }


    nadjiStanje() {
        this.sServis.stanjePoIDu(Number(this.traziStanjeForm.controls.datum.value)).subscribe({
            next: async (s: Stanje) => {
                this.stanje = s;
                this.prikazBmi();
                var d = new Date(s.datum);
                var mesec = d.getMonth() + 1;
                d.setMonth(mesec);
                this.stanje.datum = d;
                this.clickA();
                await this.funkcije.sacekaj(1);
                this.pretraga = false;
            },
            error: (e) => console.log(e.error)
        });
    }


    upisiStanje() {
        var visina = Number(this.visinaForm.controls.visina.value);
        var tezina = Number(this.tezinaForm.controls.tezina.value);
        this.sServis.upisiStanje(visina, tezina, this.nivo).subscribe({
            next: async (odg: Stanje) => {
                this.stanje = odg,
                    this.novo = false;
                this.aktuelnoStanje();
                this.funkcije.sacekaj(0.5);
                this.aktivnost = false;
                this.ntForm.disable();
                this.prosledi.emit();
                this.clickPC();
            },
            error: (e) => this.poruka = e,
            complete: () => console.log('stanje upisano')
        });

    }


    async promeniVisinu() {
        var visina = Number(this.visinaForm.controls.visina.value);

        if (!this.novo) {
            this.sServis.promeniVisinu(visina).subscribe({
                next: async (s: Stanje) => {
                    this.stanje = s;
                    this.visinaForm.controls.visina.disable();
                    await this.funkcije.sacekaj(1);
                    this.clickVisinaX();
                    this.aktuelnoStanje();
                    this.enableDugmad();
                    this.prosledi.emit();
                },
                error: (e) => this.poruka = e.error,
                complete: () => console.log('visina je promenjena')
            });

        }
        else {
            this.stanje.visina = visina;
            this.clickVisinaX();
            await this.funkcije.sacekaj(1);
            this.clickPT();
        }
    }


    async promeniTezinu() {
        var tezina = Number(this.tezinaForm.controls.tezina.value);
        if (!this.novo) {
            this.sServis.promeniTezinu(tezina).subscribe({
                next: async (s: Stanje) => {
                    this.stanje = s;
                    this.tezinaForm.controls.tezina.disable();
                    await this.funkcije.sacekaj(1);
                    this.clickTezinaX();
                    this.aktuelnoStanje();
                    this.enableDugmad();
                    this.prosledi.emit();
                },
                error: (e) => this.poruka = e.error,
                complete: () => console.log('tezina je promenjena')
            });
        }
        else {
            this.stanje.tezina = tezina;
            await this.funkcije.sacekaj(1);
            this.clickTezinaX();
            this.upisiStanje();
        }
    }


    unetCilj() {
        var cilj = String(this.ciljForm.controls.cilj.value);
        if ((cilj.length > 1 && cilj.length < 6) || cilj == this.stanje.ciljnaKilaza.toString())
            this.funkcije.enableDugme('btCilj');
    }


    zadajCilj() {
        var cilj = Number(this.ciljForm.controls.cilj.value);
        this.sServis.zadajCilj(cilj).subscribe({
            next: (s: string) => {
                this.poruka = s;
                this.aktuelnoStanje();
                this.ponudiPeriode();
                this.ciljForm.controls.cilj.disable();
                this.funkcije.disableDugme('btCilj');
                this.ciljForm.controls.period.enable();
            },
            error: (e) => this.poruka = e.error,
            complete: () => console.log('ciljna kilaza je upisana')
        });
    }

    periodi = new Array<string>;
    ponudiPeriode() {
        this.sServis.ponudiPeriode().subscribe({
            next: (s: string[]) => {
                this.periodi = s;
                console.log('ucitani periodi: ' + s)
            },
            error: (e) => this.poruka = e.error,
            complete: () => console.log('periodi: ')
        });
    }

    odabranPeriod = 0;
    parsirajPeriod() {
        this.sServis.parsirajPeriod(String(this.ciljForm.controls.period.value)).subscribe({
            next: (n: number) => {
                this.odabranPeriod = n;
                this.funkcije.enableDugme('btPeriod');
            },
            error: (e) => this.poruka = e,
            complete: () => console.log('period je ' + this.odabranPeriod)
        });
    }

    zadajVreme() {
        this.sServis.zadajVreme(this.odabranPeriod).subscribe({
            next: async (s: string) => {
                this.poruka = s;
                this.ciljForm.controls.period.disable();
                await this.funkcije.sacekaj(1);
                this.clickCiljX();
                this.aktuelnoStanje();
                this.enableDugmad();
                if (this.novo)
                    this.novo = false;
            },
            error: (e) => this.poruka = e.error,
            complete: () => console.log('vreme za ostvarenje cilja je upisano')
        });

    }


    clickObrisiStanje() {
        this.disableDugmad();
        this.brisanjeforma = true;
    }


    obrisiStanje() {
        this.sServis.obrisiStanje().subscribe({
            next: async (s: string) => {
                this.poruka = s;
                await this.funkcije.sacekaj(0.5);
                this.brisanjeforma = false;
                this.stanje = new Stanje();
                this.ucitajStanja();
                this.enableDugmad();
                // this.aktuelnoStanje();
            },
            error: (e) => this.poruka = e.error,
            complete: () => console.log('stanje je obrisano')
        });
    }









}