import { Component, OnInit } from '@angular/core';
import { MatDialog} from '@angular/material';
import { DialogBevestigenComponent } from '../dialog-bevestigen/dialog-bevestigen.component';
import { Afschrijving } from './afschrijving/afschrijving';
import { AfschrijvingComponent } from './afschrijving/afschrijving.component';
import { CurrencyPipe } from '../currency.pipe';
import BasisOverzichtComponent  from '../base/basis-overzicht.component';
import { BasisService } from '../base/basis.service';

@Component({
  selector: 'app-afschrijvingen',
  templateUrl: './afschrijvingen.component.html',
  styleUrls: ['./afschrijvingen.component.scss']
})
export class AfschrijvingenComponent extends BasisOverzichtComponent implements OnInit 
{
  items: Afschrijving[];
  selectedId: number;
  rowSelected: boolean;
  buttonText = "Afschrijving";
  zoekResultaat: Afschrijving[];
  titel = "Afschrijvingen";
  docpage = this.titel.toLowerCase();
  tabel: any[];

  constructor(public service: BasisService, public dialog: MatDialog, private customCurrency: CurrencyPipe)
  {
    super(service);
    service.setAccessPointUrl('afschrijving');

    this.tabel = [
      {kolomnaam: "Label", kolombreedte: 3},
      {kolomnaam: "Startdatum", kolombreedte: 1},
      {kolomnaam: "Waarde", kolombreedte: 1, align: "right"},
      {kolomnaam: "Verwachte levensduur", kolombreedte: 2, align: "center"},
      {kolomnaam: "Per maand", kolombreedte: 1, align: "right"},
      {kolomnaam: "Garantie", kolombreedte: 1, align: "center"},
      {kolomnaam: "Factuur", kolombreedte: 0, icoon: {class: "fas fa-file-invoice"}}
    ];
  }

  get(): void
  {
    this.service.getAll().subscribe(items => {this.zoekResultaat = items.map(x => Object.assign(new Afschrijving(this.customCurrency), x)); this.items = items.map(x => Object.assign(new Afschrijving(this.customCurrency), x))});
  }

  openFactuur(item: Afschrijving): void
  {
    const linkSource = 'data:application/pdf;base64,' + item.factuur;
    const downloadLink = document.createElement("a");
    if(item.label != null)
    {
        var labelList: string[] = [];
        item.label.forEach(element => {
             labelList.push(element.naam);
        });

        const fileName = labelList.join("_") + ".pdf";

        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click()
    }
  }

  openDeleteDialog(item: Afschrijving): void
  {
    var vraagVariabele = "";
    if(item.label != null)
    {
        var labelList: string[] = [];
        item.label.forEach(element => {
             labelList.push(element.naam);
        });
      vraagVariabele = labelList.join(", ") + " ";
    }

    vraagVariabele += " met bedrag € " + this.customCurrency.transform(item.aankoopbedrag);
    var vraag = 'Weet je zeker dat je de afschrijving "' + vraagVariabele + '" wilt verwijderen?';
    const dialogRef = this.dialog.open(DialogBevestigenComponent, {
      data: {vraag: vraag, titel: "Afschrijving verwijderen?"},
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
    const dialogRef = this.dialog.open(AfschrijvingComponent, {
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
        || (new Date(item.aankoopdatum).setHours(0) <= this.parseDatum(zoekTekst).setHours(0)
            && this.parseDatum(zoekTekst).setHours(0) < new Date(3000,12,31).setHours(0)
            )
        );
    }
  }
}
