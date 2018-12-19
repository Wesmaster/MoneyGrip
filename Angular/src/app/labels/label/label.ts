import { Categorie } from "../../categorieen/categorie/categorie";

export class Label {
    id: number;
    laatstGewijzigd: Date;
    naam: string;
    categorie: number;
    categorieNavigation: Categorie;
  }