import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';

import { Interceptor } from './services/interceptor';
import { PocetnaComponent } from './pocetna/pocetna.component';
import { RegistracijaComponent } from './registracija/registracija.component';
import { PrijavaComponent } from './prijava/prijava.component';
import { KorisnickiPrikazComponent } from './korisnicki-prikaz/korisnicki.prikaz.component';
import { PrikazAaComponent } from './prikaz-adminu-aktivnosti/prikaz.aa.component';
import { PrikazAnComponent } from './prikaz-adminu-namirnica/prikaz.an.component';
import { AdminComponent } from './admin/admin.component';
import { StanjeComponent } from './stanje/stanje.component';
import { KorisnikComponent } from './korisnik/korisnik.component';
import { JeloComponent } from './jelo/jelo.component';
import { TreningComponent } from './trening/trening.component';
import { ObrokComponent } from './obrok/obrok.component';
import { DanComponent } from './dan/dan.component';
import { PorukaComponent } from './poruka/poruka.component';
import { ObjavaComponent } from './objava/objava.component';
import { PracenjeComponent } from './pracenje/pracenje.component';
import { DrustvoComponent } from './drustvo/drustvo.component';
import { ZahteviComponent } from './zahtevi/zahtevi.component';
import { ZPracenjeComponent } from './z.pracenje/z.pracenje.component';
import { ObavestenjaComponent } from './obavestenja/obavestenja.component';

const appRoute: Routes = [
  {path: '', component: PocetnaComponent},
  {path: 'pocetna', component: PocetnaComponent},
  {path: 'registracija', component: RegistracijaComponent},
  {path: 'prijava', component: PrijavaComponent}, 
  {path: 'korisnicki-prikaz', component: KorisnickiPrikazComponent},
  {path: 'aa-prikaz', component: PrikazAaComponent},
  {path: 'an-prikaz', component: PrikazAnComponent},
  {path: 'admin', component: AdminComponent}, 
  {path: 'stanje', component: StanjeComponent}, 
  {path: 'korisnik', component: KorisnikComponent},
  {path: 'jelo', component: JeloComponent},
  {path: 'trening', component: TreningComponent},
  {path: 'obrok', component: ObrokComponent},
  {path: 'dan', component: DanComponent},
  {path: 'poruka', component: PorukaComponent},
  {path: 'objava', component: ObjavaComponent},
  {path: 'pracenje', component: PracenjeComponent},
  {path: 'drustvo', component: DrustvoComponent},
  {path: 'zahtevi', component: ZahteviComponent},
  {path: 'z-pracenje', component: ZPracenjeComponent},
  {path: 'obavestenja', component: ObavestenjaComponent}
]


@NgModule({
  declarations: [
    AppComponent, 
    PocetnaComponent,
    RegistracijaComponent,
    PrijavaComponent, 
    KorisnickiPrikazComponent,
    AdminComponent,
    PrikazAaComponent,
    PrikazAnComponent, 
    StanjeComponent, 
    KorisnikComponent, 
    JeloComponent,
    TreningComponent,
    ObrokComponent,
    DanComponent,
    PorukaComponent, 
    ObjavaComponent,
    PracenjeComponent,
    DrustvoComponent,
    ZahteviComponent,
    ZPracenjeComponent,
    ObavestenjaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule, 
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoute)
  ],
  exports:[
    RouterModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, 
  useClass: Interceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
