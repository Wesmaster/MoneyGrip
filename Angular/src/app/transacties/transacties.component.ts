import { Component, OnInit } from '@angular/core';
import { MatDialog} from '@angular/material';
import { DialogBevestigenComponent } from '../dialog-bevestigen/dialog-bevestigen.component';
import { Transactie } from './transactie/transactie';
import { TransactieService } from './transactie.service';
import { TransactieComponent } from './transactie/transactie.component';
import { Interval } from '../interval.enum';
import { CurrencyPipe } from '../currency.pipe';
import BasisOverzichtComponent  from '../base/basis-overzicht.component';
import { BasisService } from '../base/basis.service';
import { Globals } from '../globals';
import BasisBeheerOverzicht from '../basisBeheerOverzicht';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { Maanden } from '../maanden.enum';

@Component({
  selector: 'app-transacties',
  templateUrl: './transacties.component.html',
  styleUrls: ['./transacties.component.scss']
})
export class TransactiesComponent extends BasisOverzichtComponent implements OnInit
{
  items: Transactie[];
  IntervalEnum: typeof Interval = Interval;
  selectedId: number;
  rowSelected: boolean;
  buttonText = "Transactie";
  zoekResultaat: Transactie[];
  titel = "Transacties";
  tabel: any[];
  geselecteerd: Transactie[] = [];
  faTrash = faTrash;
  faFileAlt = faFileAlt;
  deleteAvailable: boolean = false;
  openDocumentAvailable: boolean = false;
  maandFilter: typeof Maanden = Maanden;
  jaarFilter: number[] = [];
  maand: Maanden = new Date().getMonth() + 1; // Januari is 0!
  jaar: number = new Date().getFullYear();

  constructor(public service: BasisService, public transactieService: TransactieService, public dialog: MatDialog, private customCurrency: CurrencyPipe, public globals: Globals)
  {
    super(service, dialog, globals);
    service.setAccessPointUrl('transactie');
    this.setPagina(this.titel.toLowerCase());
    this.getJaren();

    this.tabel = [
        { kolomnaam: "Dag", mobiel: true },
        { kolomnaam: "Type", mobiel: true },
        { kolomnaam: "Label", mobiel: true },
        { kolomnaam: "Bedrag", mobiel: true },
        { kolomnaam: "Omschrijving", mobiel: false },
        { kolomnaam: "Van", mobiel: false },
        { kolomnaam: "Naar", mobiel: false },
        { kolomnaam: "DocumentNaam", mobiel: false }
    ];
  }

  get(): void
  {
    this.transactieService.getAll(this.jaar, this.maand).subscribe(items => {this.zoekResultaat = items.map(x => Object.assign(new Transactie(this.customCurrency), x)); this.items = items.map(x => Object.assign(new Transactie(this.customCurrency), x))});
  }

  getJaren(): void
  {
    this.transactieService.getJaarFilter().subscribe(item => {
        this.jaarFilter = item;
        this.jaarFilter.sort((n1, n2)=> n2 - n1);
        this.jaar = this.jaarFilter[0] ? this.jaarFilter[0] : new Date().getFullYear();
    });
  }

  keys(array: any): Array<string>
  {
      var keys = Object.keys(array);
      return keys.slice(keys.length / 2);
  }

  onOpenDocument(): void
  {
    this.openDocument(this.geselecteerd[0]);
  }

  onDelete(): void
    {
        var vraagArray = ["Weet je zeker dat je de volgende transactie(s) wilt verwijderen?"];
        this.geselecteerd.forEach(item => {
            var vraagVariabele = item.getValue("Label") + " met bedrag " + item.getValue("Bedrag");
            vraagArray.push(vraagVariabele);
        });
        var vraag = vraagArray.join("\n");
        this.openDeleteDialog("Transactie verwijderen?", vraag);
    }

  openAddDialog(id: number): void
  {
    const dialogRef = this.dialog.open(TransactieComponent, {
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
        || (new Date(item.dag).setHours(0) === this.parseDatum(zoekTekst).setHours(0))
        );
    }
  }

  updateSelected(geselecteerd: BasisBeheerOverzicht[]): void
  {
      this.geselecteerd = [];
      this.deleteAvailable = false;
      this.openDocumentAvailable = false;
    geselecteerd.forEach(item => {
        this.geselecteerd.push(Object.assign(new Transactie(this.customCurrency), item));
    });

    if(this.geselecteerd.length > 0)
    {
        this.deleteAvailable = true;
        this.openDocumentAvailable = true;
    }
    if(this.geselecteerd.length > 1)
    {
        this.openDocumentAvailable = false;
    }
  }
}