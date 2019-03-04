import { Categorie } from "../../categorieen/categorie/categorie";
import BasisBeheerOverzicht from "../../basisBeheerOverzicht";

export class Label extends BasisBeheerOverzicht {
    id: number;
    laatstGewijzigd: Date;
    naam: string;
    categorie: number;
    categorieNavigation: Categorie;

    getValue(value: string) : any
    {
      switch(value)
      {
        case "Naam": return this.naam;
          break;
        case "Categorie" : return this.categorieNavigation.naam;
          break;
        case "Id": return this.id;
          break;
        default: return "";
      }
    }
  }