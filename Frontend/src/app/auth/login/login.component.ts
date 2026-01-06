import { Component, OnInit } from '@angular/core';
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
export class LoginComponent implements OnInit {

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

  // 🔥 CLAVE: limpia cualquier sesión previa
  ngOnInit(): void {
    this.authService.logout();
  }

  onLogin(): void {
    if (this.loginForm.invalid || this.isLoading) return;

    this.isLoading = true;
    this.errorMessage = '';

    const loginData = this.loginForm.value;

    this.authService.login(loginData).subscribe({
      next: (response) => {
        const token = response.access_token;

        // Guarda token según "remember"
        if (loginData.remember) {
          localStorage.setItem('access_token', token);
        } else {
          sessionStorage.setItem('access_token', token);
        }

        // 🔑 Guarda usuario (fuente de verdad)
        localStorage.setItem('user', JSON.stringify(response.user));

        // 🚀 Redirección por rol
        if (response.user.role === 'admin') {
          this.router.navigate(['/admin/users']);
        } else {
          this.router.navigate(['/user/resume']);
        }
      },
      error: (error) => {
        this.errorMessage = 'Credenciales incorrectas o error en el servidor.';
        console.error('Error en login:', error);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
