import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-user-form',
  imports: [ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent {

  userForm: FormGroup

  private memberService = inject(UserService);

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.email]],
      password: ['', [Validators.required]],
      role: ['', Validators.required],
      isActive: [true],
    })
  }

  onSubmit() {

    console.log(this.userForm.value)

    if (this.userForm.valid) {
      const newUser = {
        ...this.userForm.value,
      }
      console.log('Nuevo usuario:', newUser)
      
      /* 
      this.memberService.createMember(newMember).subscribe({
        next: (response) => console.log("Socio creado correctamente: ", response),
        error: (error) => {
          console.log("Error al cargar el socio: ", error)
        }
      })
      */
    }
  }

}
