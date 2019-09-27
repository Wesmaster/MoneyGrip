import { Component, OnInit, Input, Output } from '@angular/core';
import BasisBeheerOverzicht from '../../basisBeheerOverzicht';
import { EventEmitter } from '@angular/core';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {SelectionModel} from '@angular/cdk/collections';

export interface tabelConfig
{
    align: string;
    kolombreedte: number;
    kolomnaam: string;
    mobiel: boolean;
}

@Component({
  selector: 'mg-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit
{
  @Input() setupValues: tabelConfig[];
  @Input() data: BasisBeheerOverzicht[];
  @Input() selecteerbaar: boolean;
  @Output() selected = new EventEmitter<number>();
  @Output() geselecteerd = new EventEmitter<BasisBeheerOverzicht[]>();

  faTimesCircle = faTimesCircle;
  columns: string[] = [];
  selection = new SelectionModel<BasisBeheerOverzicht>(true, []);
  displayedColumns: string[] = [];

  constructor(private breakpointObserver: BreakpointObserver)
  {

  }

  ngOnInit()
  {
    this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small]).subscribe(result => {
        this.displayedColumns = [];
        if(this.selecteerbaar)
        {
            this.displayedColumns.push("select");
        }
        this.columns = result.matches ? 
            this.getKolomnamenVanSetupValues(this.setupValues.filter(value => value.mobiel)) : 
            this.getKolomnamenVanSetupValues(this.setupValues);

        this.displayedColumns = this.displayedColumns.concat(this.columns);
      });
  }

  ngOnChanges()
  {
    this.selection.clear();
  }

  getKolomnamenVanSetupValues(values: tabelConfig[]): string[]
  {
    let kolommen: string[] = [];
    values.forEach(setup =>
    {
        kolommen.push(setup.kolomnaam.toUpperCase());
    });
    return kolommen;
  }

  getValue(item: BasisBeheerOverzicht, header: string): any
  {
    return item.getValue(header.substring(0, 1) + header.substring(1).toLowerCase());
  }

  onSelect(item: BasisBeheerOverzicht): void
  {
    this.selected.emit(item.getValue("Id"));
  }

  updateSelectedItems(row: BasisBeheerOverzicht):void
  {
    this.selection.toggle(row);
    this.geselecteerd.emit(this.selection.selected);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected()
  {
    const numSelected = this.selection.selected.length;
    const numRows = this.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle()
  {
    this.isAllSelected() ?
        this.selection.clear() :
        this.data.forEach(row => this.selection.select(row));
  }
}
