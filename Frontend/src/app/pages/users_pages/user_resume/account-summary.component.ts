import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddressService } from '../../../core/service/address.service';
import { AuthService } from '../../../core/service/auth.service';
import { OrderService } from '../../../core/service/order.service';

@Component({
  selector: 'app-account-summary',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './account-summary.component.html',
  styleUrls: ['./account-summary.component.css']
})
export class AccountSummaryComponent implements OnInit {

  // =========================
  // USER
  // =========================
  user: any = null;

  // =========================
  // ORDERS
  // =========================
  orders: any[] = [];
  isLoadingOrders = true;

  // =========================
  // ADDRESSES
  // =========================
  addresses: any[] = [];
  isLoadingAddress = true;

  // =========================
  // MODAL
  // =========================
  showAddressModal = false;
  isEditMode = false;
  editingAddressId: number | null = null;

  addressForm: any = {
    receiver_name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postal_code: '',
    references: ''
  };

  constructor(
    private addressService: AddressService,
    private authService: AuthService,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    this.user = this.authService.getUser();
    this.loadOrders();
    this.loadAddresses();
  }

  // =========================
  // LOAD ORDERS
  // =========================
  loadOrders() {
    this.isLoadingOrders = true;
    this.orderService.getMyOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.isLoadingOrders = false;
      },
      error: () => this.isLoadingOrders = false
    });
  }

  // =========================
  // LOAD ADDRESSES
  // =========================
  loadAddresses() {
    this.isLoadingAddress = true;

    this.addressService.getMyAddresses().subscribe({
      next: (addresses) => {
        this.addresses = addresses;
        this.isLoadingAddress = false;
      },
      error: () => this.isLoadingAddress = false
    });
  }

  // =========================
  // MODAL ACTIONS
  // =========================
  openNewAddressModal() {
    this.isEditMode = false;
    this.editingAddressId = null;
    this.resetForm();
    this.showAddressModal = true;
  }

  openEditAddressModal(address: any) {
    this.isEditMode = true;
    this.editingAddressId = address.id;
    this.addressForm = { ...address };
    this.showAddressModal = true;
  }

  closeModal() {
    this.showAddressModal = false;
    this.resetForm();
  }

  resetForm() {
    this.addressForm = {
      receiver_name: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      postal_code: '',
      references: ''
    };
  }

  // =========================
  // SAVE ADDRESS
  // =========================
  saveAddress() {
    if (this.isEditMode && this.editingAddressId) {
      this.addressService
        .updateAddress(this.editingAddressId, this.addressForm)
        .subscribe(() => {
          this.loadAddresses();
          this.closeModal();
        });
    } else {
      this.addressService
        .createAddress(this.addressForm)
        .subscribe(() => {
          this.loadAddresses();
          this.closeModal();
        });
    }
  }
}
