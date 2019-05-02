import { Component, OnInit, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'button-toevoegen',
  templateUrl: './button-toevoegen.component.html',
  styleUrls: ['./button-toevoegen.component.scss']
})
export class ButtonToevoegenComponent implements OnInit {

  @Input() buttonText: string;
  @Output() toevoegChange = new EventEmitter<boolean>();
  faPlus = faPlus;

  constructor() { }

  ngOnInit() {
  }

  toevoegen()
  {
    this.toevoegChange.emit(true);
  }

}
