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

  constructor(private service: ContractService, private labelService: LabelService, public dialogRef: MatDialogRef<ContractComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number, private customCurrency: CurrencyPipe, private customValidator: CustomValidator)
  {
      super(dialogRef);
    this.id = data;

    if(typeof(this.id) == null)
    {
      return;
    }

    this.createForm();

    if(this.id == 0)
    {
        this.labelsLoaded = Promise.resolve(true);
      this.form.reset({id: 0, categorie: "", label: "", bedrag: "", begindatum: "", einddatum: "", interval: "", document: "", documentNaam: ""});
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
    this.form.addControl("bedrag", new FormControl('', [Validators.required, Validators.pattern('[0-9,\.]*')]));
    this.form.addControl("begindatum", new FormControl('', [Validators.required]));
    this.form.addControl("einddatum", new FormControl(''));
    this.form.addControl("interval", new FormControl('', [Validators.required]));
    this.form.addControl("document", new FormControl(''));
    this.form.addControl("documentNaam", new FormControl(''));

    this.form.setValidators(this.customValidator.dateLessThanValidator());
  }

  get(): void
  {
    this.service.get(this.id).subscribe(item => {
      this.form.patchValue(item)

      this.gekozenLabels.splice(0,this.gekozenLabels.length);
      item.label.forEach(labelObject => {
          this.gekozenLabels.push(labelObject);
      })
      this.updateFormControlLabel(this.gekozenLabels);
      this.labelsLoaded = Promise.resolve(true);
    });
  }

  onFileChange(event) 
  {
    let reader = new FileReader();
    if(event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.form.get('document').setValue(reader.result.toString().split(",")[1]);
        this.form.get('documentNaam').setValue(file.name);
        this.form.markAsDirty();
      };
    }
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

  verwijderDocument()
  {
    this.form.get('document').reset();
    this.form.get('documentNaam').reset();
    this.form.markAsDirty();
  }
}
