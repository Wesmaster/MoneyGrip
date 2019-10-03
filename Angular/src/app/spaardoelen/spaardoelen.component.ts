import { Component, OnInit } from '@angular/core';
import { MatDialog} from '@angular/material';
import { DialogBevestigenComponent } from '../dialog-bevestigen/dialog-bevestigen.component';
import { Spaardoel } from './spaardoel/spaardoel';
import { SpaardoelComponent } from './spaardoel/spaardoel.component';
import { CurrencyPipe } from '../currency.pipe';
import { Maanden } from '../maanden.enum';
import BasisOverzichtComponent  from '../base/basis-overzicht.component';
import { BasisService } from '../base/basis.service';
import { Globals } from '../globals';
import BasisBeheerOverzicht from '../basisBeheerOverzicht';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

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
  geselecteerd: Spaardoel[] = [];
  faTrash = faTrash;
  actionsAvailable: boolean = false;

  constructor(public service: BasisService, public dialog: MatDialog, private customCurrency: CurrencyPipe, public globals: Globals)
  {
    super(service, dialog, globals);
    service.setAccessPointUrl('spaardoel');

    this.tabel = [
      {kolomnaam: "Label", kolombreedte: 3, align: "left", mobiel: true},
      {kolomnaam: "Percentage", kolombreedte: 1, align: "center", mobiel: true},
      {kolomnaam: "Eindbedrag", kolombreedte: 1, align: "right", mobiel: true},
      {kolomnaam: "Eerste maand", kolombreedte: 2, align: "center", mobiel: true},
      {kolomnaam: "Laatste maand", kolombreedte: 2, align: "center", mobiel: true},
      {kolomnaam: "Omschrijving", kolombreedte: 0, align: "left", mobiel: false}
    ];
  }

  get(): void
  {
    this.service.getAll().subscribe(items => {this.zoekResultaat = items.map(x => Object.assign(new Spaardoel(this.customCurrency), x)); this.items = items.map(x => Object.assign(new Spaardoel(this.customCurrency), x))});
  }

  onDelete(): void
  {
      var vraagArray = ["Weet je zeker dat je de volgende contract(en) wilt verwijderen?"];
    this.geselecteerd.forEach(item => {
        var vraagVariabele = "";
        if(item.label != null)
        {
            var labelList: string[] = [];
            item.label.forEach(element => {
                labelList.push(element.naam);
            });
        vraagVariabele = labelList.join(", ");
        }

        vraagVariabele += " met bedrag € " + this.customCurrency.transform(item.eindbedrag);
        vraagArray.push(vraagVariabele);
    });
    var vraag = vraagArray.join("\n");
    this.openDeleteDialog(vraag);
  }


  openDeleteDialog(vraag: string): void
  {
    const dialogRef = this.dialog.open(DialogBevestigenComponent, {
      data: {vraag: vraag, titel: "Spaardoel verwijderen?"},
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

  updateSelected(geselecteerd: BasisBeheerOverzicht[]): void
  {
      this.geselecteerd = [];
      this.actionsAvailable = false;
    geselecteerd.forEach(item => {
        this.geselecteerd.push(Object.assign(new Spaardoel(this.customCurrency), item));
        this.actionsAvailable = true;
    });
  }
}
