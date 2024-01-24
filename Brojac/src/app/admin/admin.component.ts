import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { __values } from 'tslib';
import { RouterModule, Routes, Route, Router } from '@angular/router';
import { AdminAktivnosti } from '../model/admin.aktivnosti';
import { AdminServis } from '../services/admin.servis';
import { PomocneFunkcije } from '../services/pomocne.funkcije';


@Component({
  selector: 'admin',
  templateUrl: './admin.html',
  styleUrls: ['./admin.css']
})

export class AdminComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private funkcije: PomocneFunkcije,
    private router: Router,
    private adminServis: AdminServis) { }


  ngOnInit() {
    this.prijavljen();
    this.funkcije.disableDugme('btSubmit');
  }

  adminForm = this.fb.group({
    ime: ['', Validators.required],
    sifra: ['', Validators.required],
    potvrda: ['', Validators.required]
  })



  admin = new AdminAktivnosti();
  porukaAdmin = '';
  adminforma = false;



  prijavljen() {
    this.adminServis.prijavljenAA().subscribe({
      next: async (odg: AdminAktivnosti) => {
        this.admin = odg;
        this.adminForm.controls.ime.setValue(this.admin.ime);
      },
      error: (e) => this.porukaAdmin = e.error,
      complete: () => console.log('Učitan je prijavljeni admin.')
    });
  }


  promeniIme() {
    var ime = String(this.adminForm.controls.ime.value);
    this.adminServis.promeniIme(ime).subscribe({
      next: (odg: any) => {
        this.admin = odg;
        this.prijavljen();
        this.porukaAdmin = '';
      },
      error: (e) => this.porukaAdmin = e.error,
      complete: () => console.log('Admin je promenio ime.')
    });
    this.i = false;
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

  promeniSifru() {
    var sifra = String(this.adminForm.controls.sifra.value);
    this.adminServis.promeniSifru(sifra).subscribe({
      next: (odg: any) => {
        this.admin = odg;
        this.porukaAdmin = 'Šifra je uspešno promenjena.';
      },
      error: (e) => this.porukaAdmin = e.error,
      complete: () => console.log('Admin je promenio šifru.')
    });
  }

  odjaviSe() {
    localStorage.removeItem('authToken');
    this.router.navigate(['./pocetna']);
  }



  i = false;
  unosImena() {
    var ime = String(this.adminForm.controls.ime.value);
    if (ime != this.admin.ime && ime.trim() != '') {
      this.funkcije.enableDugme('btSubmit');
      this.i = true;
    }
    else {
      this.funkcije.disableDugme('btSubmit');
      this.i = false;
    }
  }


  unosSifre() {
    var sifra = String(this.adminForm.controls.sifra.value);
    var potvrda = String(this.adminForm.controls.potvrda.value);
    if (sifra.trim().length > 7 && sifra == potvrda)
      this.funkcije.enableDugme('btSubmit');
    else this.funkcije.disableDugme('btSubmit');
  }


  adminSacuvaj() {
    if (this.i)
      this.promeniIme();
    else {
      this.promeniSifru();
      this.adminForm.controls.sifra.setValue('');
      this.adminForm.controls.potvrda.setValue('');
    }
    this.funkcije.disableDugme('btSubmit');
    this.adminforma = false;
  }



}