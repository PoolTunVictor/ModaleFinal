import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormGroup
} from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/service/auth.service';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.css']
})
export class MiPerfilComponent implements OnInit {

  perfilForm!: FormGroup;
  user: any = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();

    if (!this.user) {
      // 🔒 Si no hay sesión, manda a login
      this.router.navigate(['/login']);
      return;
    }

    this.perfilForm = this.fb.group({
      nombre: [''], // luego lo podrás conectar al backend
      email: [{ value: this.user.email, disabled: true }, [Validators.required]],
      passwordActual: [''],
      nuevaPassword: ['']
    });
  }

  guardarCambios() {
    if (this.perfilForm.valid) {
      console.log('Cambios del perfil:', this.perfilForm.value);
      // 🔜 Aquí luego conectas update profile
    }
  }

  cancelar() {
    this.perfilForm.reset({
      email: this.user.email
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}