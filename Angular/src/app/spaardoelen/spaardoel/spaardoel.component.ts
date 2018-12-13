import { Component, OnInit, Input, Output, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, SELECT_PANEL_INDENT_PADDING_X } from '@angular/material';
import { SpaardoelService } from '../spaardoel.service';
import { LabelService } from '../../labels/label.service';
import { Label } from '../../labels/label/label';
import { CurrencyPipe } from '../../currency.pipe';
import { CustomValidator } from '../../custom.validators';

@Component({
  selector: 'app-spaardoel',
  templateUrl: './spaardoel.component.html',
  styleUrls: ['./spaardoel.component.css']
})
export class SpaardoelComponent implements OnInit {
  @Input() id: number;
  @Output() getChange = new EventEmitter<number>();

  form: FormGroup;
  labels: Label[] = [];

  constructor(private service: SpaardoelService, private labelService: LabelService, public dialogRef: MatDialogRef<SpaardoelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number, private customCurrency: CurrencyPipe, private customValidator: CustomValidator)
  {
    this.id = data;

    if(typeof(this.id) == null)
    {
      return;
    }

    delete this.form;
    this.getLabels();
    this.createForm();

    if(this.id == 0)
    {
      this.form.reset({id: 0, laatstGewijzigd: "01-01-1900", label: "", percentage: "", eindbedrag: "", begindatum: "", einddatum: "", omschrijving: ""});
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
      label: new FormControl('',[
        Validators.required
      ]),
      percentage: new FormControl('',[
        Validators.pattern('[0-9]*'),
        Validators.max(100)
      ]),
      eindbedrag: new FormControl('',[
        Validators.pattern('[0-9,\.]*')
      ]),
      begindatum: new FormControl('',[
        Validators.required
      ]),
      einddatum: new FormControl(''),
      omschrijving: new FormControl('',[
        Validators.maxLength(200)
      ])
    }, {validators: this.customValidator.dateLessThanValidator()});
  }

  get(): void
  {
    this.service.get(this.id).subscribe(item => {
      this.form.patchValue(item)
      this.form.patchValue({categorie: item.labelNavigation.categorie})
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

  getLabels()
  {
    this.labelService.getAll().subscribe(items => this.labels = items);
  }
}
