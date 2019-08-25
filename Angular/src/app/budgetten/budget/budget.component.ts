import { Component, OnInit, Input, Output, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatDialog} from '@angular/material';
import { BudgetService } from '../budget.service';
import { LabelService } from '../../labels/label.service';
import { Label } from '../../labels/label/label';
import { Interval } from '../../interval.enum';
import { CurrencyPipe } from '../../currency.pipe';
import { CustomValidator } from '../../custom.validators';
import { DialogMeldingComponent } from '../../dialog-melding/dialog-melding.component';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { BaseEditComponent } from '../../base/base-edit.component';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.scss']
})
export class BudgetComponent extends BaseEditComponent implements OnInit
{
  @Input() id: number;
  @Output() getChange = new EventEmitter<number>();

  intervalEnum = Interval;
  titelText: string = "Budget";
  faDownload = faDownload;

  labelsLoaded: Promise<boolean>;
  allLabels: Label[] = [];
  labelInputCtrl = new FormControl();
  gefilterdeLabels: Observable<Label[]>;
  gekozenLabels: Label[] = [];

  constructor(private service: BudgetService, private labelService: LabelService, public dialogRef: MatDialogRef<BudgetComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number, private customCurrency: CurrencyPipe, public dialog: MatDialog, private customValidator: CustomValidator)
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
      this.form.reset({id: 0, label: "", bedrag: "", begindatum: "", einddatum: "", interval: ""});
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

  async onSubmit()
  {
    this.form.patchValue({bedrag: this.customCurrency.transformToNumber(this.form.get("bedrag").value)});

    var duplicateBudgetText = 'Er bestaat al een budget met deze labels in de opgegeven periode.';

    if(this.id == 0)
    {
      await this.service.add(this.form.value).then
      (
        success => 
        {
          this.id = null;
          this.dialogRef.close(true);
        },error =>
        {
          if(error.status == "409")
          {
            this.throwMessage(duplicateBudgetText);
          }
        }
      );
    }
    else
    {
      await this.service.update(this.form.value).then
      (
        success => 
        {
          this.id = null;
          this.dialogRef.close(true);
        },error =>
        {
          if(error.status == "409")
          {
            this.throwMessage(duplicateBudgetText);
          }
        }
      );
    }
  }

  throwMessage(bericht)
  {
    const dialogRef = this.dialog.open(DialogMeldingComponent, {
      data: {bericht: bericht, titel: "Budget bestaat al"},
      panelClass: 'dialog-delete'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result)
      {
        
      }
    });
  }
}