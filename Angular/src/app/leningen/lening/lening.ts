import { Label } from "../../labels/label/label";
import { LeningType } from "../../leningType.enum";
import { formatDate } from '@angular/common';
import { CurrencyPipe } from '../../currency.pipe';

export class Lening
{
    id: number;
    label: Label[];
    bedrag: number;
    bedragPerMaand: number;
    begindatum: Date;
    looptijd: number;
    rente: number;
    type: LeningType
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
        case "Per maand": return "€ " + this.customCurrency.transform(this.bedragPerMaand);
        case "Begindatum": return formatDate(this.begindatum, 'dd-MM-yyyy', "nl");
        case "Looptijd": return this.looptijd + " maanden";
        case "Rente": return this.rente + "%";
        case "Type": return LeningType[this.type];
        case "Document": return this.document;
        case "Documentnaam": return this.documentNaam;
        case "Id": return this.id;
        default: return "";
      }
    }
}