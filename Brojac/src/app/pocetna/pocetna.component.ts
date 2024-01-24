import { Token } from '@angular/compiler';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OutletContext } from '@angular/router';
import { __values } from 'tslib';
import { RouterModule, Routes, Route } from '@angular/router';
import { AppRoutingModule } from '../app-routing.module';

@Component({
  selector: 'pocetna',
  templateUrl: './pocetna.html',
  styleUrls: ['./pocetna.css']
})


export class PocetnaComponent {
  title = 'Brojac';

  constructor() { }


}