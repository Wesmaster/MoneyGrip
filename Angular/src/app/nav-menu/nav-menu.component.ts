import { Component } from '@angular/core';
import { environment } from '../../environments/environment';
import { InfoComponent } from '../info/info.component';
import { MatDialog} from '@angular/material';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  isExpanded = false;
  public version: string = environment.VERSION;

  constructor(public dialog: MatDialog)
  {

  }

  collapse() {
    this.isExpanded = false;
  }

  toggleBeheer() {
    this.isExpanded = !this.isExpanded;
  }

  toonInfo()
  {
    const dialogRef = this.dialog.open(InfoComponent, {
      data: {bericht: "Grip op Huishouden is bedoeld om meer inzicht te krijgen over de financiën en administratie binnen het huishouden", titel: "Grip op Huishouden v" + this.version},
      panelClass: 'dialog-delete',
      disableClose: true
    });
  }
}
