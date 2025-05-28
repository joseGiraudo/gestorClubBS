import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MembersService } from '../../../services/members.service';
import { birthdateValidation } from '../../../validators/birthdate-validator';
import { emailValidator } from '../../../validators/email-validator';
import { dniValidator } from '../../../validators/dni-validator';

declare var bootstrap: any; // Para usar Bootstrap modal

@Component({
  selector: 'app-member-form',
  imports: [ReactiveFormsModule],
  templateUrl: './member-form.component.html',
  styleUrl: './member-form.component.css'
})

export class MemberFormComponent implements OnInit {

  memberForm: FormGroup
  private modal: any;

  private memberService = inject(MembersService);

  constructor(private fb: FormBuilder) {
    this.memberForm = this.fb.group({
      name: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      dni: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      address: ['',[ Validators.required]],
      birthdate: [null, [Validators.required, birthdateValidation]],
      type: ['', Validators.required],
    })
  }

  ngOnInit(): void {
    this.modal = new bootstrap.Modal(document.getElementById('confirmModal'));
    this.memberForm.controls['email'].setAsyncValidators(emailValidator(this.memberService));
    this.memberForm.controls['dni'].setAsyncValidators(dniValidator(this.memberService));
  }

  onSubmit(): void {
    if (this.memberForm.valid) {
      // Mostrar el modal de confirmación
      this.modal.show();
    } else {
      // Marcar todos los campos como touched para mostrar errores
      this.memberForm.markAllAsTouched();
      console.log('Formulario inválido', this.memberForm.errors);
    }
  }

  confirmSend(): void {
    if (this.memberForm.valid) {
      // Aquí procesas el envío del formulario
      const formData = this.memberForm.value;
      
      console.log('Datos del formulario:', formData);
      
      // Aquí puedes hacer la llamada al servicio para enviar los datos
      this.sendForm(formData);
      
      // Cerrar el modal
      this.modal.hide();
      
      // Opcional: resetear el formulario
      // this.memberForm.reset();
    }
  }

  // Método para enviar los datos al backend
  private sendForm(data: any): void {

    const newMember = {
        ...this.memberForm.value,
      }
      console.log('Nuevo socio:', newMember)
      
      this.memberService.createMember(newMember).subscribe({
        next: (response) => {
          alert('Socio creado correctamente')
          console.log("Socio creado correctamente: ", response)
        },
        error: (error) => {
          console.error("Error al cargar el socio: ", error)
        }
      })
  }


  // Método para cerrar el modal sin enviar
  cancelSend(): void {
    this.modal.hide();
  }


  /* 
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
  } */
}
