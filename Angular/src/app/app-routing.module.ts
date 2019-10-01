import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PersonenComponent } from './personen/personen.component';
import { CategorieenComponent } from './categorieen/categorieen.component';
import { LabelsComponent } from './labels/labels.component';
import { InkomstenComponent } from './inkomsten/inkomsten.component';
import { ContractenComponent } from './contracten/contracten.component';
import { BudgettenComponent } from './budgetten/budgetten.component';
import { ReserveringenComponent } from './reserveringen/reserveringen.component';
import { AfschrijvingenComponent } from './afschrijvingen/afschrijvingen.component';
import { SpaardoelenComponent } from './spaardoelen/spaardoelen.component';
import { BegrotingComponent } from './begroting/begroting.component';
import { BackupComponent } from './backup/backup.component';
import { LeningenComponent } from './leningen/leningen.component';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'personen', component: PersonenComponent },
  { path: 'categorieen', component: CategorieenComponent },
  { path: 'labels', component: LabelsComponent },
  { path: 'inkomsten', component: InkomstenComponent },
  { path: 'contracten', component: ContractenComponent },
  { path: 'budgetten', component: BudgettenComponent },
  { path: 'reserveringen', component: ReserveringenComponent },
  { path: 'afschrijvingen', component: AfschrijvingenComponent },
  { path: 'spaardoelen', component: SpaardoelenComponent },
  { path: 'begroting', component: BegrotingComponent },
  { path: 'backup', component: BackupComponent },
  { path: 'leningen', component: LeningenComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
