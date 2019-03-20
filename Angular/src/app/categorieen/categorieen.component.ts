import { Component, OnInit } from '@angular/core';
import { MatDialog} from '@angular/material';
import { Categorie } from './categorie/categorie';
import { CategorieService } from './categorie.service';
import { DialogBevestigenComponent } from '../dialog-bevestigen/dialog-bevestigen.component';
import { CategorieComponent } from './categorie/categorie.component';
import { CategorieType } from './type.enum';
import BasisOverzichtComponent  from '../base/basis-overzicht.component';
import { BasisService } from '../base/basis.service';

@Component({
  selector: 'app-categorieen',
  templateUrl: './categorieen.component.html',
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
  tabelHeaders = ["", "Naam", "Type"];

  constructor(public service: BasisService, public dialog: MatDialog)
  {
    super(service);
    service.setAccessPointUrl('categorie');
  }

  getValue(item: Categorie, header: string)
  {
    return item.getValue(header);
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

  openAddDialog(id): void
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

  zoek() : void
  {
    this.zoekResultaat = this.items.filter(item => new RegExp(this.searchText, 'gi').test(item.naam) || new RegExp(this.searchText, 'gi').test(CategorieType[item.type]));
  }
}
