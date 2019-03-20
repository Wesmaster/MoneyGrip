import { Component, OnInit, ModuleWithComponentFactories } from '@angular/core';
import { MatDialog} from '@angular/material';
import { DialogBevestigenComponent } from '../dialog-bevestigen/dialog-bevestigen.component';
import { Inkomst } from './inkomst/inkomst';
import { InkomstComponent } from './inkomst/inkomst.component';
import { InkomstService } from './inkomst.service';
import { Interval } from '../interval.enum';
import { CurrencyPipe } from '../currency.pipe';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-inkomsten',
  templateUrl: './inkomsten.component.html',
  styleUrls: ['./inkomsten.component.scss']
})

export class InkomstenComponent implements OnInit
{
  items: Inkomst[];
  IntervalEnum: typeof Interval = Interval;
  selectedId: number;
  rowSelected: boolean;
  buttonText = "Inkomst";
  searchText: string;
  zoekResultaat: Inkomst[];

  constructor(private service: InkomstService, public dialog: MatDialog, private customCurrency: CurrencyPipe)
  {

  }

  ngOnInit()
  {
    this.get();
    this.selectedId = null;
    this.rowSelected = false;
  }

  get(): void
  {
    this.service.getAll().subscribe(items => {this.zoekResultaat = items; this.items = items});
  }

  onSelect(item: Inkomst): void
  {
    this.selectedId = item.id;
    this.rowSelected = true;

    this.openAddDialog(item.id);
  }

  afterEdit(id): void
  {
    if(id !== null)
    {
      this.get();
    }
    this.selectedId = null;
    this.rowSelected = false;
  }

  add(): void
  {
    this.selectedId = 0;
    this.rowSelected = true;

    this.openAddDialog(this.selectedId);
  }

  verwijderen(id): void
  {
    this.service.delete(id).subscribe(item => {
      this.afterEdit(id);
    });
  }

  openDeleteDialog(item: Inkomst): void
  {
    var vraagVariabele = "";
    if(item.labelNavigation != null)
    {
      vraagVariabele = item.labelNavigation.naam + " ";
      if(item.persoonNavigation != null)
      {
        vraagVariabele += "van " + item.persoonNavigation.voornaam + " " + item.persoonNavigation.achternaam + " ";
      }
    }
    vraagVariabele += "met bedrag € " + this.customCurrency.transform(item.bedrag);
    var vraag = 'Weet je zeker dat je de inkomst "' + vraagVariabele + '" wilt verwijderen?';
    const dialogRef = this.dialog.open(DialogBevestigenComponent, {
      data: {vraag: vraag, titel: "Inkomst verwijderen?"},
      panelClass: 'dialog-delete',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result)
      {
        this.verwijderen(item.id);
      }
    });
  }

  openAddDialog(id): void
  {
    const dialogRef = this.dialog.open(InkomstComponent, {
      data: id,
      panelClass: 'dialog-add',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result)
      {
        this.afterEdit(id);
      }
      else
      {
        this.afterEdit(null);
      }
    });
  }

  zoek() : void
  {
    this.zoekResultaat = this.items.filter(
      item => new RegExp(this.searchText, 'gi').test(item.labelNavigation.naam) 
      || (item.persoonNavigation !== null && new RegExp(this.searchText, 'gi').test(item.persoonNavigation.voornaam))
      || (item.persoonNavigation !== null && new RegExp(this.searchText, 'gi').test(item.persoonNavigation.achternaam))
      || (new Date(item.begindatum).setHours(0) <= this.parse(this.searchText).setHours(0) && ((item.einddatum == null && this.parse(this.searchText).setHours(0) < new Date(3000,12,31).setHours(0)) || new Date(item.einddatum).setHours(0) >= this.parse(this.searchText).setHours(0)))
      );
  }

  showdate(datum: Date) : Date
  {
    alert(datum);
    return datum;
  }

  parse(value: any): Date | null {
    if ((typeof value === 'string') && (value.indexOf('-') > -1)) {
      const str = value.split('-');

      const year = Number(str[2]);
      const month = Number(str[1]) - 1;
      const date = Number(str[0]);

      //alert(new Date(year, month, date));

      return new Date(year, month, date);
    }
    return new Date(9999, 12, 31);
  }
}
