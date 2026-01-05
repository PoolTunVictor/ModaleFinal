import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recovery',
  standalone: true,
  imports: [
    ReactiveFormsModule,  // Para formGroup y validaciones
    CommonModule,         // Para *ngIf
  ],
  templateUrl: './recovery.component.html',
  styleUrls: ['./recovery.component.css']
})
export class RecoveryComponent {
  recoveryForm: FormGroup;
  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder) {
    this.recoveryForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.recoveryForm.valid) {
      const email = this.recoveryForm.value.email;
      // Aquí va tu lógica de envío (ej. llamada a API para enviar email de recuperación)
      // Por ahora, simulación:
      console.log('Enviando recuperación a:', email);
      this.successMessage = 'Se ha enviado un enlace de recuperación a tu correo.';
      this.errorMessage = '';  // Limpia errores previos
      // Opcional: resetea el formulario después de éxito
      // this.recoveryForm.reset();
    } else {
      this.errorMessage = 'Por favor, ingresa un correo electrónico válido.';
      this.successMessage = '';
    }
  }
}