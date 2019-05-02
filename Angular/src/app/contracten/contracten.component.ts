import { Component, OnInit } from '@angular/core';
import { MatDialog} from '@angular/material';
import { DialogBevestigenComponent } from '../dialog-bevestigen/dialog-bevestigen.component';
import { Contract } from './contract/contract';
import { ContractComponent } from './contract/contract.component';
import { Interval } from '../interval.enum';
import { CurrencyPipe } from '../currency.pipe';
import BasisOverzichtComponent  from '../base/basis-overzicht.component';
import { BasisService } from '../base/basis.service';

@Component({
  selector: 'app-contracten',
  templateUrl: './contracten.component.html',
  styleUrls: ['./contracten.component.scss']
})
export class ContractenComponent extends BasisOverzichtComponent implements OnInit
{
  items: Contract[];
  IntervalEnum: typeof Interval = Interval;
  selectedId: number;
  rowSelected: boolean;
  buttonText = "Contract";
  zoekResultaat: Contract[];
  titel = "Contracten";
  docpage = this.titel.toLowerCase();
  tabel: any[];

  constructor(public service: BasisService, public dialog: MatDialog, private customCurrency: CurrencyPipe)
  {
    super(service);
    service.setAccessPointUrl('contract');

    this.tabel = [
      {kolomnaam: "Categorie", kolombreedte: 2},
      {kolomnaam: "Label", kolombreedte: 2},
      {kolomnaam: "Bedrag", kolombreedte: 1, align: "right"},
      {kolomnaam: "Begindatum", kolombreedte: 1, align: "center"},
      {kolomnaam: "Einddatum", kolombreedte: 1, align: "center"},
      {kolomnaam: "Interval", kolombreedte: 1},
      {kolomnaam: "Document", kolombreedte: 0, icoon: {class: "fas fa-file-invoice"}}
    ];
  }

  get(): void
  {
    this.service.getAll().subscribe(items => {this.zoekResultaat = items.map(x => Object.assign(new Contract(this.customCurrency), x)); this.items = items.map(x => Object.assign(new Contract(this.customCurrency), x))});
  }

  openDocument(item: Contract): void
  {
    const linkSource = 'data:application/pdf;base64,' + item.document;
    const downloadLink = document.createElement("a");

    downloadLink.href = linkSource;
    downloadLink.download = item.documentNaam;
    downloadLink.click()
  }

  openDeleteDialog(item: Contract): void
  {
    var vraagVariabele = "";
    if(item.labelNavigation != null)
    {
      vraagVariabele = item.labelNavigation.naam;
    }
    vraagVariabele += " met bedrag € " + this.customCurrency.transform(item.bedrag);
    var vraag = 'Weet je zeker dat je het contract "' + vraagVariabele + '" wilt verwijderen?';
    const dialogRef = this.dialog.open(DialogBevestigenComponent, {
      data: {vraag: vraag, titel: "Contract verwijderen?"},
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
    const dialogRef = this.dialog.open(ContractComponent, {
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
      alert(zoekTekst);
    this.zoekResultaat = this.items.filter(
      item => new RegExp(zoekTekst, 'gi').test(item.labelNavigation.naam) 
      || new RegExp(zoekTekst, 'gi').test(item.labelNavigation.categorieNavigation.naam)
      || (new Date(item.begindatum).setHours(0) <= this.parseDatum(zoekTekst).setHours(0) && ((item.einddatum == null && this.parseDatum(zoekTekst).setHours(0) < new Date(3000,12,31).setHours(0)) || new Date(item.einddatum).setHours(0) >= this.parseDatum(zoekTekst).setHours(0)))
    );
  }
}