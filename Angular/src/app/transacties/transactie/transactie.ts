import { Label } from "../../labels/label/label";
import { TransactieType } from "../../transactieType.enum";
import { CurrencyPipe } from '../../currency.pipe';
import BasisBeheerOverzicht from "../../basisBeheerOverzicht";

export class Transactie extends BasisBeheerOverzicht
{
    id: number;
    label: Label[];
    bedrag: number;
    dag: number;
    type: TransactieType;
    document: string;
    documentNaam: string;
    omschrijving: string;
    vanRekening: number;
    naarRekening: number;

    constructor(private customCurrency: CurrencyPipe)
    {
        super();
    }

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
        case "Dag": return this.dag;
        case "Type": return TransactieType[this.type];
        case "Omschrijving": return this.omschrijving;
        case "Document": return this.document;
        case "Documentnaam": return this.documentNaam;
        case "Van": return this.vanRekening;
        case "Naar": return this.naarRekening;
        case "Id": return this.id;
        default: return "";
      }
    }
}