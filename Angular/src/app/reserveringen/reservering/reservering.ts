import { Label } from "../../labels/label/label";
import { Maanden } from "../../maanden.enum";

export class Reservering
{
    id: number;
    laatstGewijzidgd: Date;
    label: number;
    bedrag: number;
    maanden: Maanden;
    omschrijving: string;
    labelNavigation: Label;
}