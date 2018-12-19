import { Component, OnInit, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button-toevoegen',
  templateUrl: './button-toevoegen.component.html',
  styleUrls: ['./button-toevoegen.component.css']
})
export class ButtonToevoegenComponent implements OnInit {

  @Input() buttonText: string;
  @Output() toevoegChange = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  toevoegen()
  {
    this.toevoegChange.emit(true);
  }

}
