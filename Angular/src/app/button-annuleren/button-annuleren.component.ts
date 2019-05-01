import { Component, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-button-annuleren',
  templateUrl: './button-annuleren.component.html',
  styleUrls: ['./button-annuleren.component.scss']
})
export class ButtonAnnulerenComponent implements OnInit {

  @Output() annuleerChange = new EventEmitter<boolean>();
  faTimes = faTimes;

  constructor() { }

  ngOnInit() {
  }

  annuleren()
  {
    this.annuleerChange.emit(true);
  }
}
