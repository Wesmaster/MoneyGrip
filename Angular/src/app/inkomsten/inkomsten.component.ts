import { Component, OnInit } from '@angular/core';
import { MatDialog} from '@angular/material';
import { DialogBevestigenComponent } from '../dialog-bevestigen/dialog-bevestigen.component';
import { Inkomst } from './inkomst/inkomst';
import { InkomstComponent } from './inkomst/inkomst.component';
import { Interval } from '../interval.enum';
import { CurrencyPipe } from '../currency.pipe';
import BasisOverzichtComponent  from '../base/basis-overzicht.component';
import { BasisService } from '../base/basis.service';
import { Globals } from '../globals';
import BasisBeheerOverzicht from '../basisBeheerOverzicht';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-inkomsten',
  templateUrl: '../base/basis-overzicht.component.html',
  styleUrls: ['./inkomsten.component.scss']
})

export class InkomstenComponent extends BasisOverzichtComponent implements OnInit
{
  items: Inkomst[];
  IntervalEnum: typeof Interval = Interval;
  selectedId: number;
  rowSelected: boolean;
  buttonText = "Inkomst";
  zoekResultaat: Inkomst[];
  titel = "Inkomsten";
  tabel: any[];
  geselecteerd: Inkomst[] = [];
  faTrash = faTrash;
  actionsAvailable: boolean = false;

  constructor(public service: BasisService, public dialog: MatDialog, private customCurrency: CurrencyPipe, public globals: Globals)
  {
    super(service, dialog, globals);
    service.setAccessPointUrl('inkomst');
    this.setPagina(this.titel.toLowerCase());

    this.tabel = [
      {kolomnaam: "Label", kolombreedte: 3, align: "left", mobiel: true},
      {kolomnaam: "Bedrag", kolombreedte: 1, align: "right", mobiel: true},
      {kolomnaam: "Begindatum", kolombreedte: 1, align: "center", mobiel: false},
      {kolomnaam: "Einddatum", kolombreedte: 1, align: "center", mobiel: false},
      {kolomnaam: "Interval", kolombreedte: 0, align: "left", mobiel: false}
    ];
  }

  get(): void
  {
    this.service.getAll().subscribe(items => {this.zoekResultaat = items.map(x => Object.assign(new Inkomst(this.customCurrency), x)); this.items = items.map(x => Object.assign(new Inkomst(this.customCurrency), x))});
  }

    onDelete(): void
    {
        var vraagArray = ["Weet je zeker dat je de volgende inkomst(en) wilt verwijderen?"];
        this.geselecteerd.forEach(item => {
            var vraagVariabele = item.getValue("Label") + " met bedrag " + item.getValue("Bedrag");
            vraagArray.push(vraagVariabele);
        });
        var vraag = vraagArray.join("\n");
        this.openDeleteDialog("Inkomst verwijderen?", vraag);
    }

      onSelect(id: number): void
  {
      this.selectedId = id;
      this.rowSelected = true;
  
      this.openAddDialog(this.selectedId);
  }

  openAddDialog(id: number): void
  {
    const dialogRef = this.dialog.open(InkomstComponent, {
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

  zoek(zoekTekst: string): void
  {
      if(zoekTekst == "")
      {
          this.zoekResultaat = this.items;
      }
      else
      {
        this.zoekResultaat = this.items.filter(
            item => item.label.some(rx => new RegExp(zoekTekst, 'gi').test(rx.naam)) 
            || (new Date(item.begindatum).setHours(0) <= this.parseDatum(zoekTekst).setHours(0) && ((item.einddatum == null && this.parseDatum(zoekTekst).setHours(0) < new Date(3000,12,31).setHours(0)) || new Date(item.einddatum).setHours(0) >= this.parseDatum(zoekTekst).setHours(0)))
        );
      }
  }

  updateSelected(geselecteerd: BasisBeheerOverzicht[]): void
  {
      this.geselecteerd = [];
      this.actionsAvailable = false;
    geselecteerd.forEach(item => {
        this.geselecteerd.push(Object.assign(new Inkomst(this.customCurrency), item));
        this.actionsAvailable = true;
    });
  }
}
