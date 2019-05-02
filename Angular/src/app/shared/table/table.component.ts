import { Component, OnInit, Input, Output } from '@angular/core';
import BasisBeheerOverzicht from '../../basisBeheerOverzicht';
import { EventEmitter } from '@angular/core';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'mg-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit
{
  @Input() setupValues: [];
  @Input() data: BasisBeheerOverzicht;
  @Output() selected = new EventEmitter<number>();
  @Output() verwijder = new EventEmitter<BasisBeheerOverzicht>();
  @Output() uitvoeren = new EventEmitter<BasisBeheerOverzicht>();

  faTimesCircle = faTimesCircle;

  constructor()
  {

  }

  ngOnInit()
  {

  }

  getValue(item: BasisBeheerOverzicht, header: string): any
  {
    return item.getValue(header);
  }

  onSelect(item: BasisBeheerOverzicht): void
  {
    this.selected.emit(item.getValue("Id"));
  }

  onDelete(item: BasisBeheerOverzicht): void
  {
    this.verwijder.emit(item);
  }

  voerActieUit(item: BasisBeheerOverzicht): void
  {
    this.uitvoeren.emit(item);
  }
}
