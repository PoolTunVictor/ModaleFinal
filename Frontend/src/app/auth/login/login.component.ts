import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/service/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],  // Si quieres permitir "usuario", cambia a Validators.required sin email
      password: ['', Validators.required],
      remember: [false]
    });
  }

  onLogin() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';  // Limpia cualquier error previo al intentar de nuevo

    const loginData = this.loginForm.value;

    this.authService.login(loginData).subscribe({
      next: (response) => {
        const token = response.access_token;
        if (loginData.remember) {
          localStorage.setItem('access_token', token);
        } else {
          sessionStorage.setItem('access_token', token);
        }
        localStorage.setItem('user', JSON.stringify(response.user));

        if (response.user.role === 'admin') {
          this.router.navigate(['/admin/users']);
        } else {
          this.router.navigate(['/user/resume']);
        }
      },
      error: (error) => {
        this.errorMessage = 'Credenciales incorrectas o error en el servidor.';
        console.error('Error en login:', error);
        this.isLoading = false;  // <-- CORRECCIÓN: Resetea isLoading aquí para permitir reintentos
      },
      complete: () => {
        this.isLoading = false;  // Redundante, pero asegura que se resetee
      }
    });
  }
}