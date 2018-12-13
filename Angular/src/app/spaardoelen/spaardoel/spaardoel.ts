import { Label } from "../../labels/label/label";

export class Spaardoel
{
    id: number;
    laatstGewijzidgd: Date;
    label: number;
    percentage: number;
    eindbedrag: number;
    begindatum: Date;
    einddatum: Date;
    omschrijving: string;
    labelNavigation: Label;
}