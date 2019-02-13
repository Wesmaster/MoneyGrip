import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './table/table.component';
import { TitelComponent } from './titel/titel.component';
import { DoclinkComponent } from './doclink/doclink.component';
import { ButtonToevoegenComponent } from './button-toevoegen/button-toevoegen.component';

@NgModule({
  declarations: [TableComponent, TitelComponent, DoclinkComponent, ButtonToevoegenComponent],
  imports: [
    CommonModule
  ],
  exports: [
    TableComponent,
    TitelComponent,
    DoclinkComponent,
    ButtonToevoegenComponent
  ]
})
export class SharedModule { }
