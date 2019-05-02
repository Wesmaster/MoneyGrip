import { Component } from '@angular/core';
import { environment } from '../../environments/environment';
import { InfoComponent } from '../info/info.component';
import { MatDialog} from '@angular/material';
import { faCaretRight, faChartLine, faBars, faSignInAlt, faSignOutAlt, faFileInvoice, faAlignLeft, faFileContract, faCalendarAlt, faPiggyBank, faEdit, faBookmark, faTag, faUsers, faCogs, faDatabase, faQuestionCircle, faBook, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss']
})
export class NavMenuComponent {
  isExpanded = false;
  public version: string = environment.VERSION;
  public read_the_docs: string = environment.read_the_docs;
  public app_name: string = environment.app_name;
  faCaretRight = faCaretRight;
  faChartLine = faChartLine;
  faBars = faBars;
  faSignInAlt = faSignInAlt;
  faSignOutAlt = faSignOutAlt;
  faFileInvoice = faFileInvoice;
  faAlignLeft = faAlignLeft;
  faFileContract = faFileContract;
  faCalendarAlt = faCalendarAlt;
  faPiggyBank = faPiggyBank;
  faEdit = faEdit;
  faBookmark = faBookmark;
  faCogs = faCogs;
  faTag = faTag;
  faUsers = faUsers;
  faDatabase = faDatabase;
  faQuestionCircle = faQuestionCircle;
  faBook = faBook;
  faInfoCircle = faInfoCircle;

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
      data: {bericht: this.app_name + " is bedoeld om meer grip te krijgen op de financiële administratie binnen het huishouden", titel: this.app_name + " v" + this.version},
      panelClass: 'dialog-delete',
      disableClose: true
    });
  }
}
