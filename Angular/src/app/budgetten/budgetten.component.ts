import { Component, OnInit } from '@angular/core';
import { MatDialog} from '@angular/material';
import { DialogBevestigenComponent } from '../dialog-bevestigen/dialog-bevestigen.component';
import { Budget } from './budget/budget';
import { BudgetComponent } from './budget/budget.component';
import { BudgetService } from './budget.service';
import { Interval } from '../interval.enum';
import { CurrencyPipe } from '../currency.pipe';

@Component({
  selector: 'app-budgetten',
  templateUrl: './budgetten.component.html',
  styleUrls: ['./budgetten.component.scss']
})
export class BudgettenComponent implements OnInit
{
  items: Budget[];
  IntervalEnum: typeof Interval = Interval;
  selectedId: number;
  rowSelected: boolean;
  buttonText = "Budget";
  searchText: string;

  constructor(private service: BudgetService, public dialog: MatDialog, private customCurrency: CurrencyPipe)
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
    this.service.getAll().subscribe(items => this.items = items);
  }

  onSelect(item: Budget): void
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

  openAddDialog(id): void
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
}
