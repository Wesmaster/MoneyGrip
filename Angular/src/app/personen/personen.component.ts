import { Component, OnInit } from '@angular/core';
import { MatDialog} from '@angular/material';
import { Persoon } from './persoon/persoon';
import { PersoonService } from './persoon.service';
import { DialogBevestigenComponent } from '../dialog-bevestigen/dialog-bevestigen.component';
import { PersoonComponent } from './persoon/persoon.component';

@Component({
  selector: 'app-personen',
  templateUrl: './personen.component.html',
  styleUrls: ['./personen.component.css']
})
export class PersonenComponent implements OnInit
{
  items: Persoon[];
  selectedId: number;
  rowSelected: boolean;
  buttonText = "Persoon";
  searchText: string;
  titel = "Personen";
  docpage = this.titel;
  tabelHeaders = ["Voornaam", "Achternaam"];

  constructor(private service: PersoonService, public dialog: MatDialog)
  {
    this.docpage = this.docpage.toLowerCase();
  }

  ngOnInit()
  {
    this.get();
    this.selectedId = null;
    this.rowSelected = false;
  }

  getValue(item: Persoon, header: string)
  {
    return item.getValue(header);
  }

  get(): void
  {
    this.service.getAll().subscribe(items => this.items = items.map(x => Object.assign(new Persoon(), x)));
  }

  onSelect(id: number): void
  {
    this.selectedId = id;
    this.rowSelected = true;

    this.openAddDialog(this.selectedId);
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

  openDeleteDialog(item: Persoon): void {
    var vraag = 'Weet je zeker dat je de persoon "' + item.voornaam + " " + item.achternaam +  '" wilt verwijderen?';
    const dialogRef = this.dialog.open(DialogBevestigenComponent, {
      data: {vraag: vraag, titel: "Persoon verwijderen?", opmerking: "Let op! Het verwijderen van een persoon verwijdert ook alle inkomsten behorende bij de persoon."},
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
    const dialogRef = this.dialog.open(PersoonComponent, {
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
