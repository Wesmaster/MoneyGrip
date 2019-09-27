import { Label } from "../../labels/label/label";
import { Interval } from "../../interval.enum";
import { formatDate } from '@angular/common';
import { CurrencyPipe } from '../../currency.pipe';

export class Contract
{
    id: number;
    laatstGewijzidgd: Date;
    label: Label[];
    bedrag: number;
    begindatum: Date;
    einddatum: Date;
    interval: Interval;
    document: string;
    documentNaam: string;

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
        case "Bedrag": return "€ " + this.customCurrency.transform(this.bedrag);
        case "Begindatum": return formatDate(this.begindatum, 'dd-MM-yyyy', "nl");
        case "Einddatum": return this.einddatum ? formatDate(this.einddatum, 'dd-MM-yyyy', "nl") : "";
        case "Interval": return Interval[this.interval];
        case "Document": return this.document;
        case "Documentnaam": return this.documentNaam;
        case "Id": return this.id;
        default: return "";
      }
    }
}