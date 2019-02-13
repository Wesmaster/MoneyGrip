import { Component, OnInit, Input, Output, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, ValidationErrors } from '@angular/forms';
import { EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, SELECT_PANEL_INDENT_PADDING_X } from '@angular/material';
import { MatDialog} from '@angular/material';
import { BudgetService } from '../budget.service';
import { LabelService } from '../../labels/label.service';
import { Label } from '../../labels/label/label';
import { CategorieService } from '../../categorieen/categorie.service';
import { Categorie } from '../../categorieen/categorie/categorie';
import { Interval } from '../../interval.enum';
import { CurrencyPipe } from '../../currency.pipe';
import { CustomValidator } from '../../custom.validators';
import { DialogMeldingComponent } from '../../dialog-melding/dialog-melding.component';

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.css']
})
export class BudgetComponent implements OnInit
{
  @Input() id: number;
  @Output() getChange = new EventEmitter<number>();

  form: FormGroup;
  labels: Label[] = [];
  categorieen: Categorie[] = [];
  intervalEnum = Interval;
  selectedCategorie: number;
  titelText: string = "Budget";

  constructor(private service: BudgetService, private labelService: LabelService, private categorieService: CategorieService, public dialogRef: MatDialogRef<BudgetComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number, private customCurrency: CurrencyPipe, public dialog: MatDialog, private customValidator: CustomValidator)
  {
    this.id = data;

    if(typeof(this.id) == null)
    {
      return;
    }

    delete this.form;
    this.getLabels();
    this.getCategorieen();
    this.createForm();

    if(this.id == 0)
    {
      this.form.reset({id: 0, laatstGewijzigd: "01-01-1900", categorie: "", label: "", bedrag: "", begindatum: "", einddatum: "", interval: ""});
    }
    else
    {
      this.get();
    }
  }

  onItemChange(categorieId): void
  {
    this.selectedCategorie = categorieId;
    this.form.patchValue({label: ""});
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
    this.dialogRef.updatePosition({top: '5%', left: '39%'});
  }

  createForm()
  {
    this.form = new FormGroup({
      id: new FormControl(0),
      laatstGewijzigd: new FormControl(''),
      categorie: new FormControl('',[
        Validators.required
      ]),
      label: new FormControl('',[
        Validators.required
      ]),
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
    this.service.get(this.id).subscribe(item => {
      this.form.patchValue(item)
      this.form.patchValue({categorie: item.labelNavigation.categorie})
      this.selectedCategorie = item.labelNavigation.categorie;
    });
  }

  async onSubmit()
  {
    var formToSend = this.form;
    formToSend.patchValue({bedrag: this.customCurrency.transformToNumber(formToSend.get("bedrag").value)});

    var label = this.getLabelById(formToSend.get("label").value);
    var categorie = this.getCategorieById(formToSend.get("categorie").value);

    var duplicateBudgetText = 'Er bestaat al een budget "' + categorie.naam + " - " + label.naam + '" in datumbereik "' + this.convertDatum(formToSend.get("begindatum").value);
    if(formToSend.get("einddatum").value != "")
    {
      duplicateBudgetText += " - " + this.convertDatum(formToSend.get("einddatum").value) + '"';
    }else
    {
      duplicateBudgetText += '.."';
    }

    if(this.id == 0)
    {
      await this.service.add(formToSend.value).then
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
      await this.service.update(formToSend.value).then
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

  getLabelById(id: number): Label
  {
    for (const it of this.labels) {
      if(it.id == id)
      {
        return it;
      }
    };

    return null;
  }

  getCategorieById(id): Categorie
  {
    for (const it of this.categorieen) {
      if(it.id == id)
      {
        return it;
      }
    };

    return null;
  }

  getLabels()
  {
    this.labelService.getAll().subscribe(items => this.labels = items);
  }

  getCategorieen()
  {
    this.categorieService.getAll().subscribe(items => this.categorieen = items);
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

  convertDatum(datum) : String
  {
    // assumes yyyy-MM-dd format
    if ((typeof datum === 'string') && (datum.indexOf('-') > -1)) {
      const str = datum.split('-');
      const year = str[0];
      const month = str[1];
      const date = str[2];

      return date + "/" + month + "/" + year;
    }
    return "";
  }
}