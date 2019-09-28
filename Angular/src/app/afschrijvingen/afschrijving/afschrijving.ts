import { Label } from "../../labels/label/label";
import { formatDate } from '@angular/common';
import { CurrencyPipe } from '../../currency.pipe';
import BasisBeheerOverzicht from "../../basisBeheerOverzicht";

export class Afschrijving extends BasisBeheerOverzicht
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
    bedragPerMaand: number;

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
        case "Factuurnaam": return this.factuurNaam;
          break;
        case "Id": return this.id;
          break;
        case "Per maand": return "€ " + this.customCurrency.transform(this.bedragPerMaand);
        default: return "";
      }
    }
}

export class AfschrijvingAlgemeen
{
    totaalPerMaand: number;
    gewensteStand: number;
}