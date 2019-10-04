import { MatDialogRef, } from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms';
import { Label } from '../labels/label/label';
import { BasisService } from './basis.service';
import { CurrencyPipe } from '../currency.pipe';

export class BaseEditComponent
{
    form: FormGroup;
    gekozenLabels: Label[] = [];
    labelsLoaded: Promise<boolean>;
    id: number;

    constructor(protected service: BasisService, protected dialogRef: MatDialogRef<any>, protected customCurrency: CurrencyPipe)
    {
        delete this.form;
        this.form = new FormGroup(
            {id: new FormControl(0)},
            {});
    }

    protected changeDialogPosition()
    {
      this.dialogRef.updatePosition({top: '5%'});
    }

    protected get(): void
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

    protected getForm(): FormGroup
    {
        return this.form;
    }

    protected onFileChange(event): void 
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

    protected updateFormControlLabel(labels: Label[])
    {
      var labelIds: number[] = [];
      labels.forEach(label => {
           labelIds.push(label.id);
      });
      this.form.patchValue({label: labelIds});
    }
  
    protected updateFormControlLabelAndMarkDirty(labels: Label[])
    {
      this.updateFormControlLabel(labels);
      this.form.markAsDirty();
    }

    protected resetFormControl(formControl: string): void
    {
        this.form.get(formControl).reset();
        this.form.markAsDirty();
    }

    protected keys(array: any): Array<string>
    {
        var keys = Object.keys(array);
        return keys.slice(keys.length / 2);
    }
}