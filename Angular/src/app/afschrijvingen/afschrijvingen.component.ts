import { Component, OnInit } from '@angular/core';
import { MatDialog} from '@angular/material';
import { DialogBevestigenComponent } from '../dialog-bevestigen/dialog-bevestigen.component';
import { Afschrijving } from './afschrijving/afschrijving';
import { AfschrijvingComponent } from './afschrijving/afschrijving.component';
import { AfschrijvingService } from './afschrijving.service';
import { CurrencyPipe } from '../currency.pipe';

@Component({
  selector: 'app-afschrijvingen',
  templateUrl: './afschrijvingen.component.html',
  styleUrls: ['./afschrijvingen.component.css']
})
export class AfschrijvingenComponent implements OnInit {
  items: Afschrijving[];
  selectedId: number;
  rowSelected: boolean;
  buttonText = "Afschrijving";
  searchText: string;

  constructor(private service: AfschrijvingService, public dialog: MatDialog, private customCurrency: CurrencyPipe)
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

  onSelect(item: Afschrijving): void
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

  openFactuur(item: Afschrijving): void
  {
    const linkSource = 'data:application/pdf;base64,' + item.factuur;
    const downloadLink = document.createElement("a");
    const fileName = item.labelNavigation.naam + ".pdf";

    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click()
  }

  openDeleteDialog(item: Afschrijving): void
  {
    var vraagVariabele = "";
    if(item.labelNavigation != null)
    {
      vraagVariabele = item.labelNavigation.naam;
    }
    vraagVariabele += " met bedrag € " + this.customCurrency.transform(item.aankoopbedrag);
    var vraag = 'Weet je zeker dat je de afschrijving "' + vraagVariabele + '" wilt verwijderen?';
    const dialogRef = this.dialog.open(DialogBevestigenComponent, {
      data: {vraag: vraag, titel: "Afschrijving verwijderen?"},
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
    const dialogRef = this.dialog.open(AfschrijvingComponent, {
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
