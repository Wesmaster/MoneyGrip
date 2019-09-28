import { Component, OnInit, Input } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Globals } from '../../globals';

@Component({
  selector: 'doclink',
  templateUrl: './doclink.component.html',
  styleUrls: ['./doclink.component.scss']
})
export class DoclinkComponent implements OnInit 
{
  public read_the_docs: string = environment.read_the_docs;
  public pagina: string;

  constructor(public globals: Globals)
  { 

  }

  ngOnInit()
  {
  
  }

  openDocumentation()
  {
    window.open(this.read_the_docs + "moneygrip/" + this.globals.pagina + ".html", "_blank");
  }
}
