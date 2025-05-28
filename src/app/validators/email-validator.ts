import { AbstractControl, AsyncValidatorFn, ValidationErrors } from "@angular/forms";
import { MembersService } from "../services/members.service";
import { catchError, map, Observable, of, switchMap, timer } from "rxjs";


export const emailValidator = (memberService: MembersService): AsyncValidatorFn => {

    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        if(!control.value) {
            return of(null);
        }

        return timer(1000).pipe(
            switchMap(() => 
                memberService.validateEmail(control.value).pipe(
                    map((isAvailable: boolean) => {
                        console.log(isAvailable);
                        
                        return isAvailable ? { emailExists: true } : null
                    }),
                    catchError((error) => {
                        console.error('Error en la validación del email', error);
                        return of({ serverError: true })
                    })
                )
            )
        )
    }
}