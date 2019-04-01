import { Label } from "../../labels/label/label";
import { Maanden } from "../../maanden.enum";
import { CurrencyPipe } from '../../currency.pipe';

export class Reservering
{
    id: number;
    laatstGewijzidgd: Date;
    label: number;
    bedrag: number;
    maand: Maanden;
    omschrijving: string;
    labelNavigation: Label;

    constructor(private customCurrency: CurrencyPipe) {}

    getValue(value: string) : any
    {
      switch(value)
      {
        case "Label": return this.labelNavigation.naam;
          break;
        case "Categorie": return this.labelNavigation.categorieNavigation.naam;
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