import { Component, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button-verwijderen',
  templateUrl: './button-verwijderen.component.html',
  styleUrls: ['./button-verwijderen.component.scss']
})
export class ButtonVerwijderenComponent implements OnInit {

  @Output() verwijderChange = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  verwijderen()
  {
    this.verwijderChange.emit(true);
  }
}
