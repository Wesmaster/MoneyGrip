import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'algemeen',
  templateUrl: './algemeen.component.html',
  styleUrls: ['./algemeen.component.scss']
})
export class AlgemeenComponent implements OnInit
{
    @Input() text1: string;
    @Input() text2: string;
    @Input() text3: string;

  constructor() { }

  ngOnInit() {
  }

}
