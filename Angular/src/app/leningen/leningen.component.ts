import { Component, OnInit } from '@angular/core';
import { MatDialog} from '@angular/material';
import { Lening } from './lening/lening';
import { LeningComponent } from './lening/lening.component';
import { LeningType } from '../leningType.enum';
import { CurrencyPipe } from '../currency.pipe';
import BasisOverzichtComponent  from '../base/basis-overzicht.component';
import { BasisService } from '../base/basis.service';
import { Globals } from '../globals';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-leningen',
  templateUrl: './leningen.component.html',
  styleUrls: ['./leningen.component.scss']
})
export class LeningenComponent extends BasisOverzichtComponent implements OnInit
{
    items: Lening[];
    LeningTypeEnum: typeof LeningType = LeningType;
    buttonText = "Lening";
    zoekResultaat: Lening[];
    titel = "Leningen";
    tabel: any[];
      selectedId: number;
  rowSelected: boolean;

    faTrash = faTrash;
    faFileAlt = faFileAlt;

    constructor(public service: BasisService, public dialog: MatDialog, private customCurrency: CurrencyPipe, public globals: Globals)
    {
        super(service, dialog, globals);
        service.setAccessPointUrl('lening');
        this.setPagina(this.titel.toLowerCase());

        this.tabel = [
            {kolomnaam: "Label", kolombreedte: 3, align: "left", mobiel: true},
            {kolomnaam: "Bedrag", kolombreedte: 1, align: "right", mobiel: true},
            {kolomnaam: "Begindatum", kolombreedte: 1, align: "center", mobiel: false},
            {kolomnaam: "Looptijd", kolombreedte: 1, align: "center", mobiel: false},
            {kolomnaam: "Rente", kolombreedte: 1, align: "left", mobiel: true},
            {kolomnaam: "DocumentNaam", kolombreedte: 0, icoon: {class: "fas fa-file-invoice"}, align: "left", mobiel: false},
            {kolomnaam: "Per maand", mobiel: true}
        ];
    }

    get(): void
    {
        this.service.getAll().subscribe(items => 
        {
            this.zoekResultaat = items.map(x => Object.assign(new Lening(this.customCurrency), x));
            this.items = items.map(x => Object.assign(new Lening(this.customCurrency), x))
        });
    }

    onOpenDocument(): void
    {
        this.openDocument(this.geselecteerd[0]);
    }

      onSelect(id: number): void
  {
      this.selectedId = id;
      this.rowSelected = true;
  
      this.openAddDialog(this.selectedId);
  }

    onDelete(): void
    {
        var vraagArray = ["Weet je zeker dat je de volgende lening(en) wilt verwijderen?"];
        this.geselecteerd.forEach(item => {
            var vraagVariabele = item.getValue("Label") + " met bedrag " + item.getValue("Bedrag");
            vraagArray.push(vraagVariabele);
        });
        var vraag = vraagArray.join("\n");
        this.openDeleteDialog("Lening verwijderen?", vraag);
    }

    openAddDialog(id: number): void
    {
        const dialogRef = this.dialog.open(LeningComponent, 
        {
            data: id,
            panelClass: 'dialog-add',
            disableClose: true
        });

        dialogRef.afterClosed().subscribe(result => 
        {
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
                || (new Date(item.begindatum).setHours(0) <= this.parseDatum(zoekTekst).setHours(0))
            );
        }
    }
}