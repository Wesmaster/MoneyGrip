import { Label } from "../../labels/label/label";
import { Persoon } from "../../personen/persoon/persoon";
import { Interval } from "../../interval.enum";

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
  }