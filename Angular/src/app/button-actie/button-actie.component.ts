import { Component, OnInit, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button-actie',
  templateUrl: './button-actie.component.html',
  styleUrls: ['./button-actie.component.scss']
})
export class ButtonActieComponent implements OnInit {

  @Input() buttonText: string;
  @Input() disable: boolean;
  @Output() actieChange = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  uitvoeren()
  {
    this.actieChange.emit(true);
  }
}
