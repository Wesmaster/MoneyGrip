import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableComponent } from './table/table.component';
import { TitelComponent } from './titel/titel.component';
import { DoclinkComponent } from './doclink/doclink.component';
import { ButtonToevoegenComponent } from './button-toevoegen/button-toevoegen.component';
import { ZoekbalkComponent } from './zoekbalk/zoekbalk.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LabelsComponent } from './labels/labels.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule, MatIconModule, MatAutocompleteModule, MatTableModule, MatCheckboxModule } from '@angular/material';
import { AlgemeenComponent } from './algemeen/algemeen.component';

@NgModule({
  declarations: [TableComponent, TitelComponent, DoclinkComponent, ButtonToevoegenComponent, ZoekbalkComponent, LabelsComponent, AlgemeenComponent],
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule,
    MatTableModule,
    MatCheckboxModule
  ],
  exports: [
    TableComponent,
    TitelComponent,
    DoclinkComponent,
    ButtonToevoegenComponent,
    ZoekbalkComponent,
    LabelsComponent,
    AlgemeenComponent
  ]
})
export class SharedModule { }
