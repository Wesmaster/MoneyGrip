import { Label } from "../../labels/label/label";

export class Afschrijving
{
    id: number;
    laatstGewijzidgd: Date;
    label: number;
    aankoopdatum: Date;
    aankoopbedrag: number;
    verwachteLevensduur: number;
    garantie: number;
    factuur: string;
    labelNavigation: Label;
}