import { Component, OnInit } from '@angular/core';
import { MatDialog} from '@angular/material';
import { DialogBevestigenComponent } from '../dialog-bevestigen/dialog-bevestigen.component';
import { Rekening } from './rekening/rekening';
import { RekeningComponent } from './rekening/rekening.component';
import { Interval } from '../interval.enum';
import { CurrencyPipe } from '../currency.pipe';
import BasisOverzichtComponent  from '../base/basis-overzicht.component';
import { BasisService } from '../base/basis.service';
import { Globals } from '../globals';
import BasisBeheerOverzicht from '../basisBeheerOverzicht';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'rekeningen',
  templateUrl: '../base/basis-overzicht.component.html',
  styleUrls: ['./rekeningen.component.scss']
})
export class RekeningenComponent implements OnInit {

    items: Rekening[];
    IntervalEnum: typeof Interval = Interval;
    selectedId: number;
    rowSelected: boolean;
    buttonText = "Rekening";
    zoekResultaat: Rekening[];
    titel = "Rekeningen";
    tabel: any[];
    geselecteerd: Rekening[] = [];
    faTrash = faTrash;
    actionsAvailable: boolean = false;
  
    constructor(public service: BasisService, public dialog: MatDialog, private customCurrency: CurrencyPipe, public globals: Globals)
    {
    service.setAccessPointUrl('rekening');
    this.setPagina(this.titel.toLowerCase());

    this.tabel = [
      {kolomnaam: "Naam", mobiel: true},
      {kolomnaam: "Iban", mobiel: true},
      {kolomnaam: "Saldo", mobiel: true},
      {kolomnaam: "Hoofdrekening", mobiel: true}
    ];
  }

  ngOnInit()
  {
      this.get();
      this.selectedId = null;
      this.rowSelected = false;
  }

  setPagina(pagina: string): void
  {
      this.globals.pagina = pagina;
  }

  add(): void
  {
      this.selectedId = 0;
      this.rowSelected = true;
  
      this.openAddDialog(this.selectedId);
  }

  get(): void
  {
    this.service.getAll().subscribe(items => {this.zoekResultaat = items.map(x => Object.assign(new Rekening(this.customCurrency), x)); this.items = items.map(x => Object.assign(new Rekening(this.customCurrency), x))});
  }

  onSelect(id: number): void
  {
      this.selectedId = id;
      this.rowSelected = true;
  
      this.openAddDialog(this.selectedId);
  }

  afterEdit(id: number): void
  {
      if(id !== null)
      {
          this.get();
      }
      this.selectedId = null;
      this.rowSelected = false;
  }

  verwijderen(id: number): void
  {
      this.service.delete(id).subscribe(item => 
      {
          this.afterEdit(id);
      });
  }

  onDelete(): void
  {
      var vraagArray = ["Weet je zeker dat je de volgende rekening(en) wilt verwijderen?"];
    this.geselecteerd.forEach(item => {
        var vraagVariabele = item.naam + " met bedrag € " + this.customCurrency.transform(item.saldo);
        vraagArray.push(vraagVariabele);
    });
    var vraag = vraagArray.join("\n");
    this.openDeleteDialog(vraag);
  }

  openDeleteDialog(vraag: string): void
  {
    const dialogRef = this.dialog.open(DialogBevestigenComponent, {
      data: {vraag: vraag, titel: "Rekening verwijderen?"},
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
    const dialogRef = this.dialog.open(RekeningComponent, {
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
            item => new RegExp(zoekTekst, 'gi').test(item.naam) ||
            new RegExp(zoekTekst, 'gi').test(item.iban)
        );
      }
  }

  updateSelected(geselecteerd: BasisBeheerOverzicht[]): void
  {
      this.geselecteerd = [];
      this.actionsAvailable = false;
    geselecteerd.forEach(item => {
        this.geselecteerd.push(Object.assign(new Rekening(this.customCurrency), item));
        this.actionsAvailable = true;
    });
  }
}
