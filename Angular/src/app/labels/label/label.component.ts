import { Component, OnInit, Input, Output, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LabelService } from '../label.service';
import { BaseEditComponent } from '../../base/base-edit.component';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { BasisService } from '../../base/basis.service';

@Component({
  selector: 'app-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.scss']
})
export class LabelComponent extends BaseEditComponent implements OnInit
{
  @Input() id: number;
  @Output() getChange = new EventEmitter<number>();

  form: FormGroup;
  titelText: string = "Label";
  faDownload = faDownload;

  constructor(public service: BasisService, private labelService: LabelService, public dialogRef: MatDialogRef<LabelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number)
  {
    super(service, dialogRef, null);

    this.id = data;

    if(typeof(this.id) == null)
    {
      return;
    }

    delete this.form;
    this.createForm();

    if(this.id == 0)
    {
      this.form.reset({id: 0, laatstGewijzigd: "01-01-1900", naam: ""});
    }
    else
    {
      this.get();
    }
  }

  ngOnInit()
  {
    this.changeDialogPosition();
  }

  createForm()
  {
    this.form = new FormGroup({
      id: new FormControl(0),
      laatstGewijzigd: new FormControl(''),
      naam: new FormControl('',[
        Validators.required,
        Validators.maxLength(50)
      ]),
    });
  }

  get(): void
  {
    this.service.get(this.id).subscribe(item => this.form.patchValue(item));
  }

  async onSubmit()
  {
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
    this.labelService.loadAll();
  }
}
