import { Component, OnInit } from '@angular/core';
import { MatDialog} from '@angular/material';
import { Categorie } from './categorie/categorie';
import { CategorieService } from './categorie.service';
import { DialogBevestigenComponent } from '../dialog-bevestigen/dialog-bevestigen.component';
import { CategorieComponent } from './categorie/categorie.component';
import { CategorieType } from './type.enum';

@Component({
  selector: 'app-categorieen',
  templateUrl: './categorieen.component.html',
  styleUrls: ['./categorieen.component.css']
})
export class CategorieenComponent implements OnInit
{
  items: Categorie[];
  TypeEnum: typeof CategorieType = CategorieType;
  selectedId: number;
  rowSelected: boolean;
  buttonText = "Categorie";
  searchText: string;

  constructor(private service: CategorieService, public dialog: MatDialog)
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

  onSelect(item: Categorie): void
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

  openDeleteDialog(item: Categorie): void {
    var vraag = 'Weet je zeker dat je de categorie "' + item.naam + '" wilt verwijderen?';
    const dialogRef = this.dialog.open(DialogBevestigenComponent, {
      data: {vraag: vraag, titel: "Categorie verwijderen?", opmerking: "Let op! Het verwijderen van een categorie verwijdert ook alle labels behorende bij de categorie."},
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
    const dialogRef = this.dialog.open(CategorieComponent, {
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
