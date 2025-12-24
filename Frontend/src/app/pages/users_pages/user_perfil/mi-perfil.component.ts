import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.css']
})
export class MiPerfilComponent {

  perfilForm!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.perfilForm = this.fb.group({
      nombre: ['Jaqueline Uc', Validators.required],
      email: ['jaqueline@gmail.com', [Validators.required, Validators.email]],
      passwordActual: ['', Validators.required],
      nuevaPassword: ['']
    });
  }

  guardarCambios() {
    if (this.perfilForm.valid) {
      console.log(this.perfilForm.value);
    }
  }

  cancelar() {
    this.perfilForm.reset();
  }
}


