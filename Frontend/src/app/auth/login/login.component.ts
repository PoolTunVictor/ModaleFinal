import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';  // <-- Importa ReactiveFormsModule aquí
import { CommonModule } from '@angular/common';  // <-- Necesario para *ngIf, etc.
import { AuthService } from '../../core/service/auth.service';// Asegúrate de que AuthService esté disponible

@Component({
  selector: 'app-login',
  standalone: true,  // <-- Marca como standalone
  imports: [ReactiveFormsModule, CommonModule],  // <-- Importa los módulos necesarios aquí
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
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      remember: [false]
    });
  }

  onLogin() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

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
          this.router.navigate(['/admin-dashboard']);
        } else {
          this.router.navigate(['/user-dashboard']);
        }
      },
      error: (error) => {
        this.errorMessage = 'Credenciales incorrectas o error en el servidor.';
        console.error('Error en login:', error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}