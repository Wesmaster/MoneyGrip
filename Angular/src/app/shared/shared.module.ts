import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableComponent } from './table/table.component';
import { TitelComponent } from './titel/titel.component';
import { DoclinkComponent } from './doclink/doclink.component';
import { ButtonToevoegenComponent } from './button-toevoegen/button-toevoegen.component';
import { ZoekbalkComponent } from './zoekbalk/zoekbalk.component';

@NgModule({
  declarations: [TableComponent, TitelComponent, DoclinkComponent, ButtonToevoegenComponent, ZoekbalkComponent],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    TableComponent,
    TitelComponent,
    DoclinkComponent,
    ButtonToevoegenComponent,
    ZoekbalkComponent
  ]
})
export class SharedModule { }
