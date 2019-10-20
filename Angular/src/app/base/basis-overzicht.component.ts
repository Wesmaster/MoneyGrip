import { BasisService } from './basis.service';
import { Globals } from '../globals';
import { MatDialog } from '@angular/material';
import { DialogBevestigenComponent } from '../dialog-bevestigen/dialog-bevestigen.component';
import BasisBeheerOverzicht from '../basisBeheerOverzicht';

export default abstract class BasisOverzichtComponent
{
    protected pagina: string;
    protected geselecteerd: BasisBeheerOverzicht[] = [];
    protected deleteAvailable: boolean = false;
    protected openDocumentAvailable: boolean = false;
    protected duplicerenMogelijk: boolean = false;

    abstract get() : void;
    abstract openAddDialog(id: number, refresh: boolean) : void;

    constructor(protected service: BasisService, protected dialog: MatDialog, protected globals: Globals)
    {
        this.pagina = globals.pagina;
    }

    ngOnInit()
    {
        this.get();
    }

    add(): void
    {
        this.openAddDialog(0, false);
    }

    afterEdit(id: number): void
    {
        if(id !== null)
        {
            this.get();
        }
    }

    openDocument(item: BasisBeheerOverzicht): void
    {
        const linkSource = 'data:application/pdf;base64,' + item.getValue("Document");
        const downloadLink = document.createElement("a");
    
        downloadLink.href = linkSource;
        downloadLink.download = item.getValue("Documentnaam");
        downloadLink.click()
    }

    parseDatum(value: any): Date | null 
    {
        if ((typeof value === 'string') && (value.indexOf('-') > -1))
        {
            const str = value.split('-');
    
            const year = Number(str[2]);
            const month = Number(str[1]) - 1;
            const date = Number(str[0]);
  
            return new Date(year, month, date);
        }
        return new Date(9999, 12, 31);
    }

    verwijderen(id: number): void
    {
        this.service.delete(id).subscribe(item => 
        {
            this.get();
        });
    }

    setPagina(pagina: string): void
    {
        this.globals.pagina = pagina;
    }

    openDeleteDialog(titel: string, vraag: string): void
    {
        const dialogRef = this.dialog.open(DialogBevestigenComponent, 
        {
            data: {vraag: vraag, titel: titel},
            panelClass: 'dialog-delete',
            disableClose: true
        });
  
        dialogRef.afterClosed().subscribe(result => 
        {
            if(result)
            {
                this.geselecteerd.forEach(item => {
                    this.verwijderen(item.getValue("Id"));
                });
  
                this.updateSelected([]);
            }
        });
    }

    updateSelected(geselecteerd: BasisBeheerOverzicht[]): void
    {
        this.geselecteerd = [];
        this.deleteAvailable = false;
        this.openDocumentAvailable = false;
        this.duplicerenMogelijk = false;
        geselecteerd.forEach(item => {
            this.geselecteerd.push(item);
        });

        if(this.geselecteerd.length == 1)
        {
            this.deleteAvailable = true;
            this.openDocumentAvailable = true;
            this.duplicerenMogelijk = true;
        }
        /*else if(this.geselecteerd.length > 1)
        {
            this.deleteAvailable = true;
        }*/
    }
}