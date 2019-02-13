import { Component, OnInit } from '@angular/core';
import { MatDialog} from '@angular/material';
import { DialogBevestigenComponent } from '../dialog-bevestigen/dialog-bevestigen.component';
import { Label } from './label/label';
import { LabelComponent } from './label/label.component';
import { LabelService } from './label.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-labels',
  templateUrl: './labels.component.html',
  styleUrls: ['./labels.component.css']
})
export class LabelsComponent implements OnInit
{
  items: Label[];
  selectedId: number;
  rowSelected: boolean;
  buttonText = "Label";
  searchText: string;
  zoekResultaat: Label[];

  public read_the_docs: string = environment.read_the_docs;

  constructor(private service: LabelService, public dialog: MatDialog)
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

  onSelect(item: Label): void
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

  openDeleteDialog(item: Label): void {
    var vraag = 'Weet je zeker dat je het label "' + item.naam + '" wilt verwijderen?';
    const dialogRef = this.dialog.open(DialogBevestigenComponent, {
      data: {vraag: vraag, titel: "Label verwijderen?", opmerking: "Let op! Het verwijderen van een label heeft grote gevolgen voor de inrichting. Afschrijvingen, Budgetten, Contracten, Inkomsten, Reserveringen en Spaardoelen behorende bij dit label worden ook verwijderd."},
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
    const dialogRef = this.dialog.open(LabelComponent, {
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
    this.zoekResultaat = this.items.filter(item => new RegExp(this.searchText, 'gi').test(item.naam) || new RegExp(this.searchText, 'gi').test(item.categorieNavigation.naam));
  }
}
