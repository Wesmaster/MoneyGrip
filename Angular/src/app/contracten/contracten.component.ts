import { Component, OnInit } from '@angular/core';
import { MatDialog} from '@angular/material';
import { DialogBevestigenComponent } from '../dialog-bevestigen/dialog-bevestigen.component';
import { Contract } from './contract/contract';
import { ContractComponent } from './contract/contract.component';
import { ContractService } from './contract.service';
import { Interval } from '../interval.enum';
import { CurrencyPipe } from '../currency.pipe';

@Component({
  selector: 'app-contracten',
  templateUrl: './contracten.component.html',
  styleUrls: ['./contracten.component.css']
})
export class ContractenComponent implements OnInit
{
  items: Contract[];
  IntervalEnum: typeof Interval = Interval;
  selectedId: number;
  rowSelected: boolean;
  buttonText = "Contract";
  searchText: string;

  constructor(private service: ContractService, public dialog: MatDialog, private customCurrency: CurrencyPipe)
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

  onSelect(item: Contract): void
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

  openDocument(item: Contract): void
  {
    const linkSource = 'data:application/pdf;base64,' + item.document;
    const downloadLink = document.createElement("a");
    const fileName = item.labelNavigation.naam + ".pdf";

    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click()
  }

  openDeleteDialog(item: Contract): void
  {
    var vraagVariabele = "";
    if(item.labelNavigation != null)
    {
      vraagVariabele = item.labelNavigation.naam;
    }
    vraagVariabele += " met bedrag € " + this.customCurrency.transform(item.bedrag);
    var vraag = 'Weet je zeker dat je het contract "' + vraagVariabele + '" wilt verwijderen?';
    const dialogRef = this.dialog.open(DialogBevestigenComponent, {
      data: {vraag: vraag, titel: "Contract verwijderen?"},
      panelClass: 'dialog-delete'
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
    const dialogRef = this.dialog.open(ContractComponent, {
      data: id,
      panelClass: 'dialog-add'
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