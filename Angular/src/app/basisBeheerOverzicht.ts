import { Label } from './labels/label/label';

export default abstract class BasisBeheerOverzicht
{   
    label: Label[];
    abstract getValue(value: string): any;
    //abstract getLabels(): Label[];
}