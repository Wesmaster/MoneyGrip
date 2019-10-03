import { Component, OnInit, Input, Output, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatChipList } from '@angular/material';
import { InkomstService } from '../inkomst.service';
import { LabelService } from '../../labels/label.service';
import { Label } from '../../labels/label/label';
import { Interval } from '../../interval.enum';
import { CurrencyPipe } from '../../currency.pipe';
import { CustomValidator } from '../../custom.validators';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import {ElementRef, ViewChild} from '@angular/core';
import {MatAutocomplete} from '@angular/material/autocomplete';
import {Observable} from 'rxjs';
import { BaseEditComponent } from '../../base/base-edit.component';
import { BasisService } from '../../base/basis.service';

@Component({
  selector: 'app-inkomst',
  templateUrl: './inkomst.component.html',
  styleUrls: ['./inkomst.component.scss']
})
export class InkomstComponent extends BaseEditComponent implements OnInit
{
  @Input() id: number;
  @Output() getChange = new EventEmitter<number>();

  intervalEnum = Interval;
  titelText: string = "Inkomst";
  faDownload = faDownload;

  labelsLoaded: Promise<boolean>;
  allLabels: Label[] = [];
  labelInputCtrl = new FormControl();
  gefilterdeLabels: Observable<Label[]>;
  gekozenLabels: Label[] = [];

  @ViewChild('labelInput') labelInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  @ViewChild('chipList') chipList: MatChipList;

  constructor(public service: BasisService, private labelService: LabelService, public dialogRef: MatDialogRef<InkomstComponent>,
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
      this.form.reset({id: 0, label: "", persoon: "", bedrag: "", begindatum: "", einddatum: "", interval: ""});
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
      this.form.addControl("persoon", new FormControl(''));
      this.form.addControl("bedrag", new FormControl('', [Validators.required, Validators.pattern('[0-9,\.]*')]));
      this.form.addControl("begindatum", new FormControl('', [Validators.required]));
      this.form.addControl("einddatum", new FormControl(''));
      this.form.addControl("interval", new FormControl('', [Validators.required]));

      this.form.setValidators(this.customValidator.dateLessThanValidator());
  }
}
