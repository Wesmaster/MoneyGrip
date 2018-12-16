import { Component, OnInit } from '@angular/core';
import { MatDialog} from '@angular/material';
import { DialogBevestigenComponent } from '../dialog-bevestigen/dialog-bevestigen.component';
import { Spaardoel } from './spaardoel/spaardoel';
import { SpaardoelComponent } from './spaardoel/spaardoel.component';
import { SpaardoelService } from './spaardoel.service';
import { CurrencyPipe } from '../currency.pipe';
import { Maanden } from '../maanden.enum';

@Component({
  selector: 'app-spaardoelen',
  templateUrl: './spaardoelen.component.html',
  styleUrls: ['./spaardoelen.component.css']
})
export class SpaardoelenComponent implements OnInit {
  items: Spaardoel[];
  selectedId: number;
  rowSelected: boolean;
  buttonText = "Spaardoel";
  searchText: string;
  MaandenEnum: typeof Maanden = Maanden;

  constructor(private service: SpaardoelService, public dialog: MatDialog, private customCurrency: CurrencyPipe)
  {

  }

  ngOnInit()
  {
    this.get();
    this.selectedId = null;
    this.rowSelected = false;
  }

  get(): void
  {
    this.service.getAll().subscribe(items => this.items = items);
  }

  onSelect(item: Spaardoel): void
  {
    this.selectedId = item.id;
    this.rowSelected = true;

    this.openAddDialog(item.id);
  }

  afterEdit(id): void
  {
    if(id !== null)
    {
      this.get();
    }
    this.selectedId = null;
    this.rowSelected = false;
  }

  add(): void
  {
    this.selectedId = 0;
    this.rowSelected = true;

    this.openAddDialog(this.selectedId);
  }

  verwijderen(id): void
  {
    this.service.delete(id).subscribe(item => {
      this.afterEdit(id);
    });
  }

  openDeleteDialog(item: Spaardoel): void
  {
    var vraagVariabele = "";
    if(item.labelNavigation != null)
    {
      vraagVariabele = item.labelNavigation.naam;
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
      panelClass: 'dialog-delete'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result)
      {
        this.verwijderen(item.id);
      }
    });
  }

  openAddDialog(id): void
  {
    const dialogRef = this.dialog.open(SpaardoelComponent, {
      data: id,
      panelClass: 'dialog-add'
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
}
