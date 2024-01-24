import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';



@Injectable({
  providedIn: 'root'
})

export class PomocneFunkcije {

  constructor() { }

  async sacekaj(vreme: number) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(resolve);
      }, vreme * 1000);
    });
  }


  prikaziVremeDatum(datum: Date): string {
    var prikaz = '';
    const d = new Date(datum);
    prikaz += d.getDate().toString() + '.';
    prikaz += (d.getMonth() + 1).toString() + '.';
    prikaz += d.getFullYear().toString() + '. u ';

    if (d.getHours() > 9)
      prikaz += d.getHours().toString() + ':';
    else prikaz += '0' + d.getHours().toString() + ':';

    if (d.getMinutes() < 10)
      prikaz += '0' + d.getMinutes().toString();
    else prikaz += d.getMinutes().toString();

    return prikaz;
  }

  prikaziDatum(datum: Date): string {
    var prikaz = '';
    const d = new Date(datum);
    prikaz += d.getDate().toString() + '.';
    prikaz += (d.getMonth() + 1).toString() + '.';
    prikaz += d.getFullYear().toString() + '.';

    return prikaz;
  }


  dani() {
    var d: number[] = new Array;

    for (var i = 1; i <= 31; i++)
      d.push(i);

    return d;
  }


  disableDugme(dugme: string) {
    var button = <HTMLInputElement>document.getElementById(dugme);
    button.disabled = true;
  }

  enableDugme(dugme: string) {
    var button = <HTMLInputElement>document.getElementById(dugme);
    button.disabled = false;
  }

  disableDugmad(dugmad: string[]) {
    for (let i = 0; i < dugmad.length; i++)
      this.disableDugme(dugmad[i]);
  }

  enableDugmad(dugmad: string[]) {
    for (let i = 0; i < dugmad.length; i++)
      this.enableDugme(dugmad[i]);
  }


  promeniUnetTekst(unetTekst: string) : string{
    for(let i = 0; i< unetTekst.length; i++)
    if(unetTekst[i] == '\n')
      unetTekst = unetTekst.replace(unetTekst[i], '***');    
    else if(unetTekst[i]== '?')
      unetTekst = unetTekst.replace(unetTekst[i], 'upitnik')
  
      return unetTekst;
  }


  pozicija(y: number, pocetak: number, kraj: number): number{
    
    let p = pocetak;
    while(p <= kraj){
      if(y >= p && y< p+23)
        y = p;
      
      p = p + 23;
    }

    return y;
    }

    


  uokviri(i: Number){
    var oznacenLI = <HTMLLIElement>document.getElementById('li' + i.toString());
    if(oznacenLI != null){
      oznacenLI.style.borderStyle = 'dashed';
      oznacenLI.style.borderColor = 'black';
    }

  }

  ukloniOkvir(i: Number){
    var oznacenLI = <HTMLLIElement>document.getElementById('li' + i.toString());
    if(oznacenLI != null){
      oznacenLI.style.borderColor = '#fffb9f';
      oznacenLI.style.borderStyle = 'solid';      
    }
  }


  ukloniOkvire(i: Number, klasa: string){
    var svi =  document.getElementsByClassName(klasa);
    for(let j = 0; j< svi.length; j++)
      if(j!= i)
        this.ukloniOkvir(j);
  }



}