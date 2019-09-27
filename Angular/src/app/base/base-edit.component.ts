import { MatDialogRef, } from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms';
import { Label } from '../labels/label/label';

export class BaseEditComponent
{
    form: FormGroup;

    constructor(public dialogRef: MatDialogRef<any>)
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

    protected setDialogSize()
    {
      //  this.dialogRef.updateSize('22%');
    }

    protected getForm(): FormGroup
    {
        return this.form;
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
}