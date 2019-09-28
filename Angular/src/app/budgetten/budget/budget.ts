import { Label } from "../../labels/label/label";
import { Interval } from "../../interval.enum";
import { formatDate } from '@angular/common';
import { CurrencyPipe } from '../../currency.pipe';

export class Budget
{
    id: number;
    label: Label[];
    bedrag: number;
    begindatum: Date;
    einddatum: Date;
    interval: Interval;

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
        case "Begindatum": return formatDate(this.begindatum, 'dd-MM-yyyy', "nl");
          break;
        case "Einddatum": return this.einddatum ? formatDate(this.einddatum, 'dd-MM-yyyy', "nl") : "";
          break;
        case "Interval": return Interval[this.interval];
          break;
        case "Id": return this.id;
          break;
        default: return "";
      }
    }
  }