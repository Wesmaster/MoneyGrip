import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { faCaretUp, faCaretDown, faChartLine, faBars, faSignInAlt, faSignOutAlt, faFileInvoice, faAlignLeft, faFileContract, faCalendarAlt, faPiggyBank, faEdit, faBookmark, faTag, faUsers, faCogs, faDatabase, faQuestionCircle, faBook, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { environment } from '../../environments/environment';
import { InfoComponent } from '../info/info.component';
import { MatDialog} from '@angular/material';

@Component({
  selector: 'nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent
{
    public app_name: string = environment.app_name;
    public version: string = environment.VERSION;
    public read_the_docs: string = environment.read_the_docs;
    
    faCaretUp = faCaretUp;
    faCaretDown = faCaretDown;
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

  isHandset$: Observable<boolean> = this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small])
    .pipe(
      map(result => result.matches)
    );

  constructor(private breakpointObserver: BreakpointObserver, public dialog: MatDialog)
  {

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
