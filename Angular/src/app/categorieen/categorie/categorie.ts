import { CategorieType } from "../type.enum";

export class Categorie
{
  id: number;
  laatstGewijzigd: Date;
  naam: string;
  type: CategorieType;
}