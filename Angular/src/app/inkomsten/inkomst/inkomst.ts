import { Label } from "../../labels/label/label";
import { Persoon } from "../../personen/persoon/persoon";
import { Interval } from "../../interval.enum";
import { formatDate } from '@angular/common';
import { CurrencyPipe } from '../../currency.pipe';

export class Inkomst {
    id: number;
    label: number;
    persoon: number;
    bedrag: number;
    begindatum: Date;
    einddatum: Date;
    interval: Interval;
    labelNavigation: Label;
    persoonNavigation: Persoon;

    constructor(private customCurrency: CurrencyPipe) {}

    getValue(value: string) : any
    {
      switch(value)
      {
        case "Label": return this.labelNavigation.naam;
          break;
        case "Persoon": return this.persoonNavigation ? this.persoonNavigation.voornaam + " " + this.persoonNavigation.achternaam : "";
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