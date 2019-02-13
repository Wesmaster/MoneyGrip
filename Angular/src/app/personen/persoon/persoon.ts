import BasisBeheerOverzicht from '../../basisBeheerOverzicht'

export class Persoon extends BasisBeheerOverzicht {
  id: number;
  laatstGewijzigd: Date;
  voornaam: string;
  achternaam?: string;

  getValue(value: string) : any
  {
    switch(value)
    {
      case "Voornaam": return this.voornaam;
        break;
      case "Achternaam" : return this.achternaam;
        break;
      case "Id": return this.id;
        break;
      default: return "";
    }
  }
}
