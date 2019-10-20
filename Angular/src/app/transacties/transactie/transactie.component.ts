import { Component, OnInit, Input, Output, Inject, ChangeDetectorRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TransactieType } from '../../transactieType.enum';
import { CurrencyPipe } from '../../currency.pipe';
import { faFileUpload, faTimesCircle, faDownload } from '@fortawesome/free-solid-svg-icons';
import { BaseEditComponent } from '../../base/base-edit.component';
import { BasisService } from '../../base/basis.service';
import { RekeningService } from '../../rekeningen/rekening.service';
import { Rekening } from '../../rekeningen/rekening/rekening';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-transactie',
  templateUrl: './transactie.component.html',
  styleUrls: ['./transactie.component.scss']
})

export class TransactieComponent extends BaseEditComponent implements OnInit
{
    @Input() id: number;
    @Output() getChange = new EventEmitter<number>();

    transactieTypeEnum = TransactieType;
    titelText: string = "Transactie";
    faFileUpload = faFileUpload;
    faTimesCircle = faTimesCircle;
    faDownload = faDownload;
    rekeningen: Rekening[] = [];

    constructor(public service: BasisService, private rekeningService: RekeningService, public dialogRef: MatDialogRef<TransactieComponent>,
        @Inject(MAT_DIALOG_DATA) public data: number, public customCurrency: CurrencyPipe, private ref: ChangeDetectorRef)
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
            var hoofdrekening = this.rekeningService.getHoofdrekening();
            this.form.reset({id: 0, label: "", bedrag: "", datum: formatDate(Date.now(), 'yyyy-MM-dd', "en"), omschrijving: "", vanRekening: hoofdrekening.id, naarRekening: "", type: this.transactieTypeEnum.Uitgave, document: "", documentNaam: ""});
        }
        else
        {
            this.get();
        }

        this.rekeningen = this.rekeningService.getData();
    }

    ngOnInit()
    {
        this.changeDialogPosition();
    }

    onTypeChanged(event: any)
    {
        this.form.controls['vanRekening'].setValidators([Validators.required]);
        this.form.controls['naarRekening'].setValidators([Validators.required]);

        this.form.patchValue({vanRekening: null, naarRekening: null});

        if(event.target.value == TransactieType.Inkomst)
        {
            this.form.patchValue({naarRekening: this.rekeningService.getHoofdrekening().id});
            this.form.controls['vanRekening'].clearValidators();
        }
        else if(event.target.value == TransactieType.Uitgave)
        {
            this.form.patchValue({vanRekening: this.rekeningService.getHoofdrekening().id});
            this.form.controls['naarRekening'].clearValidators();
        }

        this.form.controls['vanRekening'].updateValueAndValidity();
        this.form.controls['naarRekening'].updateValueAndValidity();
    }

    createForm()
    {
        this.form.addControl("label", new FormControl('', [Validators.required]));
        this.form.addControl("bedrag", new FormControl('', [Validators.required, Validators.pattern('[0-9,\.]*')]));
        this.form.addControl("datum", new FormControl('', [Validators.required]));
        this.form.addControl("omschrijving", new FormControl(''));
        this.form.addControl("vanRekening", new FormControl(''));
        this.form.addControl("naarRekening", new FormControl(''));
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
