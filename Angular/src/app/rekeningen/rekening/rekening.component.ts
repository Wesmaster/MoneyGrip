import { Component, OnInit, Input, Output, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CurrencyPipe } from '../../currency.pipe';
import { faFileUpload, faTimesCircle, faDownload } from '@fortawesome/free-solid-svg-icons';
import { BaseEditComponent } from '../../base/base-edit.component';
import { BasisService } from '../../base/basis.service';
import { Spaardoel } from '../../spaardoelen/spaardoel/spaardoel';

@Component({
  selector: 'app-rekening',
  templateUrl: './rekening.component.html',
  styleUrls: ['./rekening.component.scss']
})

export class RekeningComponent extends BaseEditComponent implements OnInit
{
    @Input() id: number;
    @Output() getChange = new EventEmitter<number>();

    selectedCategorie: number;
    titelText: string = "Rekening";
    faFileUpload = faFileUpload;
    faTimesCircle = faTimesCircle;
    faDownload = faDownload;
    spaardoelen: Spaardoel[];

    constructor(public service: BasisService, public dialogRef: MatDialogRef<RekeningComponent>,
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
            this.form.reset({id: 0, startbedrag: "", naam: "", iban: "", hoofdrekening: "", spaardoel: ""});
        }
        else
        {
            this.get();
        }
    }

    get(): void
    {
        this.service.get(this.id).subscribe(item => {
            this.form.patchValue(item)
        });
    }

    ngOnInit()
    {
        this.changeDialogPosition();
    }

    createForm()
    {
        this.form.addControl("naam", new FormControl('', [Validators.required]));
        this.form.addControl("startbedrag", new FormControl('', [Validators.required, Validators.pattern('[0-9,\.]*')]));
        this.form.addControl("iban", new FormControl('', [Validators.required, Validators.maxLength(18)]));
        this.form.addControl("hoofdrekening", new FormControl('', []));
    }

    async onSubmit()
    {
        this.form.patchValue({startbedrag: this.customCurrency.transformToNumber(this.form.get("startbedrag").value)});
    
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
}
