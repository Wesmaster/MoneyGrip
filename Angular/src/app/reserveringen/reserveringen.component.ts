import { Component, OnInit } from '@angular/core';
import { MatDialog} from '@angular/material';
import { DialogBevestigenComponent } from '../dialog-bevestigen/dialog-bevestigen.component';
import { Reservering } from './reservering/reservering';
import { ReserveringComponent } from './reservering/reservering.component';
import { Maanden } from '../maanden.enum';
import { CurrencyPipe } from '../currency.pipe';
import BasisOverzichtComponent  from '../base/basis-overzicht.component';
import { BasisService } from '../base/basis.service';
import { Globals } from '../globals';
import BasisBeheerOverzicht from '../basisBeheerOverzicht';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

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
  tabel: any[];
  geselecteerd: Reservering[] = [];
  faTrash = faTrash;
  actionsAvailable: boolean = false;

  constructor(public service: BasisService, public dialog: MatDialog, private customCurrency: CurrencyPipe, public globals: Globals)
  {
    super(service, dialog, globals);
    service.setAccessPointUrl('reservering');
    this.setPagina(this.titel.toLowerCase());

    this.tabel = [
      {kolomnaam: "Label", kolombreedte: 3, align: "left", mobiel: true},
      {kolomnaam: "Bedrag", kolombreedte: 1, align: "right", mobiel: true},
      {kolomnaam: "Maand", kolombreedte: 1, align: "center", mobiel: true},
      {kolomnaam: "Omschrijving", kolombreedte: 0, align: "left", mobiel: false}
    ];
  }

  get(): void
  {
    this.service.getAll().subscribe(items => {this.zoekResultaat = items.map(x => Object.assign(new Reservering(this.customCurrency), x)); this.items = items.map(x => Object.assign(new Reservering(this.customCurrency), x))});
  }

  onDelete(): void
  {
      var vraagArray = ["Weet je zeker dat je de volgende reservering(en) wilt verwijderen?"];
      this.geselecteerd.forEach(item => {
          var vraagVariabele = item.getValue("Label") + " met bedrag " + item.getValue("Bedrag");
          vraagArray.push(vraagVariabele);
      });
      var vraag = vraagArray.join("\n");
      this.openDeleteDialog("Reservering verwijderen?", vraag);
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
    if(zoekTekst == "")
    {
        this.zoekResultaat = this.items;
    }
    else
    {
        this.zoekResultaat = this.items.filter(
        item => item.label.some(rx => new RegExp(zoekTekst, 'gi').test(rx.naam)) 
        || new RegExp(zoekTekst, 'gi').test(Maanden[item.maand])
        || new RegExp(zoekTekst, 'gi').test(item.omschrijving)
        );
    }
  }

  updateSelected(geselecteerd: BasisBeheerOverzicht[]): void
  {
      this.geselecteerd = [];
      this.actionsAvailable = false;
    geselecteerd.forEach(item => {
        this.geselecteerd.push(Object.assign(new Reservering(this.customCurrency), item));
        this.actionsAvailable = true;
    });
  }
}
