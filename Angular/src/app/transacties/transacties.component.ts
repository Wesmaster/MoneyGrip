import { Component, OnInit } from '@angular/core';
import { MatDialog} from '@angular/material';
import { Transactie } from './transactie/transactie';
import { TransactieService } from './transactie.service';
import { TransactieComponent } from './transactie/transactie.component';
import { CurrencyPipe } from '../currency.pipe';
import BasisOverzichtComponent  from '../base/basis-overzicht.component';
import { BasisService } from '../base/basis.service';
import { Globals } from '../globals';
import { faTrash, faFileAlt, faClone} from '@fortawesome/free-solid-svg-icons';
import { Maanden } from '../maanden.enum';
import { TransactieType } from '../transactieType.enum';

@Component({
  selector: 'app-transacties',
  templateUrl: './transacties.component.html',
  styleUrls: ['./transacties.component.scss']
})
export class TransactiesComponent extends BasisOverzichtComponent implements OnInit
{
  items: Transactie[];
  buttonText = "Transactie";
  zoekResultaat: Transactie[];
  titel = "Transacties";
  tabel: any[];
  faTrash = faTrash;
  faFileAlt = faFileAlt;
  faClone = faClone;
  maandFilter: typeof Maanden = Maanden;
  jaarFilter: number[] = [];
  maand: Maanden = new Date().getMonth() + 1; // Januari is 0!
  jaar: number = new Date().getFullYear();
  selectedId: number;

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

  onDupliceren()
  {
    this.transactieService.dupliceer(this.geselecteerd[0].getValue("Id")).then(item => {
        this.get();
        this.openAddDialog(Object.assign(new Transactie(this.customCurrency), item).id, true);
        this.updateSelected([]);
    });
  }

  onOpenDocument(): void
  {
    this.openDocument(this.geselecteerd[0]);
  }

        onSelect(id: number): void
  {
      this.selectedId = id;
  
      this.openAddDialog(this.selectedId, false);
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

  openAddDialog(id: number, refresh: boolean): void
  {
    const dialogRef = this.dialog.open(TransactieComponent, {
      data: id,
      panelClass: 'dialog-add',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result || refresh)
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
        || new RegExp(zoekTekst, 'gi').test(item.omschrijving)
        || zoekTekst == item.dag.toString()
        || zoekTekst == TransactieType[item.type]
        );
    }
  }
}