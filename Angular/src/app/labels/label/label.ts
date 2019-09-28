import BasisBeheerOverzicht from "../../basisBeheerOverzicht";

export class Label extends BasisBeheerOverzicht {
    id: number;
    laatstGewijzigd: Date;
    naam: string;

    getValue(value: string) : any
    {
      switch(value)
      {
        case "Naam": return this.naam;
        case "Id": return this.id;
        default: return "";
      }
    }
  }