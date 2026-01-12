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

  // helpers visuales
  getRoleLabel(role: string): string {
    return role === 'admin' ? 'Administrador' : 'Cliente';
  }

  getRoleClass(role: string): string {
    return role === 'admin' ? 'admin' : 'viewer';
  }
}
