import { Component, OnInit } from '@angular/core';
import { MatDialog} from '@angular/material';
import { DialogBevestigenComponent } from '../dialog-bevestigen/dialog-bevestigen.component';
import { Spaardoel } from './spaardoel/spaardoel';
import { SpaardoelComponent } from './spaardoel/spaardoel.component';
import { CurrencyPipe } from '../currency.pipe';
import { Maanden } from '../maanden.enum';
import BasisOverzichtComponent  from '../base/basis-overzicht.component';
import { BasisService } from '../base/basis.service';

@Component({
  selector: 'app-spaardoelen',
  templateUrl: '../base/basis-overzicht.component.html',
  styleUrls: ['./spaardoelen.component.scss']
})
export class SpaardoelenComponent extends BasisOverzichtComponent implements OnInit 
{
  items: Spaardoel[];
  selectedId: number;
  rowSelected: boolean;
  buttonText = "Spaardoel";
  MaandenEnum: typeof Maanden = Maanden;
  zoekResultaat: Spaardoel[];
  titel = "Spaardoelen";
  docpage = this.titel.toLowerCase();
  tabel: any[];

  constructor(public service: BasisService, public dialog: MatDialog, private customCurrency: CurrencyPipe)
  {
    super(service);
    service.setAccessPointUrl('spaardoel');

    this.tabel = [
      {kolomnaam: "Label", kolombreedte: 3},
      {kolomnaam: "Percentage", kolombreedte: 1, align: "center"},
      {kolomnaam: "Eindbedrag", kolombreedte: 1, align: "right"},
      {kolomnaam: "Eerste maand", kolombreedte: 2, align: "center"},
      {kolomnaam: "Laatste maand", kolombreedte: 2, align: "center"},
      {kolomnaam: "Omschrijving", kolombreedte: 0}
    ];
  }

  get(): void
  {
    this.service.getAll().subscribe(items => {this.zoekResultaat = items.map(x => Object.assign(new Spaardoel(this.customCurrency), x)); this.items = items.map(x => Object.assign(new Spaardoel(this.customCurrency), x))});
  }

  openDeleteDialog(item: Spaardoel): void
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

    if(item.eindbedrag != null)
    {
      vraagVariabele += " met bedrag € " + this.customCurrency.transform(item.eindbedrag);
    }else if(item.percentage != null)
    {
      vraagVariabele += " met percentage " + item.percentage + "%";
    }
    var vraag = 'Weet je zeker dat je het spaardoel "' + vraagVariabele + '" wilt verwijderen?';
    const dialogRef = this.dialog.open(DialogBevestigenComponent, {
      data: {vraag: vraag, titel: "Spaardoel verwijderen?"},
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
    const dialogRef = this.dialog.open(SpaardoelComponent, {
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
        || new RegExp(zoekTekst, 'gi').test(item.omschrijving)
        || (item.eersteMaand <= Maanden[this.maakEersteLetterHoofdletter(zoekTekst)] && item.laatsteMaand >= Maanden[this.maakEersteLetterHoofdletter(zoekTekst)])
        );
    }
  }

  maakEersteLetterHoofdletter(tekst: string): string
  {
    return tekst.charAt(0).toUpperCase() + tekst.slice(1);
  }
}
