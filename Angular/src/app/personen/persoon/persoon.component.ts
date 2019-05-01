import { Component, OnInit, Input, Output, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PersoonService } from '../persoon.service';
import { EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { BaseEditComponent } from '../../base/base-edit.component';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-persoon',
  templateUrl: './persoon.component.html',
  styleUrls: ['./persoon.component.scss']
})
export class PersoonComponent extends BaseEditComponent implements OnInit {

  @Input() id: number;
  @Output() getChange = new EventEmitter<number>();

  form: FormGroup;
  titelText: string = "Persoon";
  faDownload = faDownload;

  constructor(private service: PersoonService, public dialogRef: MatDialogRef<PersoonComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number)
  {
    super(dialogRef);

    this.id = data;

    if(typeof(this.id) == null)
    {
      return;
    }

    delete this.form;
    this.createForm();

    if(this.id == 0)
    {
      this.form.reset({id: 0, laatstGewijzigd: "01-01-1900", voornaam: "", achternaam: ""});
    }
    else
    {
      this.get();
    }
  }

  ngOnInit()
  {
    this.setDialogSize();
    this.changeDialogPosition();
  }

  createForm()
  {
    this.form = new FormGroup({
      id: new FormControl(0),
      laatstGewijzigd: new FormControl(''),
      voornaam: new FormControl('',[
        Validators.required,
        Validators.maxLength(20)
      ]),
      achternaam: new FormControl('',[
        Validators.maxLength(30)
      ])
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
  }
}
