import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule, MatNativeDateModule, DateAdapter, MatDialogModule, MatInputModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { DateFormat } from './date-format';
import { AutofocusDirective } from './autofocus.directive';

import { PersonenComponent } from './personen/personen.component';
import { PersoonComponent } from './personen/persoon/persoon.component';
import { ButtonVerwijderenComponent } from './button-verwijderen/button-verwijderen.component';
import { ButtonAnnulerenComponent } from './button-annuleren/button-annuleren.component';
import { ButtonActieComponent } from './button-actie/button-actie.component';
import { ButtonToevoegenComponent } from './button-toevoegen/button-toevoegen.component';
import { TableFilterPipe } from './table-filter.pipe';
import { DialogBevestigenComponent } from './dialog-bevestigen/dialog-bevestigen.component';
import { CategorieenComponent } from './categorieen/categorieen.component';
import { CategorieComponent } from './categorieen/categorie/categorie.component';
import { LabelsComponent } from './labels/labels.component';
import { LabelComponent } from './labels/label/label.component';
import { InkomstenComponent } from './inkomsten/inkomsten.component';
import { InkomstComponent } from './inkomsten/inkomst/inkomst.component';
import { FilterPipe } from './filter.pipe';
import { CurrencyPipe } from './currency.pipe';
import { ContractenComponent } from './contracten/contracten.component';
import { ContractComponent } from './contracten/contract/contract.component';
import { BudgettenComponent } from './budgetten/budgetten.component';
import { BudgetComponent } from './budgetten/budget/budget.component';
import { CustomValidator } from './custom.validators';
import { DialogMeldingComponent } from './dialog-melding/dialog-melding.component';
import { ReserveringenComponent } from './reserveringen/reserveringen.component';
import { ReserveringComponent } from './reserveringen/reservering/reservering.component';
import { AfschrijvingenComponent } from './afschrijvingen/afschrijvingen.component';
import { AfschrijvingComponent } from './afschrijvingen/afschrijving/afschrijving.component';
import { SpaardoelenComponent } from './spaardoelen/spaardoelen.component';
import { SpaardoelComponent } from './spaardoelen/spaardoel/spaardoel.component';
import { BegrotingComponent } from './begroting/begroting.component';
import { InfoComponent } from './info/info.component';
import { BackupComponent } from './backup/backup.component';
import { SharedModule } from './shared/shared.module';
import { registerLocaleData } from '@angular/common';
import localeNL from '@angular/common/locales/nl';
import { LOCALE_ID } from '@angular/core';
import { DialogLadenComponent } from './dialog-laden/dialog-laden.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

registerLocaleData(localeNL);

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    PersonenComponent,
    PersoonComponent,
    ButtonVerwijderenComponent,
    ButtonAnnulerenComponent,
    ButtonActieComponent,
    ButtonToevoegenComponent,
    TableFilterPipe,
    AutofocusDirective,
    DialogBevestigenComponent,
    CategorieenComponent,
    CategorieComponent,
    LabelsComponent,
    LabelComponent,
    InkomstenComponent,
    InkomstComponent,
    FilterPipe,
    CurrencyPipe,
    ContractenComponent,
    ContractComponent,
    BudgettenComponent,
    BudgetComponent,
    DialogMeldingComponent,
    ReserveringenComponent,
    ReserveringComponent,
    AfschrijvingenComponent,
    AfschrijvingComponent,
    SpaardoelenComponent,
    SpaardoelComponent,
    BegrotingComponent,
    InfoComponent,
    BackupComponent,
    DialogLadenComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    MatDialogModule,
    BrowserAnimationsModule,
    MatInputModule,
    NgbModule,
    SharedModule,
    FontAwesomeModule
  ],
  providers: [{ provide: DateAdapter, useClass: DateFormat }, CurrencyPipe, CustomValidator, {provide: LOCALE_ID, useValue: 'nl'}],
  bootstrap: [AppComponent],
  entryComponents: [DialogBevestigenComponent, PersoonComponent, CategorieComponent, LabelComponent, InkomstComponent, ContractComponent, BudgetComponent, DialogMeldingComponent, ReserveringComponent, AfschrijvingComponent, SpaardoelComponent, InfoComponent, DialogLadenComponent]
})
export class AppModule { }
