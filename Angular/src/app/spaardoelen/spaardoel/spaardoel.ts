import { Label } from "../../labels/label/label";
import { Maanden } from "../../maanden.enum";

export class Spaardoel
{
    id: number;
    laatstGewijzidgd: Date;
    label: number;
    percentage: number;
    eindbedrag: number;
    eersteMaand: Maanden;
    laatsteMaand: Maanden;
    omschrijving: string;
    labelNavigation: Label;
}