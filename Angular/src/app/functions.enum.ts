//import { CategorieType } from './categorieen/type.enum';

export class Enum
{
    constructor()
    {

    }


    keys(any): Array<string>
    {
        var keys = Object.keys(any);
        return keys.slice(keys.length / 2);
    }
}