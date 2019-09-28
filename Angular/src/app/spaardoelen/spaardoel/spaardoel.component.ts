import { Component, OnInit, Input, Output, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SpaardoelService } from '../spaardoel.service';
import { LabelService } from '../../labels/label.service';
import { Label } from '../../labels/label/label';
import { CurrencyPipe } from '../../currency.pipe';
import { CustomValidator } from '../../custom.validators';
import { Maanden } from '../../maanden.enum';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { BaseEditComponent } from '../../base/base-edit.component';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-spaardoel',
  templateUrl: './spaardoel.component.html',
  styleUrls: ['./spaardoel.component.scss']
})
export class SpaardoelComponent extends BaseEditComponent implements OnInit {
  @Input() id: number;
  @Output() getChange = new EventEmitter<number>();

  maandenEnum = Maanden;
  titelText: string = "Spaardoel";
  faDownload = faDownload;

  labelsLoaded: Promise<boolean>;
  allLabels: Label[] = [];
  labelInputCtrl = new FormControl();
  gefilterdeLabels: Observable<Label[]>;
  gekozenLabels: Label[] = [];

  constructor(private service: SpaardoelService, private labelService: LabelService, public dialogRef: MatDialogRef<SpaardoelComponent>,
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
      this.form.reset({id: 0, label: "", percentage: "", eindbedrag: "", eersteMaand: "", laatsteMaand: "", omschrijving: ""});
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
      return keys.slice(keys.length / 2).slice(1, keys.length);
  }

  ngOnInit()
  {
    this.setDialogSize();
    this.changeDialogPosition();
  }

  createForm()
  {
    this.form.addControl("label", new FormControl('', [Validators.required]));
    this.form.addControl("percentage", new FormControl('', [Validators.pattern('[0-9]*'), Validators.max(100)]));
    this.form.addControl("eindbedrag", new FormControl('', [Validators.pattern('[0-9,\.]*')]));
    this.form.addControl("eersteMaand", new FormControl('', [Validators.required]));
    this.form.addControl("laatsteMaand", new FormControl('', [Validators.required]));
    this.form.addControl("omschrijving", new FormControl('', [Validators.maxLength(200)]));
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

  async onSubmit()
  {
    if(this.form.get("eindbedrag").value)
    {
      this.form.patchValue({eindbedrag: this.customCurrency.transformToNumber(this.form.get("eindbedrag").value)});
    }
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
}
