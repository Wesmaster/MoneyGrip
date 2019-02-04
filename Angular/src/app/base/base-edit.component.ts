import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

export class BaseEditComponent
{
    constructor(public dialogRef: MatDialogRef<any>)
    {

    }

    protected changeDialogPosition()
    {
      this.dialogRef.updatePosition({top: '5%', left: '39%'});
    }

    protected setDialogSize()
    {
        this.dialogRef.updateSize('22%');
    }
}