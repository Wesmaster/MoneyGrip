import { Component, OnInit, Input, Output, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ReserveringService } from '../reservering.service';
import { LabelService } from '../../labels/label.service';
import { Label } from '../../labels/label/label';
import { Maanden } from '../../maanden.enum';
import { CurrencyPipe } from '../../currency.pipe';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { BaseEditComponent } from '../../base/base-edit.component';
import {Observable} from 'rxjs';
import { BasisService } from '../../base/basis.service';

@Component({
  selector: 'app-reservering',
  templateUrl: './reservering.component.html',
  styleUrls: ['./reservering.component.scss']
})
export class ReserveringComponent extends BaseEditComponent implements OnInit {
  
  @Input() id: number;
  @Output() getChange = new EventEmitter<number>();

  maandenEnum = Maanden;
  selectedCategorie: number;
  titelText: string = "Reservering";
  faDownload = faDownload;

  labelsLoaded: Promise<boolean>;
  allLabels: Label[] = [];
  labelInputCtrl = new FormControl();
  gefilterdeLabels: Observable<Label[]>;
  gekozenLabels: Label[] = [];

  constructor(public service: BasisService, private labelService: LabelService, public dialogRef: MatDialogRef<ReserveringComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number, public customCurrency: CurrencyPipe)
  {
      super(service, dialogRef, customCurrency);
    this.id = data;

    if(typeof(this.id) == null)
    {
      return;
    }

    this.createForm();

    if(this.id == 0)
    {
        this.labelsLoaded = Promise.resolve(true);
      this.form.reset({id: 0, label: "", bedrag: "", maand: "", omschrijving: ""});
    }
    else
    {
      this.get(this.id);
    }
    this.allLabels = this.labelService.getData();
  }

  ngOnInit()
  {
    this.changeDialogPosition();
  }

  createForm()
  {
    this.form.addControl("label", new FormControl('', [Validators.required]));
    this.form.addControl("bedrag", new FormControl('', [Validators.required, Validators.pattern('[0-9,\.]*')]));
    this.form.addControl("maand", new FormControl('', [Validators.required]));
    this.form.addControl("omschrijving", new FormControl(''));
  }
}
