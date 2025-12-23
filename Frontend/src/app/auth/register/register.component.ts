import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';  // Necesario para Reactive Forms
import { RouterModule } from '@angular/router';  // Para routerLink

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],  // Importa módulos necesarios
  templateUrl: './register.component.html',  // Tu template actualizado
  styleUrls: ['./register.component.css']    // Tu CSS actualizado
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required]],  // Obligatorio
      phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9\s\-\$\$]{10,15}$/)]],  // Obligatorio + solo números
      password: ['', [Validators.required]],  // Obligatorio
      confirmPassword: ['', [Validators.required]],  // Obligatorio
      terms: [false, [Validators.requiredTrue]]  // Checkbox obligatorio (true)
    }, { validators: this.passwordMatchValidator });  // Validador personalizado para contraseñas
  }

  // Validador personalizado para confirmar que las contraseñas coincidan
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
      // Aquí procesa la creación de cuenta (ej: envía a un servicio)
      console.log('Formulario válido:', this.registerForm.value);
      alert('Cuenta creada exitosamente!');  // Reemplaza con tu lógica (ej: this.authService.register(this.registerForm.value))
      // this.router.navigate(['/login']);  // Redirige si es necesario
    } else {
      // Marca todos los campos como tocados para mostrar errores
      this.registerForm.markAllAsTouched();
    }
  }
}