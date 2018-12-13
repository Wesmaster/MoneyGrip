import { FormGroup, ValidatorFn, ValidationErrors } from '@angular/forms';

export class CustomValidator
{
    dateLessThanValidator(): ValidatorFn {
        return (control: FormGroup): ValidationErrors | null => {
          if(control.get("einddatum").value < control.get("begindatum").value && control.get("einddatum").value != ""){
            control.get("einddatum").setErrors({dateLess: true});
            return {default: false};
          }
    
          return null;
        };
      }
}