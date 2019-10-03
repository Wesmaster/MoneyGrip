import { Component, OnInit, Input, Output, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AfschrijvingService } from '../afschrijving.service';
import { LabelService } from '../../labels/label.service';
import { Label } from '../../labels/label/label';
import { CurrencyPipe } from '../../currency.pipe';
import { faFileUpload, faTimesCircle, faDownload } from '@fortawesome/free-solid-svg-icons';
import { BaseEditComponent } from '../../base/base-edit.component';
import {Observable} from 'rxjs';
import { BasisService } from '../../base/basis.service';

@Component({
  selector: 'app-afschrijving',
  templateUrl: './afschrijving.component.html',
  styleUrls: ['./afschrijving.component.scss']
})
export class AfschrijvingComponent extends BaseEditComponent implements OnInit {
  @Input() id: number;
  @Output() getChange = new EventEmitter<number>();

  titelText: string = "Afschrijving";
  faFileUpload = faFileUpload;
  faTimesCircle = faTimesCircle;
  faDownload = faDownload;

  labelsLoaded: Promise<boolean>;
  allLabels: Label[] = [];
  labelInputCtrl = new FormControl();
  gefilterdeLabels: Observable<Label[]>;
  gekozenLabels: Label[] = [];

  constructor(public service: BasisService, private labelService: LabelService, public dialogRef: MatDialogRef<AfschrijvingComponent>,
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
      this.form.reset({id: 0, label: "", aankoopdatum: "", aankoopbedrag: "", verwachteLevensduur: "", garantie: "", factuur: "", factuurNaam: ""});
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
    this.form.addControl("aankoopbedrag", new FormControl('', [Validators.required, Validators.pattern('[0-9,\.]*')]));
    this.form.addControl("aankoopdatum", new FormControl('', [Validators.required]));
    this.form.addControl("verwachteLevensduur", new FormControl('', [Validators.required, Validators.pattern('[0-9]*')]));
    this.form.addControl("garantie", new FormControl('', [Validators.pattern('[0-9]*')]));
    this.form.addControl("factuur", new FormControl(''));
    this.form.addControl("factuurNaam", new FormControl(''));
  }

  onFileChange(event) {
    let reader = new FileReader();
    if(event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.form.get('factuur').setValue(reader.result.toString().split(",")[1]);
        this.form.get('factuurNaam').setValue(file.name);
        this.form.markAsDirty();
      };
    }
  }

  async onSubmit()
  {
    this.form.patchValue({aankoopbedrag: this.customCurrency.transformToNumber(this.form.get("aankoopbedrag").value)});
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
    this.resetFormControl("document");
    this.resetFormControl("documentNaam");
  }
}
