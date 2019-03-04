import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'titel',
  templateUrl: './titel.component.html',
  styleUrls: ['./titel.component.scss']
})
export class TitelComponent implements OnInit {

  @Input() naam: string;

  constructor()
  {

  }

  ngOnInit()
  {
    
  }
}
