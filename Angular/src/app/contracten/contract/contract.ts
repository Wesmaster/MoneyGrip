import { Label } from "../../labels/label/label";
import { Interval } from "../../interval.enum";
import { formatDate } from '@angular/common';
import { CurrencyPipe } from '../../currency.pipe';

export class Contract
{
    id: number;
    laatstGewijzidgd: Date;
    label: number;
    bedrag: number;
    begindatum: Date;
    einddatum: Date;
    interval: Interval;
    document: string;
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
        case "Begindatum": return formatDate(this.begindatum, 'dd-MM-yyyy', "nl");
          break;
        case "Einddatum": return this.einddatum ? formatDate(this.einddatum, 'dd-MM-yyyy', "nl") : "";
          break;
        case "Interval": return Interval[this.interval];
          break;
        case "Document": return this.document;
          break;
        case "Id": return this.id;
          break;
        default: return "";
      }
    }
}