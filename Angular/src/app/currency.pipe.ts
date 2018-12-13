import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customCurrency'
})
export class CurrencyPipe implements PipeTransform
{
    transform(value: number): string 
    {
        var valueString = value.toString();

        var rmLeadingZeros = /^0+/;
        valueString = valueString.replace(/,/g, "").replace(/\./g, "").replace(rmLeadingZeros, "");

        for(var i = valueString.length; i < 3; i++)
        {
            valueString = "0" + valueString;
        }

        var i = valueString.length - 2;
        while(i > 3)
        {
            i = i - 3;
            valueString = valueString.slice(0, i) + "." + valueString.slice(i);
        }

        return valueString.slice(0, valueString.length - 2) + "," + valueString.slice(valueString.length - 2);
    }

    transformToNumber(value: string): number
    {
        var cleanString = value.toString();
        cleanString = cleanString.replace(/,/g, "").replace(/\./g, "");
        return Number(cleanString);
    }
}