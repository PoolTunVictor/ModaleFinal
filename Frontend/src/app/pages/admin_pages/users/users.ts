import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/service/user.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.html',
  styleUrl: './users.css'
})
export class Users implements OnInit {

  users: any[] = [];
  isLoading = true;
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
        this.isLoading = false;
      },
      error: () => {
        alert('No se pudieron cargar los usuarios');
        this.isLoading = false;
      }
    });
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
          next: () => user.role = newRole,
          error: () => alert('Error al cambiar rol')
        });
      }
    );
  }


  // helpers visuales
  getRoleLabel(role: string): string {
    return role === 'admin' ? 'Administrador' : 'Cliente';
  }

  getRoleClass(role: string): string {
    return role === 'admin' ? 'admin' : 'viewer';
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
          },
          error: () => alert('Error al eliminar usuario')
        });
      }
    );
  }


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
