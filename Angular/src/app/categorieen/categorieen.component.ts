import { Component, OnInit } from '@angular/core';
import { MatDialog} from '@angular/material';
import { Categorie } from './categorie/categorie';
import { DialogBevestigenComponent } from '../dialog-bevestigen/dialog-bevestigen.component';
import { CategorieComponent } from './categorie/categorie.component';
import { CategorieType } from './type.enum';
import BasisOverzichtComponent  from '../base/basis-overzicht.component';
import { BasisService } from '../base/basis.service';

@Component({
  selector: 'app-categorieen',
  templateUrl: '../base/basis-overzicht.component.html',
  styleUrls: ['./categorieen.component.scss']
})
export class CategorieenComponent extends BasisOverzichtComponent implements OnInit
{
  items: Categorie[];
  TypeEnum: typeof CategorieType = CategorieType;
  selectedId: number;
  rowSelected: boolean;
  buttonText = "Categorie";
  searchText: string;
  zoekResultaat: Categorie[];
  titel = "Categorieën";
  docpage = this.titel.toLowerCase();
  tabel: any[];

  constructor(public service: BasisService, public dialog: MatDialog)
  {
    super(service);
    service.setAccessPointUrl('categorie');

    this.tabel = [
      {kolomnaam: "", kolombreedte: -2, icoon: {class: "fas fa-bookmark"}},
      {kolomnaam: "Naam", kolombreedte: 2},
      {kolomnaam: "Type", kolombreedte: 0},
    ];
  }

  get(): void
  {
    this.service.getAll().subscribe(items => {this.zoekResultaat = items.map(x => Object.assign(new Categorie(), x)); this.items = items.map(x => Object.assign(new Categorie(), x))});
  }

  openDeleteDialog(item: Categorie): void {
    var vraag = 'Weet je zeker dat je de categorie "' + item.naam + '" wilt verwijderen?';
    const dialogRef = this.dialog.open(DialogBevestigenComponent, {
      data: {vraag: vraag, titel: "Categorie verwijderen?", opmerking: "Let op! Het verwijderen van een categorie verwijdert ook alle labels behorende bij de categorie."},
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
    const dialogRef = this.dialog.open(CategorieComponent, {
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
    this.zoekResultaat = this.items.filter(item => new RegExp(zoekTekst, 'gi').test(item.naam) || new RegExp(zoekTekst, 'gi').test(CategorieType[item.type]));
  }
}
