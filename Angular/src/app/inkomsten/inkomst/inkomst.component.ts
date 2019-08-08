import { Component, OnInit, Input, Output, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {ElementRef, ViewChild} from '@angular/core';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { forEach } from '@angular/router/src/utils/collection';

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
  allLabels: string[] = [];
  personen: Persoon[];
  intervalEnum = Interval;
  titelText: string = "Inkomst";
  faDownload = faDownload;
  labelsLoaded: Promise<boolean>;

  visible = true;
  selectable = false;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();
  filteredFruits: Observable<string[]>;
  labels: Label[] = [];

  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  @ViewChild('chipList') chipList: MatChipList;

  constructor(private service: InkomstService, private labelService: LabelService, private persoonService: PersoonService, public dialogRef: MatDialogRef<InkomstComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number, private customCurrency: CurrencyPipe, private customValidator: CustomValidator)
  {
    this.id = data;

    if(typeof(this.id) == null)
    {
      return;
    }

    delete this.form;
    this.getPersonen();
    this.createForm();

    if(this.id == 0)
    {
      this.form.reset({id: 0, label: "", persoon: "", bedrag: "", begindatum: "", einddatum: "", interval: ""});
      this.labelsLoaded = Promise.resolve(true);
    }
    else
    {
      this.get();
    }

    this.allLabels = this.labelService.grapLabelNames();

    this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
        startWith(null),
        map((fruit: string | null) => fruit ? this._filter(fruit) : this.allLabels.slice()));
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
      label: new FormControl('',[
        Validators.required
      ]),
      persoon: new FormControl(''),
      bedrag: new FormControl('',[
        Validators.required,
        Validators.pattern('[0-9,\.]*'),
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
    this.service.get(this.id).subscribe(item => {this.form.patchValue(item);
        
    this.labels.splice(0,this.labels.length);
    item.label.forEach(labelObject => {
        this.labels.push(labelObject);
    })
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

  getKeyByValue(object, value) {
    return object.keys().find(key => object.get(key) === value);
  }


  add(event: MatChipInputEvent): void {
    // Add fruit only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      

      // Add our fruit
      if ((value || '').trim()) {
     //   this.labels.push(value.trim());
      }

      this.updateFormControlLabel();

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.fruitCtrl.setValue(null);
    }
  }

  remove(fruit: Label): void {
    const index = this.labels.indexOf(fruit);

    if (index >= 0) {
      this.labels.splice(index, 1);
    }

    this.updateFormControlLabel();
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.labels.push(event.option.value);

    this.updateFormControlLabel();

    this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allLabels.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
  }

  private updateFormControlLabel()
  {
    var labelIds: number[] = [];
    this.labels.forEach(label => {
         labelIds.push(label.id);
    });
    this.form.patchValue({label: labelIds});

    this.form.markAsDirty();
  }
}
