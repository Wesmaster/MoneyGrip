import { Component, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button-annuleren',
  templateUrl: './button-annuleren.component.html',
  styleUrls: ['./button-annuleren.component.css']
})
export class ButtonAnnulerenComponent implements OnInit {

  @Output() annuleerChange = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  annuleren()
  {
    this.annuleerChange.emit(true);
  }
}
