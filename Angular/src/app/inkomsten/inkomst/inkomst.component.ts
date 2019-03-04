import { Component, OnInit, Input, Output, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { InkomstService } from '../inkomst.service';
import { LabelService } from '../../labels/label.service';
import { Label } from '../../labels/label/label';
import { PersoonService } from '../../personen/persoon.service';
import { Persoon } from '../../personen/persoon/persoon';
import { Interval } from '../../interval.enum';
import { CurrencyPipe } from '../../currency.pipe';
import { CustomValidator } from '../../custom.validators';

@Component({
  selector: 'app-inkomst',
  templateUrl: './inkomst.component.html',
  styleUrls: ['./inkomst.component.scss']
})
export class InkomstComponent implements OnInit
{
  @Input() id: number;
  @Output() getChange = new EventEmitter<number>();

  form: FormGroup;
  labels: Label[] = [];
  personen: Persoon[];
  intervalEnum = Interval;
  titelText: string = "Inkomst";

  constructor(private service: InkomstService, private labelService: LabelService, private persoonService: PersoonService, public dialogRef: MatDialogRef<InkomstComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number, private customCurrency: CurrencyPipe, private customValidator: CustomValidator)
  {
    this.id = data;

    if(typeof(this.id) == null)
    {
      return;
    }

    delete this.form;
    this.getLabels();
    this.getPersonen();
    this.createForm();

    if(this.id == 0)
    {
      this.form.reset({id: 0, laatstGewijzigd: "01-01-1900", label: "", persoon: "", bedrag: "", begindatum: "", einddatum: "", interval: ""});
    }
    else
    {
      this.get();
    }
  }

  keys(any): Array<string>
  {
      var keys = Object.keys(any);
      return keys.slice(keys.length / 2);
  }

  ngOnInit()
  {
    this.changePosition();
  }

  changePosition()
  {
    this.dialogRef.updatePosition({top: '5%', left: '37%'});
  }

  createForm()
  {
    this.form = new FormGroup({
      id: new FormControl(0),
      laatstGewijzigd: new FormControl(''),
      label: new FormControl(''),
      persoon: new FormControl(''),
      bedrag: new FormControl('',[
        Validators.required,
        Validators.pattern('[0-9,\.]*')
      ]),
      begindatum: new FormControl('',[
        Validators.required
      ]),
      einddatum: new FormControl(''),
      interval: new FormControl('',[
        Validators.required
      ])
    }, {validators: this.customValidator.dateLessThanValidator()});
  }

  get(): void
  {
    this.service.get(this.id).subscribe(item => this.form.patchValue(item));
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

  getLabels()
  {
    this.labelService.getAll().subscribe(items => this.labels = items);
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
