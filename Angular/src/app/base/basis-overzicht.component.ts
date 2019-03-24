import { BasisService } from './basis.service';

export default abstract class BasisOverzichtComponent
{
    protected selectedId: number;
    protected rowSelected: boolean;

    abstract get() : void;
    abstract openAddDialog(id: number) : void;

    constructor(protected service: BasisService)
    {

    }

    ngOnInit()
    {
      this.get();
      this.selectedId = null;
      this.rowSelected = false;
    }

    add(): void
    {
      this.selectedId = 0;
      this.rowSelected = true;
  
      this.openAddDialog(this.selectedId);
    }

    afterEdit(id: number): void
    {
      if(id !== null)
      {
        this.get();
      }
      this.selectedId = null;
      this.rowSelected = false;
    }

    onSelect(id: number): void
    {
      this.selectedId = id;
      this.rowSelected = true;
  
      this.openAddDialog(this.selectedId);
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
      this.service.delete(id).subscribe(item => {
        this.afterEdit(id);
      });
    }
}