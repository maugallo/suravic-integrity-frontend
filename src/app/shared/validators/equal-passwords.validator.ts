import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function validateEqualPasswords(password: any): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (control.value !== password) {
            return { equalPasswords: true };
        }
        return null;
    };
}