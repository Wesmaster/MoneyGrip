import { Component, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'zoekbalk',
  templateUrl: './zoekbalk.component.html',
  styleUrls: ['./zoekbalk.component.css']
})
export class ZoekbalkComponent implements OnInit
{
  @Output() zoekTekst = new EventEmitter<string>();
  tekst: string;

  constructor() 
  {

  }

  ngOnInit()
  {

  }

  zoek()
  {
    this.zoekTekst.emit(this.tekst);
  }
}
