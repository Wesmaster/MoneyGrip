import { Component, OnInit } from '@angular/core';
import { MatDialog} from '@angular/material';
import { DialogBevestigenComponent } from '../dialog-bevestigen/dialog-bevestigen.component';
import { Inkomst } from './inkomst/inkomst';
import { InkomstComponent } from './inkomst/inkomst.component';
import { Interval } from '../interval.enum';
import { CurrencyPipe } from '../currency.pipe';
import BasisOverzichtComponent  from '../base/basis-overzicht.component';
import { BasisService } from '../base/basis.service';

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
  docpage = this.titel.toLowerCase();
  tabel: any[];

  constructor(public service: BasisService, public dialog: MatDialog, private customCurrency: CurrencyPipe)
  {
    super(service);
    service.setAccessPointUrl('inkomst');

    this.tabel = [
      {kolomnaam: "Label", kolombreedte: 2},
      {kolomnaam: "Persoon", kolombreedte: 2},
      {kolomnaam: "Bedrag", kolombreedte: 1, align: "right"},
      {kolomnaam: "Begindatum", kolombreedte: 1, align: "center"},
      {kolomnaam: "Einddatum", kolombreedte: 1, align: "center"},
      {kolomnaam: "Interval", kolombreedte: 0}
    ];
  }

  get(): void
  {
    this.service.getAll().subscribe(items => {this.zoekResultaat = items.map(x => Object.assign(new Inkomst(this.customCurrency), x)); this.items = items.map(x => Object.assign(new Inkomst(this.customCurrency), x))});
  }

  openDeleteDialog(item: Inkomst): void
  {
    var vraagVariabele = "";
   // if(item.labelNavigation != null)
   // {
    //  vraagVariabele = item.labelNavigation.naam + " ";
/*      if(item.persoon != null)
      {
        vraagVariabele += "van " + item.persoon.voornaam + " " + item.persoon.achternaam + " ";
      }*/
 //   }
    vraagVariabele += "met bedrag € " + this.customCurrency.transform(item.bedrag);
    var vraag = 'Weet je zeker dat je de inkomst "' + vraagVariabele + '" wilt verwijderen?';
    const dialogRef = this.dialog.open(DialogBevestigenComponent, {
      data: {vraag: vraag, titel: "Inkomst verwijderen?"},
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
 /*   this.zoekResultaat = this.items.filter(
      item => new RegExp(zoekTekst, 'gi').test(item.labelNavigation.naam) 
      || (item.persoon !== null && new RegExp(zoekTekst, 'gi').test(item.persoon.voornaam))
      || (item.persoon !== null && new RegExp(zoekTekst, 'gi').test(item.persoon.achternaam))
      || (new Date(item.begindatum).setHours(0) <= this.parseDatum(zoekTekst).setHours(0) && ((item.einddatum == null && this.parseDatum(zoekTekst).setHours(0) < new Date(3000,12,31).setHours(0)) || new Date(item.einddatum).setHours(0) >= this.parseDatum(zoekTekst).setHours(0)))
    );*/
  }
}
