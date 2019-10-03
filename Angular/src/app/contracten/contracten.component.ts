import { Component, OnInit } from '@angular/core';
import { MatDialog} from '@angular/material';
import { DialogBevestigenComponent } from '../dialog-bevestigen/dialog-bevestigen.component';
import { Contract } from './contract/contract';
import { ContractComponent } from './contract/contract.component';
import { Interval } from '../interval.enum';
import { CurrencyPipe } from '../currency.pipe';
import BasisOverzichtComponent  from '../base/basis-overzicht.component';
import { BasisService } from '../base/basis.service';
import { Globals } from '../globals';
import BasisBeheerOverzicht from '../basisBeheerOverzicht';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons';

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
  tabel: any[];
  geselecteerd: Contract[] = [];
  faTrash = faTrash;
  faFileAlt = faFileAlt;
  deleteAvailable: boolean = false;
  openDocumentAvailable: boolean = false;

  constructor(public service: BasisService, public dialog: MatDialog, private customCurrency: CurrencyPipe, public globals: Globals)
  {
    super(service, dialog, globals);
    service.setAccessPointUrl('contract');
    this.setPagina(this.titel.toLowerCase());

    this.tabel = [
      {kolomnaam: "Label", kolombreedte: 3, align: "left", mobiel: true},
      {kolomnaam: "Bedrag", kolombreedte: 1, align: "right", mobiel: true},
      {kolomnaam: "Begindatum", kolombreedte: 1, align: "center", mobiel: false},
      {kolomnaam: "Einddatum", kolombreedte: 1, align: "center", mobiel: false},
      {kolomnaam: "Interval", kolombreedte: 1, align: "left", mobiel: true},
      {kolomnaam: "DocumentNaam", kolombreedte: 0, icoon: {class: "fas fa-file-invoice"}, align: "left", mobiel: false}
    ];
  }

  get(): void
  {
    this.service.getAll().subscribe(items => {this.zoekResultaat = items.map(x => Object.assign(new Contract(this.customCurrency), x)); this.items = items.map(x => Object.assign(new Contract(this.customCurrency), x))});
  }

  onOpenDocument(): void
  {
    this.openDocument(this.geselecteerd[0]);
  }

  openDocument(item: Contract): void
  {
    const linkSource = 'data:application/pdf;base64,' + item.document;
    const downloadLink = document.createElement("a");

    downloadLink.href = linkSource;
    downloadLink.download = item.documentNaam;
    downloadLink.click()
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

        vraagVariabele += " met bedrag € " + this.customCurrency.transform(item.bedrag);
        vraagArray.push(vraagVariabele);
    });
    var vraag = vraagArray.join("\n");
    this.openDeleteDialog(vraag);
  }

  openDeleteDialog(vraag: string): void
  {
    const dialogRef = this.dialog.open(DialogBevestigenComponent, {
      data: {vraag: vraag, titel: "Contract verwijderen?"},
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
    if(zoekTekst == "")
    {
        this.zoekResultaat = this.items;
    }
    else
    {
        this.zoekResultaat = this.items.filter(
            item => item.label.some(rx => new RegExp(zoekTekst, 'gi').test(rx.naam)) 
        || (new Date(item.begindatum).setHours(0) <= this.parseDatum(zoekTekst).setHours(0) && ((item.einddatum == null && this.parseDatum(zoekTekst).setHours(0) < new Date(3000,12,31).setHours(0)) || new Date(item.einddatum).setHours(0) >= this.parseDatum(zoekTekst).setHours(0)))
        );
    }
  }

  updateSelected(geselecteerd: BasisBeheerOverzicht[]): void
  {
      this.geselecteerd = [];
      this.deleteAvailable = false;
      this.openDocumentAvailable = false;
    geselecteerd.forEach(item => {
        this.geselecteerd.push(Object.assign(new Contract(this.customCurrency), item));
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