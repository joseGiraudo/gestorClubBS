import {AbstractControl, ValidationErrors} from '@angular/forms';

export function pastDateValidation(control: AbstractControl): ValidationErrors | null {
  const fecha = new Date(control.value);
  const fechaActual = new Date();
  return fecha >= fechaActual ? { invalidDate: true } : null;
}