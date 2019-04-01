import { Component, OnInit } from '@angular/core';
import { MatDialog} from '@angular/material';
import { DialogBevestigenComponent } from '../dialog-bevestigen/dialog-bevestigen.component';
import { Budget } from './budget/budget';
import { BudgetComponent } from './budget/budget.component';
import { Interval } from '../interval.enum';
import { CurrencyPipe } from '../currency.pipe';
import BasisOverzichtComponent  from '../base/basis-overzicht.component';
import { BasisService } from '../base/basis.service';

@Component({
  selector: 'app-budgetten',
  templateUrl: '../base/basis-overzicht.component.html',
  styleUrls: ['./budgetten.component.scss']
})
export class BudgettenComponent extends BasisOverzichtComponent implements OnInit
{
  items: Budget[];
  IntervalEnum: typeof Interval = Interval;
  selectedId: number;
  rowSelected: boolean;
  buttonText = "Budget";
  searchText: string;
  zoekResultaat: Budget[];
  titel = "Budgetten";
  docpage = this.titel.toLowerCase();
  tabel: any[];

  constructor(public service: BasisService, public dialog: MatDialog, private customCurrency: CurrencyPipe)
  {
    super(service);
    service.setAccessPointUrl('budget');

    this.tabel = [
      {kolomnaam: "Categorie", kolombreedte: 2},
      {kolomnaam: "Label", kolombreedte: 2},
      {kolomnaam: "Bedrag", kolombreedte: 1},
      {kolomnaam: "Begindatum", kolombreedte: 1},
      {kolomnaam: "Einddatum", kolombreedte: 1},
      {kolomnaam: "Interval", kolombreedte: 0}
    ];
  }

  get(): void
  {
    this.service.getAll().subscribe(items => {this.zoekResultaat = items.map(x => Object.assign(new Budget(this.customCurrency), x)); this.items = items.map(x => Object.assign(new Budget(this.customCurrency), x))});
  }

  openDeleteDialog(item: Budget): void
  {
    var vraagVariabele = "";
    if(item.labelNavigation != null)
    {
      vraagVariabele = item.labelNavigation.naam;
    }
    vraagVariabele += " met bedrag € " + this.customCurrency.transform(item.bedrag);
    var vraag = 'Weet je zeker dat je het budget "' + vraagVariabele + '" wilt verwijderen?';
    const dialogRef = this.dialog.open(DialogBevestigenComponent, {
      data: {vraag: vraag, titel: "Budget verwijderen?"},
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

  openAddDialog(id: number): void
  {
    const dialogRef = this.dialog.open(BudgetComponent, {
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

  zoek(zoekTekst: string): void
  {
    this.zoekResultaat = this.items.filter(
      item => new RegExp(zoekTekst, 'gi').test(item.labelNavigation.naam) 
      || new RegExp(zoekTekst, 'gi').test(item.labelNavigation.categorieNavigation.naam) 
      || (new Date(item.begindatum).setHours(0) <= this.parseDatum(zoekTekst).setHours(0) && ((item.einddatum == null && this.parseDatum(zoekTekst).setHours(0) < new Date(3000,12,31).setHours(0)) || new Date(item.einddatum).setHours(0) >= this.parseDatum(zoekTekst).setHours(0)))
    );
  }
}
