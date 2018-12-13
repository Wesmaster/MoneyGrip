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

  constructor(private service: PersoonService, public dialog: MatDialog)
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

  onSelect(item: Persoon): void
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

  openDeleteDialog(item: Persoon): void {
    var vraag = 'Weet je zeker dat je de persoon "' + item.voornaam + " " + item.achternaam +  '" wilt verwijderen?';
    const dialogRef = this.dialog.open(DialogBevestigenComponent, {
      data: {vraag: vraag, titel: "Persoon verwijderen?"},
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
    const dialogRef = this.dialog.open(PersoonComponent, {
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
