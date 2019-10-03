import { Component, OnInit, Input, Output, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Label } from '../../labels/label/label';
import { LeningType } from '../../leningType.enum';
import { CurrencyPipe } from '../../currency.pipe';
import { faFileUpload, faTimesCircle, faDownload } from '@fortawesome/free-solid-svg-icons';
import { BaseEditComponent } from '../../base/base-edit.component';
import { BasisService } from '../../base/basis.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-lening',
  templateUrl: './lening.component.html',
  styleUrls: ['./lening.component.scss']
})

export class LeningComponent extends BaseEditComponent implements OnInit
{
    @Input() id: number;
    @Output() getChange = new EventEmitter<number>();

    LeningTypeEnum = LeningType;
    selectedCategorie: number;
    titelText: string = "Lening";
    faFileUpload = faFileUpload;
    faTimesCircle = faTimesCircle;
    faDownload = faDownload;

    labelInputCtrl = new FormControl();
    gefilterdeLabels: Observable<Label[]>;

    constructor(public service: BasisService, public dialogRef: MatDialogRef<LeningComponent>,
        @Inject(MAT_DIALOG_DATA) public data: number, public customCurrency: CurrencyPipe)
    {
        super(service, dialogRef, customCurrency);
        this.id = data;

        if(typeof(this.id) == null)
        {
            return;
        }

        this.createForm();

        if(this.id == 0)
        {
            this.labelsLoaded = Promise.resolve(true);
            this.form.reset({id: 0, label: "", bedrag: "", begindatum: "", looptijd: "", rente: "", type: "", document: "", documentNaam: ""});
        }
        else
        {
            this.get(this.id);
        }
    }

    ngOnInit()
    {
        this.changeDialogPosition();
    }

    createForm()
    {
        this.form.addControl("label", new FormControl('', [Validators.required]));
        this.form.addControl("bedrag", new FormControl('', [Validators.required, Validators.pattern('[0-9,\.]*')]));
        this.form.addControl("begindatum", new FormControl('', [Validators.required]));
        this.form.addControl("looptijd", new FormControl('', [Validators.required]));
        this.form.addControl("rente", new FormControl('', [Validators.required, Validators.pattern('[0-9\.]*'), Validators.max(100)]));
        this.form.addControl("type", new FormControl('', [Validators.required]));
        this.form.addControl("document", new FormControl(''));
        this.form.addControl("documentNaam", new FormControl(''));
    }

    verwijderDocument()
    {
        this.resetFormControl("document");
        this.resetFormControl("documentNaam");
    }
}
