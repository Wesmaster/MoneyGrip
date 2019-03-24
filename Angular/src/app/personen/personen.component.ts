import { Component, OnInit } from '@angular/core';
import { MatDialog} from '@angular/material';
import { Persoon } from './persoon/persoon';
import { DialogBevestigenComponent } from '../dialog-bevestigen/dialog-bevestigen.component';
import { PersoonComponent } from './persoon/persoon.component';
import BasisOverzichtComponent  from '../base/basis-overzicht.component';
import { BasisService } from '../base/basis.service';

@Component({
  selector: 'app-personen',
  templateUrl: '../base/basis-overzicht.component.html',
  styleUrls: ['./personen.component.scss']
})
export class PersonenComponent extends BasisOverzichtComponent implements OnInit
{
  items: Persoon[];
  buttonText = "Persoon";
  searchText: string;
  titel = "Personen";
  docpage = this.titel.toLowerCase();
  tabel: any[];
  zoekResultaat: Persoon[];

  constructor(public service: BasisService, public dialog: MatDialog)
  {
    super(service);
    service.setAccessPointUrl('persoon');

    this.tabel = [
      {kolomnaam: "Voornaam", kolombreedte: 2},
      {kolomnaam: "Achternaam", kolombreedte: 0}
    ];
  }

  get(): void
  {
    this.service.getAll().subscribe(items => {this.zoekResultaat = items.map(x => Object.assign(new Persoon(), x)); this.items = items.map(x => Object.assign(new Persoon(), x))});
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

  openAddDialog(id: number): void
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

  zoek(zoekTekst: string) : void
  {
    this.zoekResultaat = this.items.filter(item => new RegExp(zoekTekst, 'gi').test(item.voornaam) || new RegExp(zoekTekst, 'gi').test(item.achternaam));
  }
}
