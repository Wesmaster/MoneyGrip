import { Component, OnInit, Input, Output, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, SELECT_PANEL_INDENT_PADDING_X } from '@angular/material';
import { ContractService } from '../contract.service';
import { LabelService } from '../../labels/label.service';
import { Label } from '../../labels/label/label';
import { CategorieService } from '../../categorieen/categorie.service';
import { Categorie } from '../../categorieen/categorie/categorie';
import { Interval } from '../../interval.enum';
import { CurrencyPipe } from '../../currency.pipe';
import { CustomValidator } from '../../custom.validators';

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.css']
})
export class ContractComponent implements OnInit
{
  @Input() id: number;
  @Output() getChange = new EventEmitter<number>();

  form: FormGroup;
  labels: Label[] = [];
  categorieen: Categorie[] = [];
  intervalEnum = Interval;
  selectedCategorie: number;
  documentText: string = "Kies document";
  titelText: string = "Contract";

  constructor(private service: ContractService, private labelService: LabelService, private categorieService: CategorieService, public dialogRef: MatDialogRef<ContractComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number, private customCurrency: CurrencyPipe, private customValidator: CustomValidator)
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
      this.form.reset({id: 0, laatstGewijzigd: "01-01-1900", categorie: "", label: "", bedrag: "", begindatum: "", einddatum: "", interval: "", document: ""});
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
    this.dialogRef.updatePosition({top: '5%', left: '37%'});
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
      ]),
      document: new FormControl('')
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

  onFileChange(event) {
    let reader = new FileReader();
    if(event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.form.get('document').setValue(reader.result.toString().split(",")[1])
        this.documentText = file.name;
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

  getLabels()
  {
    this.labelService.getAll().subscribe(items => this.labels = items);
  }

  getCategorieen()
  {
    this.categorieService.getAll().subscribe(items => this.categorieen = items);
  }
}
