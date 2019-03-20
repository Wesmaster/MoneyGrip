import { CategorieType } from "../type.enum";
import BasisBeheerOverzicht from "../../basisBeheerOverzicht";

export class Categorie extends BasisBeheerOverzicht
{
  id: number;
  laatstGewijzigd: Date;
  naam: string;
  type: CategorieType;

  getValue(value: string) : any
  {
    switch(value)
    {
      case "Naam": return this.naam;
        break;
      case "Type" : return CategorieType[this.type];
        break;
      case "Id": return this.id;
        break;
      default: return "";
    }
  }
}