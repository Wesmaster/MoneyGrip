import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './table/table.component';
import { TitelComponent } from './titel/titel.component';

@NgModule({
  declarations: [TableComponent, TitelComponent],
  imports: [
    CommonModule
  ],
  exports: [
    TableComponent,
    TitelComponent
  ]
})
export class SharedModule { }
