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

    verwijderen(id: number): void
    {
      this.service.delete(id).subscribe(item => {
        this.afterEdit(id);
      });
    }
}