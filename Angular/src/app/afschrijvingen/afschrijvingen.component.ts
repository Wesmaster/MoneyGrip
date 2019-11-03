import { Component, OnInit } from '@angular/core';
import { MatDialog} from '@angular/material';
import { DialogBevestigenComponent } from '../dialog-bevestigen/dialog-bevestigen.component';
import { Afschrijving } from './afschrijving/afschrijving';
import { AfschrijvingComponent } from './afschrijving/afschrijving.component';
import { CurrencyPipe } from '../currency.pipe';
import BasisOverzichtComponent  from '../base/basis-overzicht.component';
import { BasisService } from '../base/basis.service';
import { AfschrijvingenService } from './afschrijvingen.service';
import { Globals } from '../globals';
import BasisBeheerOverzicht from '../basisBeheerOverzicht';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons';

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
  tabel: any[];
  totaalPerMaand: string;
  gewensteStand: string;
  geselecteerd: Afschrijving[] = [];
  faTrash = faTrash;
  faFileAlt = faFileAlt;
  deleteAvailable: boolean = false;
  openDocumentAvailable: boolean = false;
  
  constructor(public service: BasisService, public algemeenService: AfschrijvingenService, public dialog: MatDialog, private customCurrency: CurrencyPipe, public globals: Globals)
  {
    super(service, dialog, globals);
    service.setAccessPointUrl('afschrijving');
    this.setPagina(this.titel.toLowerCase());

    this.tabel = [
      {kolomnaam: "Label", kolombreedte: 3, align: "left", mobiel: true},
      {kolomnaam: "Startdatum", kolombreedte: 1, align: "left", mobiel: true},
      {kolomnaam: "Waarde", kolombreedte: 1, align: "right", mobiel: false},
      {kolomnaam: "Verwachte levensduur", kolombreedte: 2, align: "center", mobiel: true},
      {kolomnaam: "Per maand", kolombreedte: 1, align: "right", mobiel: true},
      {kolomnaam: "Garantie", kolombreedte: 1, align: "center", mobiel: false},
      {kolomnaam: "FactuurNaam", kolombreedte: 0, align: "left", icoon: {class: "fas fa-file-invoice"}, mobiel: false}
    ];
  }

  get(): void
  {
    this.service.getAll().subscribe(items => {
        this.zoekResultaat = items.map(x => Object.assign(new Afschrijving(this.customCurrency), x)); 
        this.items = items.map(x => Object.assign(new Afschrijving(this.customCurrency), x))
    });
    this.algemeenService.getAlgemeen().subscribe(algemeen => { 
        this.totaalPerMaand = "Totaal per maand: € " +  this.customCurrency.transform(algemeen.totaalPerMaand) 
        this.gewensteStand = "Gewenste stand: € " +  this.customCurrency.transform(algemeen.gewensteStand) 
    });
  }

  onOpenDocument(): void
  {
    this.openFactuur(this.geselecteerd[0]);
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
        downloadLink.download = item.factuurNaam;
        downloadLink.click()
    }
  }

    onDelete(): void
    {
        var vraagArray = ["Weet je zeker dat je de volgende afschrijving(en) wilt verwijderen?"];
        this.geselecteerd.forEach(item => {
            var vraagVariabele = item.getValue("Label") + " met bedrag " + item.getValue("Aankoopbedrag");
            vraagArray.push(vraagVariabele);
        });
        var vraag = vraagArray.join("\n");
        this.openDeleteDialog("Afschrijving(en) verwijderen?", vraag);
    }

      onSelect(id: number): void
  {
      this.selectedId = id;
      this.rowSelected = true;
  
      this.openAddDialog(this.selectedId);
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

  updateSelected(geselecteerd: BasisBeheerOverzicht[]): void
  {
      this.geselecteerd = [];
      this.deleteAvailable = false;
      this.openDocumentAvailable = false;
    geselecteerd.forEach(item => {
        this.geselecteerd.push(Object.assign(new Afschrijving(this.customCurrency), item));
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
