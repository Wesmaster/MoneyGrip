import { Component, OnInit, Input, Output, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ContractService } from '../contract.service';
import { LabelService } from '../../labels/label.service';
import { Label } from '../../labels/label/label';
import { Interval } from '../../interval.enum';
import { CurrencyPipe } from '../../currency.pipe';
import { CustomValidator } from '../../custom.validators';
import { faFileUpload, faTimesCircle, faDownload } from '@fortawesome/free-solid-svg-icons';
import { BaseEditComponent } from '../../base/base-edit.component';
import {Observable} from 'rxjs';
import { BasisService } from '../../base/basis.service';

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.scss']
})
export class ContractComponent extends BaseEditComponent implements OnInit
{
  @Input() id: number;
  @Output() getChange = new EventEmitter<number>();

  intervalEnum = Interval;
  selectedCategorie: number;
  titelText: string = "Contract";
  faFileUpload = faFileUpload;
  faTimesCircle = faTimesCircle;
  faDownload = faDownload;

  labelsLoaded: Promise<boolean>;
  allLabels: Label[] = [];
  labelInputCtrl = new FormControl();
  gefilterdeLabels: Observable<Label[]>;
  gekozenLabels: Label[] = [];

  constructor(public service: BasisService, private labelService: LabelService, public dialogRef: MatDialogRef<ContractComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number, public customCurrency: CurrencyPipe, private customValidator: CustomValidator)
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
      this.form.reset({id: 0, label: "", bedrag: "", begindatum: "", einddatum: "", interval: "", document: "", documentNaam: ""});
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
    this.form.addControl("begindatum", new FormControl('', [Validators.required]));
    this.form.addControl("einddatum", new FormControl(''));
    this.form.addControl("interval", new FormControl('', [Validators.required]));
    this.form.addControl("document", new FormControl(''));
    this.form.addControl("documentNaam", new FormControl(''));

    this.form.setValidators(this.customValidator.dateLessThanValidator());
  }

  verwijderDocument()
  {
    this.resetFormControl("document");
    this.resetFormControl("documentNaam");
  }
}
