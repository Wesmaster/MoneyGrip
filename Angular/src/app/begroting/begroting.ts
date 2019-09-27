import { CurrencyPipe } from '../currency.pipe';

export class BedragPerMaand
{
    januari: number;
    februari: number;
    maart: number;
    april: number;
    mei: number;
    juni: number;
    juli: number;
    augustus: number;
    september: number;
    oktober: number;
    november: number;
    december: number;

    constructor(private customCurrency: CurrencyPipe, public type: string)
    {

    }

    getValue(value: string): string
    {
        switch(value)
        {
            case "Januari": return this.transformeerNaarBedrag(this.januari);
            case "Februari": return this.transformeerNaarBedrag(this.februari);
            case "Maart": return this.transformeerNaarBedrag(this.maart);
            case "April": return this.transformeerNaarBedrag(this.april);
            case "Mei": return this.transformeerNaarBedrag(this.mei);
            case "Juni": return this.transformeerNaarBedrag(this.juni);
            case "Juli": return this.transformeerNaarBedrag(this.juli);
            case "Augustus": return this.transformeerNaarBedrag(this.augustus);
            case "September": return this.transformeerNaarBedrag(this.september);
            case "Oktober": return this.transformeerNaarBedrag(this.oktober);
            case "November": return this.transformeerNaarBedrag(this.november);
            case "December": return this.transformeerNaarBedrag(this.december);
            case " ": return this.type;
            default: return "";
        }
    }

    transformeerNaarBedrag(waarde: number): string
    {
        return "€ " + this.customCurrency.transform(waarde);
    }
}

export class Begroting
{
    inkomst: BedragPerMaand;
    afschrijving: BedragPerMaand;
    budget: BedragPerMaand;
    contract: BedragPerMaand;
    reservering: BedragPerMaand;
    resultaat: BedragPerMaand;
    spaardoel: {[key: string]: BedragPerMaand};
    uitgaven: BedragPerMaand;
}