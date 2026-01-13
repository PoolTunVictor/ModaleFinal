import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../core/service/user.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.html',
  styleUrl: './users.css'
})
export class Users implements OnInit {

  users: any[] = [];
  filteredUsers: any[] = [];

  isLoading = true;

  // filtros
  searchEmail = '';
  roleFilter: 'all' | 'admin' | 'cliente' = 'all';

  // Modal
  showConfirmModal = false;
  confirmTitle = '';
  confirmMessage = '';
  confirmAction: (() => void) | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;

    this.userService.getAllUsers().subscribe({
      next: (res) => {
        this.users = res;
        this.applyFilters();
        this.isLoading = false;
      },
      error: () => {
        alert('No se pudieron cargar los usuarios');
        this.isLoading = false;
      }
    });
  }

  // =========================
  // FILTROS
  // =========================
  applyFilters() {
    let result = [...this.users];

    // filtro por correo
    if (this.searchEmail.trim() !== '') {
      result = result.filter(user =>
        user.email.toLowerCase().includes(this.searchEmail.toLowerCase())
      );
    }

    // filtro por rol
    if (this.roleFilter !== 'all') {
      result = result.filter(user => user.role === this.roleFilter);
    }

    this.filteredUsers = result;
  }

  // =========================
  // CAMBIAR ROL
  // =========================
  changeRole(user: any, event: Event) {
    const select = event.target as HTMLSelectElement;
    const newRole = select.value;

    if (newRole === user.role) return;

    // revertimos visualmente hasta confirmar
    select.value = user.role;

    this.openConfirmModal(
      'Confirmar cambio de rol',
      `¿Estás seguro de cambiar el rol de "${user.email}" a "${newRole === 'admin' ? 'Administrador' : 'Cliente'}"?`,
      () => {
        this.userService.updateUserRole(user.id, newRole).subscribe({
          next: () => {
            user.role = newRole;
            this.applyFilters();
          },
          error: () => alert('Error al cambiar rol')
        });
      }
    );
  }

  // =========================
  // ELIMINAR USUARIO
  // =========================
  deleteUser(user: any) {
    this.openConfirmModal(
      'Eliminar usuario',
      `¿Estás seguro de eliminar al usuario "${user.email}"? Esta acción no se puede deshacer.`,
      () => {
        this.userService.deleteUser(user.id).subscribe({
          next: () => {
            this.users = this.users.filter(u => u.id !== user.id);
            this.applyFilters();
          },
          error: () => alert('Error al eliminar usuario')
        });
      }
    );
  }

  // =========================
  // MODAL
  // =========================
  openConfirmModal(title: string, message: string, action: () => void) {
    this.confirmTitle = title;
    this.confirmMessage = message;
    this.confirmAction = action;
    this.showConfirmModal = true;
  }

  closeConfirmModal() {
    this.showConfirmModal = false;
    this.confirmAction = null;
  }

  confirm() {
    if (this.confirmAction) {
      this.confirmAction();
    }
    this.closeConfirmModal();
  }
}
