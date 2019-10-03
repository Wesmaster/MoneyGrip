import { Component, OnInit } from '@angular/core';
import { MatDialog} from '@angular/material';
import { DialogBevestigenComponent } from '../dialog-bevestigen/dialog-bevestigen.component';
import { Label } from './label/label';
import { LabelComponent } from './label/label.component';
import BasisOverzichtComponent  from '../base/basis-overzicht.component';
import { BasisService } from '../base/basis.service';
import { Globals } from '../globals';
import BasisBeheerOverzicht from '../basisBeheerOverzicht';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { LabelService } from './label.service';

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
  tabelHeaders = ["Naam"];
  tabel: any[];
  geselecteerd: Label[] = [];
  faTrash = faTrash;
  deleteAvailable: boolean = false;

  constructor(public service: BasisService, private labelService: LabelService, public dialog: MatDialog, public globals: Globals)
  {
    super(service, dialog, globals);
    service.setAccessPointUrl('label');
    this.setPagina(this.titel.toLowerCase());

    this.tabel = [
      {kolomnaam: "Naam", kolombreedte: 0, align: "left", mobiel: true},
    ];
  }

  get(): void
  {
    this.service.getAll().subscribe(items => {this.zoekResultaat = items.map(x => Object.assign(new Label(), x)); this.items = items.map(x => Object.assign(new Label(), x))});
  }

  onDelete(): void
  {
    var vraagArray = ["Weet je zeker dat je de volgende label(s) wilt verwijderen?"];
    this.geselecteerd.forEach(item => {
        if(item.naam != null)
        {
            vraagArray.push(item.naam);
        }
    });
    var vraag = vraagArray.join("\n");
    this.openDeleteDialog(vraag);
  }

  openDeleteDialog(vraag: string): void {
    
    const dialogRef = this.dialog.open(DialogBevestigenComponent, {
      data: {vraag: vraag, titel: "Label verwijderen?", opmerking: "Let op! Het verwijderen van een label heeft grote gevolgen voor de inrichting."},
      panelClass: 'dialog-delete',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result)
      {
        this.geselecteerd.forEach(item => {
            this.verwijderen(item.id);
        });

        this.geselecteerd = [];
        this.ngOnInit();
        this.labelService.loadAll();
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
    if(zoekTekst == "")
    {
        this.zoekResultaat = this.items;
    }
    else
    {
        this.zoekResultaat = this.items.filter(item => new RegExp(zoekTekst, 'gi').test(item.naam));
    }
  }

  updateSelected(geselecteerd: BasisBeheerOverzicht[]): void
  {
      this.geselecteerd = [];
      this.deleteAvailable = false;
    geselecteerd.forEach(item => {
        this.geselecteerd.push(Object.assign(new Label(), item));
        this.deleteAvailable = true;
    });
  }
}
