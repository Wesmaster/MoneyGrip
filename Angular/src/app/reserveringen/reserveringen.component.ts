import { Component, OnInit } from '@angular/core';
import { MatDialog} from '@angular/material';
import { DialogBevestigenComponent } from '../dialog-bevestigen/dialog-bevestigen.component';
import { Reservering } from './reservering/reservering';
import { ReserveringComponent } from './reservering/reservering.component';
import { Maanden } from '../maanden.enum';
import { CurrencyPipe } from '../currency.pipe';
import BasisOverzichtComponent  from '../base/basis-overzicht.component';
import { BasisService } from '../base/basis.service';

@Component({
  selector: 'app-reserveringen',
  templateUrl: '../base/basis-overzicht.component.html',
  styleUrls: ['./reserveringen.component.scss']
})
export class ReserveringenComponent extends BasisOverzichtComponent implements OnInit {

  items: Reservering[];
  MaandenEnum: typeof Maanden = Maanden;
  selectedId: number;
  rowSelected: boolean;
  buttonText = "Reservering";
  zoekResultaat: Reservering[];
  titel = "Reserveringen";
  docpage = this.titel.toLowerCase();
  tabel: any[];

  constructor(public service: BasisService, public dialog: MatDialog, private customCurrency: CurrencyPipe)
  {
    super(service);
    service.setAccessPointUrl('reservering');

    this.tabel = [
      {kolomnaam: "Categorie", kolombreedte: 2},
      {kolomnaam: "Label", kolombreedte: 2},
      {kolomnaam: "Bedrag", kolombreedte: 1, align: "right"},
      {kolomnaam: "Maand", kolombreedte: 1, align: "center"},
      {kolomnaam: "Omschrijving", kolombreedte: 0}
    ];
  }

  get(): void
  {
    this.service.getAll().subscribe(items => {this.zoekResultaat = items.map(x => Object.assign(new Reservering(this.customCurrency), x)); this.items = items.map(x => Object.assign(new Reservering(this.customCurrency), x))});
  }

  openDeleteDialog(item: Reservering): void
  {
    var vraagVariabele = "";
    if(item.labelNavigation != null)
    {
      vraagVariabele = item.labelNavigation.naam;
    }
    vraagVariabele += " met bedrag € " + this.customCurrency.transform(item.bedrag);
    var vraag = 'Weet je zeker dat je de reservering "' + vraagVariabele + '" wilt verwijderen?';
    const dialogRef = this.dialog.open(DialogBevestigenComponent, {
      data: {vraag: vraag, titel: "Reservering verwijderen?"},
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
    const dialogRef = this.dialog.open(ReserveringComponent, {
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
    this.zoekResultaat = this.items.filter(
      item => new RegExp(zoekTekst, 'gi').test(item.labelNavigation.naam) 
      || new RegExp(zoekTekst, 'gi').test(item.labelNavigation.categorieNavigation.naam)
      || new RegExp(zoekTekst, 'gi').test(Maanden[item.maand])
      || new RegExp(zoekTekst, 'gi').test(item.omschrijving)
    );
  }
}
