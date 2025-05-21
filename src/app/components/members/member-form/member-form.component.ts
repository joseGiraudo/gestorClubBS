import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MembersService } from '../../../services/members.service';

@Component({
  selector: 'app-member-form',
  imports: [ReactiveFormsModule],
  templateUrl: './member-form.component.html',
  styleUrl: './member-form.component.css'
})

export class MemberFormComponent {

  memberForm: FormGroup

  private memberService = inject(MembersService);

  constructor(private fb: FormBuilder) {
    this.memberForm = this.fb.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      dni: ['', Validators.required],
      email: ['', [Validators.email]],
      phone: [''],
      address: [''],
      birthdate: [null],
      type: ['', Validators.required],
    })
  }

  onSubmit() {

    console.log(this.memberForm.value)

    if (this.memberForm.valid) {
      const newMember = {
        ...this.memberForm.value,
      }
      console.log('Nuevo socio:', newMember)
      
      this.memberService.createMember(newMember).subscribe({
        next: (response) => console.log("Socio creado correctamente: ", response),
        error: (error) => {
          console.log("Error al cargar el socio: ", error)
        }
      })
    }
  }
}
