import { Component, OnInit, Input, Output, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatChipList } from '@angular/material';
import { InkomstService } from '../inkomst.service';
import { LabelService } from '../../labels/label.service';
import { Label } from '../../labels/label/label';
import { PersoonService } from '../../personen/persoon.service';
import { Persoon } from '../../personen/persoon/persoon';
import { Interval } from '../../interval.enum';
import { CurrencyPipe } from '../../currency.pipe';
import { CustomValidator } from '../../custom.validators';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import {ElementRef, ViewChild} from '@angular/core';
import {MatAutocomplete} from '@angular/material/autocomplete';
import {Observable} from 'rxjs';
import { BaseEditComponent } from '../../base/base-edit.component';

@Component({
  selector: 'app-inkomst',
  templateUrl: './inkomst.component.html',
  styleUrls: ['./inkomst.component.scss']
})
export class InkomstComponent extends BaseEditComponent implements OnInit
{
  @Input() id: number;
  @Output() getChange = new EventEmitter<number>();


  personen: Persoon[];
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

  constructor(private service: InkomstService, private labelService: LabelService, private persoonService: PersoonService, public dialogRef: MatDialogRef<InkomstComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number, private customCurrency: CurrencyPipe, private customValidator: CustomValidator)
  {
    super(dialogRef);

    this.id = data;

    if(typeof(this.id) == null)
    {
      return;
    }

    this.getPersonen();
    this.createForm();

    if(this.id == 0)
    {
      this.labelsLoaded = Promise.resolve(true);
      this.form.reset({id: 0, label: "", persoon: "", bedrag: "", begindatum: "", einddatum: "", interval: ""});
    }
    else
    {
      this.get();
    }

    this.allLabels = this.labelService.getData();
  }

  keys(any): Array<string>
  {
    var keys = Object.keys(any);
    return keys.slice(keys.length / 2);
  }

  ngOnInit()
  {
    this.setDialogSize();
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

  get(): void
  {
    this.service.get(this.id).subscribe(item => {
        this.form.patchValue(item);
        this.form.patchValue({persoon: item.persoon ? item.persoon.id : null});
        
        this.gekozenLabels.splice(0,this.gekozenLabels.length);
        item.label.forEach(labelObject => {
            this.gekozenLabels.push(labelObject);
        })
        this.updateFormControlLabel(this.gekozenLabels);
        this.labelsLoaded = Promise.resolve(true);
    });
  }

  async onSubmit()
  {
    this.form.patchValue({bedrag: this.customCurrency.transformToNumber(this.form.get("bedrag").value)});

    if(this.id == 0)
    {
      await this.service.add(this.form.value).then(item => {

      });
    }
    else
    {
      await this.service.update(this.form.value).then(item => {

      });
    }

    this.id = null;
    this.dialogRef.close(true);
  }

  getPersonen()
  {
    this.persoonService.getAll().subscribe(items => this.personen = items);
  }

  currencyInputChanged(value)
  {
    var num = value.replace(",", "").replace("€", "");
    return Number(num);
  }
}
