import { Component } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  isExpanded = false;
  public version: string = environment.VERSION;

  collapse() {
    this.isExpanded = false;
  }

  toggleBeheer() {
    this.isExpanded = !this.isExpanded;
  }
}
