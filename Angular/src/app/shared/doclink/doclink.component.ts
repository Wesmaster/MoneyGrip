import { Component, OnInit, Input } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'doclink',
  templateUrl: './doclink.component.html',
  styleUrls: ['./doclink.component.scss']
})
export class DoclinkComponent implements OnInit {

  @Input() pagina: string;
  public read_the_docs: string = environment.read_the_docs;

  constructor()
  { 

  }

  ngOnInit()
  {
  
  }
}
