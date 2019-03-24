import { Component, OnInit } from '@angular/core';
import { MatDialog} from '@angular/material';
import { DialogBevestigenComponent } from '../dialog-bevestigen/dialog-bevestigen.component';
import { Label } from './label/label';
import { LabelComponent } from './label/label.component';
import BasisOverzichtComponent  from '../base/basis-overzicht.component';
import { BasisService } from '../base/basis.service';

@Component({
  selector: 'app-labels',
  templateUrl: './labels.component.html',
  styleUrls: ['./labels.component.scss']
})
export class LabelsComponent extends BasisOverzichtComponent implements OnInit
{
  items: Label[];
  selectedId: number;
  rowSelected: boolean;
  buttonText = "Label";
  searchText: string;
  zoekResultaat: Label[];
  titel = "Labels";
  docpage = this.titel.toLowerCase();
  tabelHeaders = ["Categorie", "Naam"];
  tabel: any[];

  constructor(public service: BasisService, public dialog: MatDialog)
  {
    super(service);
    service.setAccessPointUrl('label');

    this.tabel = [
      {kolomnaam: "Categorie", kolombreedte: 2},
      {kolomnaam: "Naam", kolombreedte: 0},
    ];
  }

  get(): void
  {
    this.service.getAll().subscribe(items => {this.zoekResultaat = items.map(x => Object.assign(new Label(), x)); this.items = items.map(x => Object.assign(new Label(), x))});
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

  openAddDialog(id: number): void
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

  zoek(zoekTekst: string) : void
  {
    this.zoekResultaat = this.items.filter(item => new RegExp(zoekTekst, 'gi').test(item.naam) || new RegExp(zoekTekst, 'gi').test(item.categorieNavigation.naam));
  }
}
