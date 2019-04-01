import { Label } from "../../labels/label/label";
import { formatDate } from '@angular/common';
import { CurrencyPipe } from '../../currency.pipe';

export class Afschrijving
{
    id: number;
    laatstGewijzidgd: Date;
    label: number;
    aankoopdatum: Date;
    aankoopbedrag: number;
    verwachteLevensduur: number;
    garantie: number;
    factuur: string;
    labelNavigation: Label;

    constructor(private customCurrency: CurrencyPipe) {}

    getValue(value: string) : any
    {
      switch(value)
      {
        case "Label": return this.labelNavigation.naam;
          break;
        case "Aankoopdatum": return formatDate(this.aankoopdatum, 'dd-MM-yyyy', "nl");
          break;
        case "Aankoopbedrag": return "€ " + this.customCurrency.transform(this.aankoopbedrag);
          break;
        case "Verwachte levensduur": return this.verwachteLevensduur + " maanden";
          break;
        case "Garantie": return this.garantie ? this.garantie + " maanden" : "";
          break;
        case "Factuur": return this.factuur;
          break;
        case "Id": return this.id;
          break;
        default: return "";
      }
    }
}