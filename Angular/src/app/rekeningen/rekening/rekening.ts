import { formatDate } from '@angular/common';
import { CurrencyPipe } from '../../currency.pipe';

export class Rekening {
    id: number;
    naam: string;
    iban: string;
    saldo: number;
    hoofdrekening: boolean;

    constructor(private customCurrency: CurrencyPipe) {}

    getValue(value: string) : any
    {
      switch(value)
      {
        case "Naam": return this.naam;
        case "Iban": return this.iban;
        case "Saldo": return "€ " + this.customCurrency.transform(this.saldo);
        case "Hoofdrekening": return this.hoofdrekening ? "X" : "";
        case "Id": return this.id;
        default: return "";
      }
    }
  }