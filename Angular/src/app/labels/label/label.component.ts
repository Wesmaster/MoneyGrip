import { Component, OnInit, Input, Output, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LabelService } from '../label.service';
import { CategorieService } from '../../categorieen/categorie.service';
import { Categorie } from '../../categorieen/categorie/categorie';

@Component({
  selector: 'app-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.css']
})
export class LabelComponent implements OnInit
{
  @Input() id: number;
  @Output() getChange = new EventEmitter<number>();

  form: FormGroup;
  items: Categorie[];

  constructor(private service: LabelService, private categorieService: CategorieService, public dialogRef: MatDialogRef<LabelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number)
  {
    this.id = data;

    if(typeof(this.id) == null)
    {
      return;
    }

    delete this.form;
    this.getCategorieen();
    this.createForm();

    if(this.id == 0)
    {
      this.form.reset({id: 0, laatstGewijzigd: "01-01-1900", naam: "", categorie: ""});
    }
    else
    {
      this.get();
    }
  }

  ngOnInit()
  {
    this.changePosition();
  }

  changePosition()
  {
    this.dialogRef.updatePosition({top: '5%', left: '40%'});
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
      categorie: new FormControl('',[
        Validators.required
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
  }

  getCategorieen()
  {
    this.categorieService.getAll().subscribe(items => this.items = items);
  }
}
