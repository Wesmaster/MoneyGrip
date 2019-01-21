import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface DialogData {
  vraag: string;
  titel: string;
  opmerking: string;
}

@Component({
  selector: 'app-dialog-bevestigen',
  templateUrl: './dialog-bevestigen.component.html',
  styleUrls: ['./dialog-bevestigen.component.css']
})
export class DialogBevestigenComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogBevestigenComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {

    }

  ngOnInit() {
    this.changePosition();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  changePosition()
  {
    this.dialogRef.updatePosition({top: '5%', left: '37%'});
  }

}