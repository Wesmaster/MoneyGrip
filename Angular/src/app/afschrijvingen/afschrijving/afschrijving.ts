import { Label } from "../../labels/label/label";
import { formatDate } from '@angular/common';
import { CurrencyPipe } from '../../currency.pipe';

export class Afschrijving
{
    id: number;
    laatstGewijzidgd: Date;
    label: Label[];
    aankoopdatum: Date;
    aankoopbedrag: number;
    verwachteLevensduur: number;
    garantie: number;
    factuur: string;
    factuurNaam: string;

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
        case "Startdatum": return formatDate(this.aankoopdatum, 'dd-MM-yyyy', "nl");
          break;
        case "Waarde": return "€ " + this.customCurrency.transform(this.aankoopbedrag);
          break;
        case "Verwachte levensduur": return this.verwachteLevensduur + " maanden";
          break;
        case "Garantie": return this.garantie ? this.garantie + " maanden" : "";
          break;
        case "Factuur": return this.factuur;
          break;
        case "FactuurNaam": return this.factuurNaam;
          break;
        case "Id": return this.id;
          break;
        case "Per maand": return "€ " + this.customCurrency.transform(Math.round(this.aankoopbedrag / this.verwachteLevensduur));
        default: return "";
      }
    }
}