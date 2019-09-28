import { Label } from "../../labels/label/label";
import { Maanden } from "../../maanden.enum";
import { CurrencyPipe } from '../../currency.pipe';

export class Reservering
{
    id: number;
    label: Label[];
    bedrag: number;
    maand: Maanden;
    omschrijving: string;

    constructor(private customCurrency: CurrencyPipe) {}

    getValue(value: string) : any
    {
      switch(value)
      {
        case "Label": 
            var returnList: string[] = [];
            this.label.forEach(element => {
                returnList.push(element.naam);
            });
            return returnList.join(", ");
          break;
        case "Bedrag": return "€ " + this.customCurrency.transform(this.bedrag);
          break;
        case "Maand": return Maanden[this.maand];
          break;
        case "Omschrijving": return this.omschrijving;
          break;
        case "Id": return this.id;
          break;
        default: return "";
      }
    }
}