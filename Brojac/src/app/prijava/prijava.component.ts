import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { __values } from 'tslib';
import { Observable, of, throwError } from 'rxjs';

import { Korisnik } from '../model/korisnik';
import { KorisnikServis } from '../services/korisnik.servis';
import { AdminServis } from '../services/admin.servis';
import { RouterLink, Router } from '@angular/router';
import { PomocneFunkcije } from '../services/pomocne.funkcije';
import { HttpErrorResponse } from '@angular/common/http';
import { DanServis } from '../services/dan.servis';


@Component({
  selector: 'prijava',
  templateUrl: './prijava.html',
  styleUrls: ['./prijava.css']
})



export class PrijavaComponent {
  title = 'Brojac';

  constructor(private fb: FormBuilder,
    private router: Router,
    private funkcije: PomocneFunkcije,
    private korisnikServis: KorisnikServis,
    private adminServis: AdminServis,
    private danServis: DanServis) { }


ngOnInit(){
 this.funkcije.disableDugme('btPrijaviSe');
}


  prijavaForm = this.fb.group({
    ime: ['', [Validators.required]],
    sifra: ['', [Validators.required]],
    obicanKorisnik: [true, [Validators.required]],
    adminAA: [false, [Validators.required]],
    adminAN: [false, [Validators.required]]
  })


  poruka = '';
  greska = '';

  prikazi: boolean = false;
  natpis = '👀 Prikaži šifru.'

  prikaziSifru() {
    this.prikazi = !this.prikazi;

    if (this.prikazi == false)
      this.natpis = '👀 Prikaži šifru.';
    else
      this.natpis = '🙈 Sakrij šifru.';
  }


  proveriIme(): boolean {
    if (this.prijavaForm.controls.ime.valid)
      return true;
    else
      return false;
  }

  proverSifru(): boolean {
    if (this.prijavaForm.controls.sifra.valid)
      return true;
    else
      return false;
  }


  aa = false;
  checkAA() {
    this.aa = !this.aa;
    if (this.aa) {
      this.prijavaForm.controls.obicanKorisnik.setValue(false);
      this.prijavaForm.controls.adminAN.setValue(false);
      this.an = false;
      this.funkcije.enableDugme('btPrijaviSe');
    }
  }

  an = false;
  checkAN() {
    this.an = !this.an;
    if (this.an) {
      this.prijavaForm.controls.obicanKorisnik.setValue(false);
      this.prijavaForm.controls.adminAA.setValue(false);
      this.aa = false;
      this.funkcije.enableDugme('btPrijaviSe');
    }
  }

  

  checkKorisnik(){
      this.prijavaForm.controls.adminAA.setValue(false);
      this.prijavaForm.controls.adminAN.setValue(false);
      this.aa = false;
      this.an = false;
      this.funkcije.enableDugme('btPrijaviSe');
  }

  async prikaziPoruku() {
    this.poruka = '🔒';
    await this.funkcije.sacekaj(0.25);
    this.poruka += '✓';
    await this.funkcije.sacekaj(0.25);
    this.poruka += '✓';
    await this.funkcije.sacekaj(0.25);
    this.poruka = '🔓';
    await this.funkcije.sacekaj(1);
  }

  prijaviSe() {
    var ime = String(this.prijavaForm.controls.ime.value);
    var sifra = String(this.prijavaForm.controls.sifra.value);

    if (this.aa) {
      this.adminServis.prijavaAA(ime, sifra).subscribe({
        next: async (token: string) => {
          localStorage.setItem('authToken', token);
          await this.prikaziPoruku();
          this.router.navigate(['./aa-prikaz']);
        },
        error: async (err) => {
          await this.funkcije.sacekaj(1);
          this.greska = err.error;
        },
        complete: () => console.log('prijavljen')
      });
    }

    else if (this.an) {
      this.adminServis.prijavaAN(ime, sifra).subscribe({
        next: async (token: string) => {
          localStorage.setItem('authToken', token);
          await this.prikaziPoruku();
          this.router.navigate(['./an-prikaz']);
        },
        error: async (err) => {
          await this.funkcije.sacekaj(0.5);
          this.greska = err.error;
        },
        complete: () => console.log('prijavljen')
      });

    }
    else {
      this.korisnikServis.prijava(ime, sifra).subscribe({
        next: async (token: string) => {          
          localStorage.setItem('authToken', token);

          this.danServis.dodajDan().subscribe({
            next: (odg: string) => console.log(odg),
            error: (e) => console.log('GREŠKA: ' + e.error),
            complete: () => console.log('dan dodat posle prijave')
          });

          await this.funkcije.sacekaj(1);
          await this.prikaziPoruku();
          this.router.navigate(['./korisnicki-prikaz']);
         
        },

        error: (err) => this.greska = err.error,
        complete: () => console.log('prijavljen')        
      });

    }


  }


  provera() {
    this.poruka= '⏳';

    if (this.proveriIme() && this.proverSifru()) {
      this.greska = '';
      this.prijaviSe();
    }
    else if (!this.proveriIme() && !this.proverSifru())
      this.greska = 'Morate popuniti oba polja!';
    else if (this.proveriIme() && !this.proverSifru())
      this.greska = 'Morate uneti šifru od najmanje 8 karaktera!';
    else
      this.greska = 'Morate uneti ime!';
  }



  clickNazad() {
    this.router.navigate(['./pocetna']);
  }






}


