import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';  // Agrega Router para navegación
import { AuthService } from '../../core/service/auth.service'; // Asegúrate de que la ruta sea correcta (ajusta si es diferente)

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,  // Inyecta AuthService
    private router: Router  // Inyecta Router para redirigir
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9\s\-\$\$]{10,15}$/)]],  // Ajusté el patrón para permitir más caracteres comunes en teléfonos
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
      terms: [false, [Validators.requiredTrue]]
    }, { validators: this.passwordMatchValidator });
  }

  // Validador personalizado (sin cambios)
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      // Extrae solo los campos necesarios para el backend
      const { email, password, phone } = this.registerForm.value;
      
      // Llama al AuthService
      this.authService.register({ email, password, phone }).subscribe({
        next: (response) => {
          // Éxito: muestra mensaje y redirige al login
          alert(response.message || 'Cuenta creada exitosamente!');
          this.router.navigate(['/']);  // Redirige a la página de login (ajusta la ruta si es diferente)
        },
        error: (error) => {
          // Error: muestra el mensaje del backend
          const errorMessage = error.error?.message || 'Error al crear la cuenta. Inténtalo de nuevo.';
          alert(errorMessage);
          console.error('Error en registro:', error);
        }
      });
    } else {
      // Marca campos como tocados (sin cambios)
      this.registerForm.markAllAsTouched();
    }
  }
}