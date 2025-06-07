import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { LoginService } from '../../../services/login.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  imports: [ ReactiveFormsModule, FormsModule ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup
  loading = false
  error = ""

  private loginService = inject(LoginService)

  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    
  }

 onSubmit() {
    if (this.loginForm.invalid) {
      return
    }

    this.loading = true
    this.error = ""

    const credentials = this.loginForm.value;

    this.loginService.login(credentials).subscribe({
      next: (response) => {
        this.router.navigate(["/"])
      },
      error: (error) => {
        this.error = error.error?.message || "Error al iniciar sesión"
        this.loading = false
      },
    })
  }

}
